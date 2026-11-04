-- ATELIER : appliquer dans un projet dédié. Aucun objet des autres applications n'est modifié.
begin;
create table if not exists public.atelier_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.atelier_admins enable row level security;
revoke all on public.atelier_admins from anon, authenticated;
grant select on public.atelier_admins to anon, authenticated;
create policy atelier_admin_self on public.atelier_admins for select to authenticated using (user_id=(select auth.uid()));

create table public.atelier_products (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 1 and 120),
 category text not null check(char_length(category) between 1 and 60),
 description text not null default '' check(char_length(description)<=4000),
 price integer not null check(price between 0 and 100000000),
 status text not null default 'draft' check(status in ('draft','published','archived')),
 media jsonb not null default '[]'::jsonb check(jsonb_typeof(media)='array' and jsonb_array_length(media)<=12),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.atelier_variants (
 product_id uuid not null references public.atelier_products(id) on delete cascade,
 size text not null check(char_length(size) between 1 and 20),
 color text not null check(char_length(color) between 1 and 40),
 stock integer not null default 0 check(stock between 0 and 1000000),
 primary key(product_id,size,color)
);
create index atelier_products_public on public.atelier_products(status,created_at desc);
alter table public.atelier_products enable row level security;
alter table public.atelier_variants enable row level security;
revoke all on public.atelier_products,public.atelier_variants from anon,authenticated;
grant select on public.atelier_products,public.atelier_variants to anon,authenticated;
grant insert,update,delete on public.atelier_products,public.atelier_variants to authenticated;
create policy atelier_product_read on public.atelier_products for select to anon,authenticated using (
 status='published' or exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid()))
);
create policy atelier_product_insert on public.atelier_products for insert to authenticated with check(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
create policy atelier_product_update on public.atelier_products for update to authenticated using(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
create policy atelier_product_delete on public.atelier_products for delete to authenticated using(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
create policy atelier_variant_read on public.atelier_variants for select to anon,authenticated using(exists(select 1 from public.atelier_products p where p.id=product_id));
create policy atelier_variant_write on public.atelier_variants for all to authenticated using(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));

create table public.atelier_settings (
 id boolean primary key default true check(id),
 brand text not null default 'ATELIER' check(char_length(brand) between 1 and 60),
 whatsapp text not null default '' check(whatsapp='' or whatsapp ~ '^[0-9]{8,15}$')
);
alter table public.atelier_settings enable row level security;
revoke all on public.atelier_settings from anon,authenticated;
grant select on public.atelier_settings to anon,authenticated;
grant update on public.atelier_settings to authenticated;
create policy atelier_settings_read on public.atelier_settings for select to anon,authenticated using(true);
create policy atelier_settings_update on public.atelier_settings for update to authenticated using(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
insert into public.atelier_settings(id) values(true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('atelier-media','atelier-media',false,26214400,array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm']);
create policy atelier_media_read on storage.objects for select to anon,authenticated using (
 bucket_id='atelier-media' and (
 exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())) or
 exists(select 1 from public.atelier_products p cross join lateral jsonb_array_elements(p.media) m where p.status='published' and m->>'path'=name)
 ));
create policy atelier_media_insert on storage.objects for insert to authenticated with check(bucket_id='atelier-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
create policy atelier_media_update on storage.objects for update to authenticated using(bucket_id='atelier-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid()))) with check(bucket_id='atelier-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));
create policy atelier_media_delete on storage.objects for delete to authenticated using(bucket_id='atelier-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_admins a where a.user_id=(select auth.uid())));

create function public.atelier_save_product(p_product jsonb,p_variants jsonb,p_expected_updated_at timestamptz default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare v_id uuid; v_current timestamptz; v_media jsonb; v_item jsonb; v_result jsonb;
begin
 if not exists(select 1 from public.atelier_admins where user_id=auth.uid()) then raise exception 'Accès administrateur requis' using errcode='42501'; end if;
 v_id=coalesce(nullif(p_product->>'id','')::uuid,gen_random_uuid());
 if jsonb_typeof(p_variants)<>'array' or jsonb_array_length(p_variants)<1 or jsonb_array_length(p_variants)>100 then raise exception 'Variantes invalides'; end if;
 v_media=coalesce(p_product->'media','[]'::jsonb);
 if jsonb_typeof(v_media)<>'array' or jsonb_array_length(v_media)>12 then raise exception 'Médias invalides'; end if;
 for v_item in select * from jsonb_array_elements(v_media) loop
  if coalesce(v_item->>'kind','') not in ('image','video','atlas') or coalesce(v_item->>'path','') !~ '^[a-f0-9-]{36}/[a-f0-9-]{36}\.(webp|png|jpg|jpeg|avif|mp4|webm)$' then raise exception 'Format média invalide'; end if;
  if not exists(select 1 from storage.objects where bucket_id='atelier-media' and name=v_item->>'path') then raise exception 'Fichier non disponible'; end if;
  if v_item->>'kind'='atlas' and (coalesce((v_item->>'cols')::int,0) not between 1 and 12 or coalesce((v_item->>'rows')::int,0) not between 1 and 12 or coalesce((v_item->>'frames')::int,0) not between 2 and 90 or (v_item->>'frames')::int>(v_item->>'cols')::int*(v_item->>'rows')::int) then raise exception 'Grille animation invalide'; end if;
 end loop;
 if p_product->>'status'='published' and (not exists(select 1 from jsonb_array_elements(v_media) m where m->>'kind'='image') or (p_product->>'price')::int<=0) then raise exception 'Une photo et un prix positif sont nécessaires pour publier'; end if;
 if nullif(p_product->>'id','') is not null then
  select updated_at into v_current from public.atelier_products where id=v_id for update;
  if not found then raise exception 'Produit introuvable'; end if;
  if v_current is distinct from p_expected_updated_at then raise exception 'Produit modifié dans une autre session. Rechargez la liste.' using errcode='40001'; end if;
 end if;
 insert into public.atelier_products(id,name,category,description,price,status,media) values(v_id,p_product->>'name',p_product->>'category',coalesce(p_product->>'description',''),(p_product->>'price')::integer,p_product->>'status',v_media)
 on conflict(id) do update set name=excluded.name,category=excluded.category,description=excluded.description,price=excluded.price,status=excluded.status,media=excluded.media,updated_at=clock_timestamp();
 delete from public.atelier_variants where product_id=v_id;
 insert into public.atelier_variants(product_id,size,color,stock) select v_id,v->>'size',v->>'color',(v->>'stock')::integer from jsonb_array_elements(p_variants) v;
 select to_jsonb(p) into v_result from public.atelier_products p where id=v_id;
 return v_result;
end $$;
revoke all on function public.atelier_save_product(jsonb,jsonb,timestamptz) from public,anon;
grant execute on function public.atelier_save_product(jsonb,jsonb,timestamptz) to authenticated;
commit;

-- Activation du propriétaire : à exécuter séparément après création de SON compte Auth.
-- Vérifier son adresse et email_confirmed_at dans le dashboard, puis attribuer SON UUID :
-- insert into public.atelier_admins(user_id) values ('UUID_DU_PROPRIETAIRE_VERIFIE');
-- Ne jamais donner ce rôle à tous les comptes ou autoriser l'auto-attribution côté navigateur.
