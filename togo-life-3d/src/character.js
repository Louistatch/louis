import * as THREE from '../vendor/three.module.js';

/** Original articulated adult avatar. Metres, feet at y=0, forward +Z.
 * No third-party models. The single body mesh uses an actual GPU skinning rig.
 * Synchronous API: {group, mesh, skeleton, update(dt, metresPerSecond), dispose}.
 */
export function createCharacter({skin='#70432e', shirt='#e3b24d', trousers='#263a47', hair='#171211', scale=1}={}) {
  const group=new THREE.Group(); group.name='TogoLifeAvatar'; group.scale.setScalar(scale);
  const bones=[], joints={};
  function joint(name,parent,x,y,z=0){const b=new THREE.Bone();b.name=name;b.position.set(x,y,z);if(parent)parent.add(b);bones.push(b);joints[name]=b;return b;}
  const root=joint('root',null,0,0,0), pelvis=joint('pelvis',root,0,.91), spine=joint('spine',pelvis,0,.18), chest=joint('chest',spine,0,.22), neck=joint('neck',chest,0,.17), head=joint('head',neck,0,.1);
  for(const [side,s] of [['left',1],['right',-1]]){
    const hip=joint(side+'Hip',pelvis,s*.105,-.03), knee=joint(side+'Knee',hip,0,-.40), ankle=joint(side+'Ankle',knee,0,-.40), foot=joint(side+'Foot',ankle,0,-.035,.045);
    const shoulder=joint(side+'Shoulder',chest,s*.22,.025), elbow=joint(side+'Elbow',shoulder,s*.09,-.265), wrist=joint(side+'Wrist',elbow,s*.035,-.235);
    joint(side+'Hand',wrist,0,-.07);
  }
  group.add(root);group.updateMatrixWorld(true);
  const positions=[],indices=[],skinIndices=[],skinWeights=[],colors=[];
  const c=new THREE.Color();
  const origin=new THREE.Vector3();
  // A ring is [centreX, y, centreZ, halfWidth, halfDepth, colour].
  // Rings share edges. Joints blend across adjacent bones instead of separate beads.
  function vertex(x,y,z,color,weights){
    positions.push(x,y,z);c.set(color);colors.push(c.r,c.g,c.b);
    const w=weights(x,y,z);for(let i=0;i<4;i++){skinIndices.push(w[i]?.[0]??0);skinWeights.push(w[i]?.[1]??0);}
  }
  const rigid=b=>()=>[[bones.indexOf(b),1]];
  function between(a,b,value,low,high){const t=THREE.MathUtils.smoothstep(value,low,high);return [[bones.indexOf(a),1-t],[bones.indexOf(b),t]];}
  function profile(rings,weights,segments=20){
    const offset=positions.length/3;
    for(const [x,y,z,rx,rz,color] of rings){
      for(let j=0;j<segments;j++){const angle=j/segments*Math.PI*2;vertex(x+Math.cos(angle)*rx,y,z+Math.sin(angle)*rz,color,weights);}
    }
    for(let i=0;i<rings.length-1;i++)for(let j=0;j<segments;j++){
      const a=offset+i*segments+j,b=offset+i*segments+(j+1)%segments,d=b+segments,k=a+segments;
      indices.push(a,k,b,b,k,d);
    }
    // End caps close the textile surfaces; separate cap vertices preserve sharp hems.
    for(const [r,reverse] of [[0,true],[rings.length-1,false]]){
      const [x,y,z,rx,rz,color]=rings[r],center=positions.length/3;vertex(x,y,z,color,weights);
      for(let j=0;j<segments;j++){const a=offset+r*segments+j,b=offset+r*segments+(j+1)%segments;indices.push(center,reverse?a:b,reverse?b:a);}
    }
  }
  function detail(bone,center,size,color,segments=12){
    // Facial features only: organic small forms, never used for torso or limbs.
    const g=new THREE.SphereGeometry(1,Math.min(segments,12),5),base=positions.length/3;bone.getWorldPosition(origin);
    for(let i=0;i<g.attributes.position.count;i++)vertex(origin.x+center[0]+g.attributes.position.getX(i)*size[0],origin.y+center[1]+g.attributes.position.getY(i)*size[1],origin.z+center[2]+g.attributes.position.getZ(i)*size[2],color,rigid(bone));
    for(const idx of g.index.array)indices.push(base+idx);g.dispose();
  }
  function block(bone,center,size,color){
    const g=new THREE.BoxGeometry(...size),base=positions.length/3;bone.getWorldPosition(origin);
    for(let i=0;i<g.attributes.position.count;i++)vertex(origin.x+center[0]+g.attributes.position.getX(i),origin.y+center[1]+g.attributes.position.getY(i),origin.z+center[2]+g.attributes.position.getZ(i),color,rigid(bone));
    for(const idx of g.index.array)indices.push(base+idx);g.dispose();
  }
  const torsoWeights=(x,y)=>y<1.14?between(pelvis,spine,y,.98,1.13):between(spine,chest,y,1.14,1.30);
  const row=(y,rx,rz,color,x=0,z=0)=>[x,y,z,rx,rz,color];
  // One tailored shirt surface: hem, waist, rib cage, chest and sloped shoulders.
  profile([
    row(.952,.161,.108,shirt),row(.968,.162,.109,shirt),row(1.035,.160,.106,shirt),
    row(1.12,.171,.109,shirt),row(1.23,.188,.116,shirt),row(1.315,.208,.12,shirt),
    row(1.365,.211,.114,shirt),row(1.398,.186,.105,shirt),row(1.431,.105,.072,shirt),row(1.449,.058,.052,shirt)
  ],torsoWeights,32);
  // Fine contrasting standing collar and a stitched vertical placket.
  const trim='#8b7250';
  profile([row(1.44,.059,.053,trim),row(1.463,.058,.052,trim)],rigid(neck),24);
  block(chest,[0,-.015,.121],[.014,.18,.003],trim);
  for(const y of [.04,-.015,-.07])detail(chest,[0,y,.125],[.0035,.0035,.0025],'#d8bd85',8);
  // Breast pocket with a thin opening and short stitch lines.
  block(chest,[.094,-.021,.112],[.058,.063,.004],shirt);
  block(chest,[.094,.010,.116],[.060,.003,.003],trim);
  // Continuous hips under the shirt, with a defined belt rather than a pelvic sphere.
  profile([row(.82,.145,.083,trousers),row(.855,.166,.096,trousers),row(.918,.164,.101,trousers),row(.958,.159,.106,trousers)],rigid(pelvis),28);
  profile([row(.939,.162,.109,'#403428'),row(.953,.162,.109,'#403428')],rigid(pelvis),28);
  block(pelvis,[0,.036,.113],[.036,.022,.005],'#bba579');
  // Neck and jaw are narrow relative to shoulders: an adult silhouette.
  profile([row(1.445,.049,.047,skin),row(1.486,.048,.046,skin),row(1.539,.05,.048,skin)],rigid(neck),20);
  profile([
    row(1.509,.041,.054,skin,0,.013),row(1.524,.063,.068,skin,0,.012),row(1.551,.080,.078,skin),
    row(1.596,.091,.087,skin),row(1.644,.094,.090,skin),row(1.689,.089,.085,skin),
    row(1.728,.072,.070,skin),row(1.750,.038,.043,skin),row(1.756,.006,.01,skin)
  ],rigid(head),32);
  // Close cropped hair, with a straight but softened front hairline.
  profile([row(1.684,.091,.087,hair,0,-.002),row(1.711,.087,.083,hair,0,-.002),row(1.744,.068,.066,hair,0,-.002),row(1.764,.031,.038,hair,0,-.002),row(1.768,.002,.004,hair)],rigid(head),28);
  detail(head,[0,.021,.093],[.020,.034,.023],skin,16);
  detail(head,[0,-.013,.106],[.024,.011,.015],skin,16);
  detail(head,[0,-.040,.079],[.030,.005,.007],'#492b23',16);
  detail(head,[0,-.047,.083],[.025,.005,.006],skin,16);
  for(const [side,sign] of [['left',1],['right',-1]]){
    const x=.105*sign,hip=joints[side+'Hip'],knee=joints[side+'Knee'],ankle=joints[side+'Ankle'],foot=joints[side+'Foot'];
    const legWeights=(x,y)=>y>.30?between(knee,hip,y,.43,.55):between(ankle,knee,y,.095,.20);
    profile([
      row(.115,.053,.052,trousers,x),row(.135,.055,.054,trousers,x),row(.23,.056,.055,trousers,x),
      row(.35,.061,.060,trousers,x),row(.465,.066,.062,trousers,x),row(.52,.068,.064,trousers,x),
      row(.65,.078,.072,trousers,x),row(.775,.085,.079,trousers,x),row(.878,.085,.082,trousers,x)
    ],legWeights,20);
    // Trouser seam, ankle cuff and a laced sneaker with a layered sole.
    profile([row(.115,.054,.053,'#344956',x),row(.132,.055,.054,'#344956',x)],rigid(ankle),20);
    profile([row(.017,.068,.119,'#393b37',x,.047),row(.037,.069,.121,'#d1ccbe',x,.047),row(.050,.070,.120,'#d1ccbe',x,.047),row(.065,.067,.114,'#e5dfd0',x,.047),row(.084,.062,.103,'#e5dfd0',x,.040),row(.103,.053,.079,'#e5dfd0',x,.019),row(.118,.047,.051,'#e5dfd0',x,-.002)],rigid(foot),20);
    for(let i=0;i<3;i++)block(foot,[0,.053+i*.006,.067-i*.022],[.058,.004,.005],'#bdb6a6');
    const shoulder=joints[side+'Shoulder'],elbow=joints[side+'Elbow'],wrist=joints[side+'Wrist'],hand=joints[side+'Hand'];
    const armWeights=(x,y)=>y>1?between(elbow,shoulder,y,1.04,1.14):between(wrist,elbow,y,.82,.92);
    // The sleeve and exposed arm are successive rings of one watertight tube.
    profile([
      row(.83,.027,.029,skin,.345*sign),row(.865,.029,.031,skin,.342*sign),row(.94,.037,.038,skin,.333*sign),
      row(1.015,.043,.041,skin,.321*sign),row(1.075,.041,.042,skin,.309*sign),row(1.14,.047,.046,skin,.296*sign),
      row(1.195,.049,.047,skin,.281*sign),row(1.204,.058,.057,shirt,.279*sign),row(1.24,.060,.060,shirt,.273*sign),
      row(1.295,.062,.064,shirt,.259*sign),row(1.345,.061,.067,shirt,.241*sign),row(1.382,.047,.053,shirt,.225*sign)
    ],armWeights,20);
    profile([row(1.203,.059,.058,trim,.279*sign),row(1.214,.059,.058,trim,.277*sign)],rigid(shoulder),20);
    profile([row(.714,.018,.016,skin,.345*sign),row(.732,.028,.020,skin,.345*sign),row(.76,.033,.021,skin,.345*sign),row(.792,.032,.023,skin,.345*sign),row(.833,.027,.028,skin,.345*sign)],rigid(hand),16);
    detail(hand,[-sign*.025,.010,.005],[.014,.037,.017],skin);
    detail(head,[sign*.095,.035,0],[.016,.027,.014],skin);
    detail(head,[sign*.037,.055,.084],[.022,.007,.007],'#d7c8b6',16);
    detail(head,[sign*.037,.055,.090],[.006,.006,.002],'#231912');
    detail(head,[sign*.037,.073,.084],[.025,.004,.005],hair,16);
    detail(head,[sign*.013,-.015,.113],[.004,.003,.003],'#382219',8);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeights,4));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0});
  const mesh=new THREE.SkinnedMesh(geometry,material);mesh.name='OriginalTailoredAdultSkinnedBody';mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;group.add(mesh);group.updateMatrixWorld(true);
  const skeleton=new THREE.Skeleton(bones);mesh.bind(skeleton);
  let phase=0, blend=0, runBlend=0, state='Idle';
  function update(dt,speed=0){
    dt=Math.min(Math.max(dt,0),.06);speed=Math.max(0,Math.abs(speed));const moving=speed>.08;
    blend=THREE.MathUtils.damp(blend,moving?1:0,9,dt);runBlend=THREE.MathUtils.damp(runBlend,THREE.MathUtils.clamp((speed-2)/2,0,1),6,dt);
    state=!moving?'Idle':speed>2.8?'Run':'Walk';
    // Cadence derives from travelled distance and stride length, avoiding a fixed-rate glide.
    phase+=dt*speed/(.70+runBlend*.65)*Math.PI*2;
    const swing=(.38+runBlend*.32)*blend;
    for(const [side,offset] of [['left',0],['right',Math.PI]]){
      const p=phase+offset, stride=Math.sin(p), recovery=Math.max(0,-stride);
      joints[side+'Hip'].rotation.x=stride*swing;
      joints[side+'Knee'].rotation.x=-recovery*(.60+runBlend*.65)*blend;
      joints[side+'Ankle'].rotation.x=-stride*swing*.28;
      joints[side+'Shoulder'].rotation.x=-stride*swing*.8;
      joints[side+'Shoulder'].rotation.z=side==='left'?.08:-.08;
      joints[side+'Elbow'].rotation.x=-.12-runBlend*.7+stride*.09*blend;
    }
    pelvis.position.y=.91+Math.abs(Math.sin(phase))*.018*blend;
    spine.rotation.x=runBlend*.10;chest.rotation.y=Math.sin(phase)*.035*blend;
    head.rotation.y=-Math.sin(phase)*.02*blend;
    if(!moving){const breath=Math.sin(performance.now()*.0018)*.003;chest.scale.set(1,1+breath,1+breath);}
    else chest.scale.setScalar(1);
    group.userData.animationState=state;
  }
  update(0,0);
  return {group,mesh,skeleton,joints,update,get animationState(){return state;},dispose(){geometry.dispose();material.dispose();skeleton.dispose();group.removeFromParent();}};
}
