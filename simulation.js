'use strict';
const LAB_VERSION='2026.10.01.2';
const FAMILY_MEMBERS=new Map();
QUESTIONS.forEach(q=>{const family=familyOf(q);if(!FAMILY_MEMBERS.has(family))FAMILY_MEMBERS.set(family,[]);FAMILY_MEMBERS.get(family).push(q.id);});
let cameraStream=null;
function familyWasSeen(q){return FAMILY_MEMBERS.get(familyOf(q)).some(id=>state.items[id]);}
function expertPool(d,kind){return QUESTIONS.filter(q=>demanding(q)&&(!d||q.d===d)&&(!kind||q.kind===kind));}
function familyFresh(qs){return shuffle(qs).sort((a,b)=>Number(familyWasSeen(a))-Number(familyWasSeen(b))||Number(!!state.items[a.id])-Number(!!state.items[b.id])||b.lv-a.lv);}
function expertExam(profile='balanced'){
  const counts=profile==='verbal'?{afdb:10,africa:10,sjt:10,reason:20}:{afdb:13,africa:12,sjt:13,reason:12};
  const used=new Set(),picked=[];
  function take(qs,n){if(n<=0)return;for(const q of familyFresh(qs)){if(!used.has(familyOf(q))){used.add(familyOf(q));picked.push(q);if(--n===0)return;}}}
  for(const d of ['afdb','africa','sjt'])take(expertPool(d),counts[d]);
  const verbal=profile==='verbal'?14:8;
  take(expertPool('reason','verbal'),verbal);
  take(expertPool('reason','logic'),profile==='verbal'?4:2);
  take(expertPool('reason','detail'),2);
  return shuffle(picked);
}
function expertHome(){
  const fresh=QUESTIONS.filter(q=>demanding(q)&&!familyWasSeen(q));
  app.innerHTML=`<div class="hero wide lab-hero"><div><span class="tag">SIMULATION IMMERSIVE · INSPIRÉE DU PARCOURS BRYQ</span><h2>Décider avec précision, jusqu’à la dernière étape.</h2><p>Cas longs, contraintes croisées et arbitrages professionnels. Les 50 questions et 50 minutes suivent les consignes reçues. La sélection des cas et la répartition sont pédagogiques.</p><div class="lab-metrics"><span><b>${EXPERT_QUESTIONS.length}</b> nouveaux cas</span><span><b>50</b> réponses obligatoires</span><span><b>4</b> étapes du parcours</span></div></div></div>
  <div class="flow-steps" aria-label="Étapes de la simulation"><span>1 · Préparation</span><span>2 · Évaluation</span><span>3 · Questionnaire</span><span>4 · Confirmation</span></div>
  <div class="module-grid"><div class="panel"><h3>Régler la simulation</h3><label for="labDuration">Durée</label><select id="labDuration"><option value="50">50 minutes · durée confirmée</option><option value="35">35 minutes · surentraînement volontaire</option></select><label for="labProfile">Composition de l’entraînement</label><select id="labProfile"><option value="balanced">Quatre domaines · 8 passages verbaux minimum</option><option value="verbal">Verbal renforcé · 14 passages et 6 autres raisonnements</option></select><p class="muted">Cette répartition n’est pas annoncée par la BAD. Niveau 5 : complexité estimée par la rédaction, sans calibration psychométrique.</p><p><b>${new Set(fresh.map(familyOf)).size} familles de cas encore inédites</b> sur cet appareil. Un nouvel énoncé portant sur un passage déjà lu est signalé comme familier.</p></div>
  <div class="panel"><h3>Préparer les conditions réelles</h3><p>Pour l’épreuve : ordinateur recommandé, connexion stable et caméra active. Le courriel du 1er octobre confirme la possibilité de passer en français ou en anglais.</p><div class="checklist">${[['quiet','Je dispose du temps nécessaire au calme.'],['rules','Je répondrai seul, sans notes ni aide pendant cette simulation.'],['finish','Je terminerai aussi le questionnaire après « Voir les résultats ».']].map(([id,label])=>`<label><input type="checkbox" id="lab-${id}"> <span>${label}</span></label>`).join('')}</div><button class="ghost" onclick="checkCamera()">Vérifier ma caméra · facultatif ici</button><p id="cameraStatus" class="muted" role="status">Vérification locale seulement. Aucune capture, aucun enregistrement ni transmission d’image.</p><video id="cameraPreview" autoplay muted playsinline hidden aria-label="Aperçu local de la caméra"></video></div></div>
  <div class="panel start-panel"><h3>Une seule session, sans pause</h3><p>Le temps commence au lancement, continue si tu changes d’onglet ou recharges la page et n’impose aucune limite par question. Les sorties d’onglet sont comptées localement pour travailler la concentration ; ce compteur n’est pas une surveillance Bryq.</p><div class="actions"><button class="btn gold" onclick="startImmersive()">Commencer la simulation</button><button class="ghost" onclick="showView('lab')">Apprendre avant de simuler</button></div><p id="labError" class="form-error" role="alert"></p></div>`;
}
async function checkCamera(){
 const status=$('#cameraStatus');if(!status)return;
 stopCamera();
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('unavailable');
  cameraStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
  const preview=$('#cameraPreview');
  if(!preview){stopCamera();return;}
  preview.srcObject=cameraStream;preview.hidden=false;
  status.textContent='Caméra visible sur cet appareil. Aucune image n’est enregistrée ou transmise. Elle sera arrêtée au lancement de l’entraînement.';
 }catch{status.textContent='Caméra non disponible ou autorisation refusée. L’entraînement reste accessible ; vérifie ton matériel avant l’épreuve officielle.';}
}
function stopCamera(){if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;}const preview=$('#cameraPreview');if(preview){preview.srcObject=null;preview.hidden=true;}}
function startImmersive(){
 if(!['quiet','rules','finish'].every(k=>$('#lab-'+k)?.checked)){$('#labError').textContent='Confirme les trois points de préparation avant de lancer le chronomètre.';return;}
 const minutes=$('#labDuration').value==='35'?35:50,profile=$('#labProfile').value==='verbal'?'verbal':'balanced';
 stopCamera();startQuiz(expertExam(profile),true,'Simulation immersive · '+minutes+' minutes',{strict:true,forward:true,durationMs:minutes*60000,kind:'exam',preset:minutes===35?'expert-overload':'expert',immersive:true,profile});
}
function focusSession(on){if(document.body)document.body.classList.toggle('assessment-focus',!!on);}
function protocolBar(){if(!session?.immersive)return '';return `<div class="protocol-bar"><span>SIMULATION · QUESTIONS ORIGINALES</span><span>Réponses validées définitives · ${session.distractions||0} sortie(s) d’onglet observée(s)</span></div>`;}
function restoreWorkflow(){
 const flow=state.flow;if(!flow)return false;
 if(!state.history.some(h=>h.id===flow.resultId)){delete state.flow;save();return false;}
 renderWorkflow();return true;
}
function renderWorkflow(){
 const flow=state.flow,r=state.history.find(h=>h.id===flow?.resultId);if(!r){focusSession(false);dashboard();return;}
 focusSession(true);$('#pageTitle').textContent='Parcours de fin · simulation';
 const banner='<p class="notice">Simulation de préparation indépendante. Aucun envoi à la BAD ou à Bryq. Les champs et l’écran sont fictifs ; seule l’obligation de terminer les deux étapes vient de ton invitation.</p>';
 if(flow.stage==='submitted')app.innerHTML=`${banner}<div class="panel flow-panel"><span class="tag">ÉVALUATION SOUMISE · SIMULATION</span><h2>Il reste une étape à terminer.</h2><p>Dans ton invitation, « Voir les résultats » conduit au questionnaire démographique obligatoire. Il n’affiche pas ton score officiel.</p><p>Le bilan de cet entraînement sera disponible après la confirmation finale.</p><button class="btn" onclick="nextDemographic()">Voir les résultats · See Results</button></div>`;
 else if(flow.stage==='demographic')app.innerHTML=`${banner}<div class="panel flow-panel"><span class="tag">QUESTIONNAIRE FICTIF</span><h2>Vérifier la nationalité déclarée.</h2><p>Pour l’épreuve officielle, renseigne la même nationalité que dans ta candidature. Ici, utilise le profil fictif <b>nationalité : togolaise</b>.</p><label for="demoNationality">Nationalité du profil fictif</label><select id="demoNationality"><option value="">Choisir</option><option value="togo">Togolaise</option><option value="other">Une autre nationalité</option></select><label class="check-label"><input id="demoConfirm" type="checkbox"> Je confirme la cohérence avec le profil fictif.</label><p id="demoError" class="form-error" role="alert"></p><button class="btn" onclick="submitDemographic()">Soumettre le questionnaire fictif</button><p class="muted">Aucune donnée démographique réelle n’est demandée ni conservée.</p></div>`;
 else app.innerHTML=`${banner}<div class="panel flow-panel"><span class="tag">PARCOURS TERMINÉ · SIMULATION</span><h2>Les deux étapes sont terminées.</h2><p>Tu as soumis l’évaluation d’entraînement et le questionnaire fictif. Le parcours de fin est validé.</p><p>${r.status==='completed'?'':'Le chronomètre a expiré ou la séance a été interrompue : consulte les omissions dans le bilan.'}</p><button class="btn" onclick="closeWorkflow()">Ouvrir mon bilan d’entraînement</button></div>`;
}
function nextDemographic(){if(state.flow?.stage!=='submitted')return;state.flow.stage='demographic';save();renderWorkflow();}
function submitDemographic(){
 if(state.flow?.stage!=='demographic')return;
 if($('#demoNationality').value!=='togo'||!$('#demoConfirm').checked){$('#demoError').textContent='Choisis la nationalité togolaise du profil fictif et confirme sa cohérence. Dans le vrai questionnaire, reprends celle de ta candidature.';return;}
 const r=state.history.find(h=>h.id===state.flow.resultId);if(r){r.workflowComplete=true;r.workflowCompletedAt=new Date().toISOString();}
 state.flow.stage='done';save();renderWorkflow();
}
function closeWorkflow(){if(state.flow?.stage!=='done')return;const r=state.history.find(h=>h.id===state.flow.resultId);delete state.flow;save();focusSession(false);renderResult(r);}
function onVisibility(){if(session?.immersive&&document.visibilityState==='hidden'){session.distractions=(session.distractions||0)+1;saveSession();}}

const LAB_EXAMPLES=[
 {passage:'Aucun dossier incomplet n’a été accepté. K a été accepté.',statement:'K est complet.',answer:0,why:'Accepté implique complet. Le texte permet une déduction, même sans répéter mot pour mot « K est complet ».'},
 {passage:'Certains dossiers complets n’ont pas été acceptés. K est complet ; aucune décision sur K n’est donnée.',statement:'K a été accepté.',answer:2,why:'K peut être accepté ou refusé. La complétude ne suffit pas à obtenir l’acceptation.'},
 {passage:'K est complet. La décision publiée précise que K a été refusé.',statement:'K a été accepté.',answer:1,why:'Le refus explicite impose le contraire. Ce n’est pas une simple absence d’information.'}
];
let labExample=0,labRevealed=false;
function learningLab(){
 const q=LAB_EXAMPLES[labExample],labels=['Vrai','Faux','Impossible à déterminer'];
 app.innerHTML=`<div class="hero wide"><div><span class="tag">LABORATOIRE VRAI · FAUX · IMPOSSIBLE</span><h2>Fais la différence entre preuve et plausibilité.</h2><p>La réponse dépend du texte, même lorsqu’il décrit une situation inhabituelle. Une information absente ne devient pas fausse ; une contradiction explicite ne devient pas inconnue.</p></div></div><div class="module-grid"><div class="panel"><h3>Les quatre vérifications</h3><ol class="decision-method"><li><b>Périmètre :</b> même groupe, personne, document et période ?</li><li><b>Direction :</b> la règle va-t-elle de A vers B ou de B vers A ?</li><li><b>Preuve :</b> l’affirmation ou son contraire est-il imposé ?</li><li><b>Deux scénarios :</b> si vrai et faux restent possibles, choisis impossible.</li></ol></div><div class="panel"><span class="tag">CONTRASTE ${labExample+1} / ${LAB_EXAMPLES.length}</span><p class="stimulus">${esc(q.passage)}</p><h3>${esc(q.statement)}</h3><div class="actions">${labels.map((l,i)=>`<button class="ghost" onclick="answerLabExample(${i})">${l}</button>`).join('')}</div><p id="labExampleFeedback" role="status">${labRevealed?esc(q.why):'Choisis une réponse pour voir ce qui est prouvé.'}</p><button class="mini" onclick="nextLabExample()">Contraste suivant →</button></div></div>
 <div class="panel"><h3>Passer de la méthode à la pression</h3><p>Commence par justifier tes choix et lire les deux scénarios des réponses impossibles. Passe ensuite au défi avec une limite par question : c’est un surentraînement, pas une limite officielle BAD.</p><div class="actions"><button class="btn" onclick="startExpertCoach()">Passages denses · 12 sans chrono</button><button class="ghost" onclick="startUncertainty()">Impossible à déterminer · 10 cas</button><button class="ghost" onclick="startRemediation()">Ma confusion la plus fréquente</button></div><label for="labItemSeconds">Chronomètre pédagogique par question</label><select id="labItemSeconds"><option value="60">60 secondes</option><option value="45">45 secondes</option><option value="30">30 secondes · pression forte</option></select><button class="btn" onclick="startPressureDrill()">Défi verbal · 12 questions</button></div>${readinessPanel()}`;
}
function answerLabExample(i){labRevealed=true;const q=LAB_EXAMPLES[labExample];$('#labExampleFeedback').textContent=(i===q.answer?'Correct. ':'À revoir. ')+q.why;}
function nextLabExample(){labExample=(labExample+1)%LAB_EXAMPLES.length;labRevealed=false;learningLab();}
function startExpertCoach(){startQuiz(uniqueFamilies(familyFresh(expertPool('reason','verbal')),12),false,'Lecture dense · preuves et scénarios',{guided:true,kind:'coach',preset:'expert-guided'});}
function startUncertainty(){startQuiz(uniqueFamilies(familyFresh(expertPool('reason','verbal').filter(q=>q.a===2&&q.worlds?.length===2)),10),false,'Information manquante · deux scénarios',{guided:true,kind:'coach',preset:'expert-guided'});}
function confusionRows(){return state.history.flatMap(h=>h.rows||[]).filter(r=>r.sel!==null&&QUESTIONS.find(q=>q.id===r.id)?.kind==='verbal');}
function startRemediation(){
 const counts=new Map();for(const r of confusionRows()){const q=QUESTIONS.find(q=>q.id===r.id);if(q.a!==r.sel){const key=q.a+'-'+r.sel;counts.set(key,(counts.get(key)||0)+1);}}
 const key=[...counts].sort((a,b)=>b[1]-a[1])[0]?.[0];
 if(!key){startExpertCoach();return;}
 const [expected,chosen]=key.split('-').map(Number),labels=['Vrai','Faux','Impossible'];
 const focus=uniqueFamilies(familyFresh(expertPool('reason','verbal').filter(q=>q.a===expected)),6);
 const used=new Set(focus.map(familyOf));
 const contrast=uniqueFamilies(familyFresh(expertPool('reason','verbal').filter(q=>q.a!==expected&&!used.has(familyOf(q)))),6);
 startQuiz(shuffle([...focus,...contrast]),false,`Corriger ${labels[expected]} confondu avec ${labels[chosen]}`,{guided:true,kind:'coach',preset:'expert-guided'});
}
function startPressureDrill(){const seconds=[30,45,60].includes(Number($('#labItemSeconds').value))?Number($('#labItemSeconds').value):60;startQuiz(uniqueFamilies(familyFresh(expertPool('reason','verbal')),12),false,`Défi verbal · ${seconds} s par question`,{strict:true,forward:true,itemMs:seconds*1000,durationMs:seconds*12000,kind:'sprint',preset:'pressure'});}
function twoWorlds(q){return q.worlds?`<div class="worlds"><b>Pourquoi impossible ? Les deux situations respectent le passage.</b><div class="method-grid">${q.worlds.map((w,i)=>`<article><span class="tag">SCÉNARIO ${i+1}</span><p>${esc(w)}</p></article>`).join('')}</div></div>`:'';}
function readinessPanel(){
 const exams=state.history.filter(h=>h.exam&&h.status==='completed'&&h.familyNovelTotal>=35&&h.elapsed<=3000).slice(0,3);
 const labels=['Vrai','Faux','Impossible'],rows=confusionRows();
 const entries=labels.map((label,i)=>{const selected=rows.filter(r=>QUESTIONS.find(q=>q.id===r.id).a===i);return `<tr><th>${label}</th><td>${selected.filter(r=>r.sel===i).length} / ${selected.length}</td><td>${selected.filter(r=>r.sel!==i).length}</td></tr>`;}).join('');
 return `<div class="panel"><h3>Mesure de préparation personnelle</h3><p>${exams.length?exams.map(h=>`${h.familyNovelCorrect}/${h.familyNovelTotal} sur des familles inédites · ${time(h.elapsed)}`).join('<br>'):'Pas encore de simulation complète avec au moins 35 familles inédites. Commence par une simulation immersive.'}</p><p>Repère volontaire : deux simulations complètes avec une bonne précision sur des familles inédites, puis une correction des erreurs récurrentes. Ce repère n’est ni un seuil BAD ni une estimation de classement.</p><div class="table-scroll"><table><caption>Justesse par réponse attendue · toutes les tentatives locales</caption><thead><tr><th>Attendue</th><th>Correctes / tentatives</th><th>Erreurs</th></tr></thead><tbody>${entries}</tbody></table></div></div>`;
}
function executionPanel(r){
 const valid=r.rows.filter(row=>QUESTIONS.find(q=>q.id===row.id)),n=r.familyNovelTotal;
 const early=valid.slice(0,Math.ceil(valid.length/2)),late=valid.slice(Math.ceil(valid.length/2));
 const correct=rs=>rs.filter(row=>row.sel===QUESTIONS.find(q=>q.id===row.id).a).length;
 const slow=valid.filter(row=>row.sel===QUESTIONS.find(q=>q.id===row.id).a&&row.seconds>(QUESTIONS.find(q=>q.id===row.id).targetSeconds||60));
 const fastErrors=valid.filter(row=>row.sel!==null&&row.sel!==QUESTIONS.find(q=>q.id===row.id).a&&row.seconds<20);
 return `<div class="panel execution"><h3>Précision et rythme</h3>${Number.isInteger(n)?`<p><b>Familles réellement inédites :</b> ${r.familyNovelCorrect}/${n}${n?' · '+pct(r.familyNovelCorrect,n)+'%':''}. Un nouvel énoncé d’un passage déjà connu ne compte pas ici.</p>`:'<p>Cette ancienne séance ne mesurait pas les familles inédites.</p>'}<div class="grid4"><div><b>${correct(early)}/${early.length}</b><small>Première moitié</small></div><div><b>${correct(late)}/${late.length}</b><small>Seconde moitié</small></div><div><b>${fastErrors.length}</b><small>Erreurs en moins de 20 s</small></div><div><b>${slow.length}</b><small>Justes mais au-delà du repère</small></div></div><p class="muted">Les moitiés contiennent des questions différentes ; un écart ne prouve pas une fatigue. Les repères de temps sont pédagogiques. ${r.immersive?'Sorties d’onglet observées : '+(r.distractions||0)+'.':''}</p>${slow.length?`<p>À fluidifier : ${slow.slice(0,4).map(row=>esc(QUESTIONS.find(q=>q.id===row.id).fr)).join(' · ')}</p>`:''}${r.immersive?`<p><b>Parcours final :</b> ${r.workflowComplete?'questionnaire fictif et confirmation terminés.':'à compléter.'}</p>`:''}</div>`;
}
