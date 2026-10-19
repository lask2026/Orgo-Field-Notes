const validation=(()=>{
function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').trim().toLowerCase()
    .replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ')
    .replace(/\s*([,()-])\s*/g,'$1');
}
function validateAnswer(stage, value) {
  if(stage.type==='text') return typeof value==='string' && stage.accepted.some(a=>normalizeText(a)===normalizeText(value));
  if(stage.type==='choice') return Number.isInteger(value) && value===stage.answer;
  if(stage.type==='atoms') return Array.isArray(value) && new Set(value).size===value.length && value.length===stage.answer.length && value.every(x=>Number.isInteger(x)&&stage.answer.includes(x));
  if(stage.type==='number') {
    if(typeof value!=='string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return false;
    const n=Number(value); return Number.isFinite(n) && Math.abs(n-stage.answer)<=stage.tolerance;
  }
  return false;
}
function atomLabel(i){return String.fromCharCode(65+i);}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

return {normalizeText,validateAnswer,atomLabel,escapeHTML};})();
const progress=(()=>{
const STORAGE_KEY='orgo-field-notes-v1';
const freshState=()=>({version:1,chapter:1,mode:'learn',lesson:0,step:0,exercise:0,theme:'light',animations:true,practice:{}});
function cleanState(raw,chapters){
  const s=freshState();
  if(!raw||raw.version!==1) return s;
  s.chapter=chapters.some(c=>c.id===raw.chapter)?raw.chapter:1;
  const c=chapters.find(c=>c.id===s.chapter)||chapters[0];
  s.mode=raw.mode==='guided'?'guided':'learn';
  s.theme=raw.theme==='dark'?'dark':'light';s.animations=raw.animations!==false;
  const bounded=(v,n)=>Number.isInteger(v)&&v>=0&&v<n?v:0;
  s.lesson=bounded(raw.lesson,c.lessons.length);s.step=bounded(raw.step,c.lessons[s.lesson].steps.length);
  s.exercise=bounded(raw.exercise,c.exercises.filter(e=>e.lesson===c.lessons[s.lesson].id).length);
  for(const ch of chapters) for(const ex of ch.exercises){
    const key=`${ch.id}:${ex.id}`,p=raw.practice?.[key];
    if(p && typeof p==='object') s.practice[key]={stage:bounded(p.stage,ex.stages.length+1),assisted:p.assisted===true,solved:p.solved===true&&p.stage===ex.stages.length&&p.assisted!==true,hints:bounded(p.hints,10)};
  }
  return s;
}
function readProgress(storage,chapters){
  try{return {state:cleanState(JSON.parse(storage.getItem(STORAGE_KEY)),chapters),error:false};}
  catch{return {state:freshState(),error:true};}
}
function writeProgress(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
function getProgress(state,chapter,exercise){const key=`${chapter.id}:${exercise.id}`;return state.practice[key]??=( {stage:0,assisted:false,solved:false,hints:0});}

return {STORAGE_KEY,freshState,cleanState,readProgress,writeProgress,getProgress};})();
const animations=(()=>{
function applyPreferences(state){
  document.documentElement.dataset.theme=state.theme;
  document.body.classList.toggle('no-anim',!state.animations||matchMedia('(prefers-reduced-motion: reduce)').matches);
}

return {applyPreferences};})();
const molecules=(()=>{
const {escapeHTML:esc,atomLabel}=validation;
function valences(m){return m.atoms.map((_,i)=>m.bonds.reduce((s,[a,b,n])=>s+((a===i||b===i)?n:0),0));}
function hydrogens(m,i){const a=m.atoms[i],v=valences(m)[i];return a.h??Math.max(0,({C:4,N:a.charge===1?4:3,O:a.charge===-1?1:2,H:1,F:1,Cl:1,Br:1,I:1,P:5,S:2}[a.e]??v)-v);}
function molecularFormula(m){
  const counts={};m.atoms.forEach((a,i)=>{counts[a.e]=(counts[a.e]||0)+1;const h=hydrogens(m,i);if(h)counts.H=(counts.H||0)+h;});
  const order=['C','H',...Object.keys(counts).filter(k=>k!=='C'&&k!=='H').sort()];
  return order.filter(e=>counts[e]).map(e=>e+(counts[e]===1?'':counts[e])).join('');
}
function netCharge(m){return m.atoms.reduce((sum,a)=>sum+(a.charge||0),0);}
function formulaLabel(m){const charge=netCharge(m);return m.formula+(charge?`; net charge ${charge<0?'−':'+'}${Math.abs(charge)}`:'');}
function graphDescription(m){return m.atoms.map((a,i)=>`${atomLabel(i)}: ${a.e}${a.charge?` charge ${a.charge}`:''}, ${hydrogens(m,i)} implicit H`).join('; ')+'. Bonds: '+m.bonds.map(([a,b,n])=>`${atomLabel(a)}–${atomLabel(b)} ${['','single','double','triple'][n]}`).join('; ')+'.';}
function electronFlowGeometry(m,flow){
  const point=side=>flow[side+'Atom']!==undefined?m.atoms[flow[side+'Atom']]:(()=>{const [a,b]=m.bonds[flow[side+'Bond']];return{x:(m.atoms[a].x+m.atoms[b].x)/2,y:(m.atoms[a].y+m.atoms[b].y)/2};})();
  const a=point('from'),b=point('to'),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
  const labeled=side=>flow[side+'Atom']!==undefined&&m.atoms[flow[side+'Atom']].e!=='C';
  const startGap=labeled('from')?24:6;
  // Approach visible labels from the curve's outer side, keeping the shaft and head off the glyph.
  return {start:{x:a.x+nx*startGap,y:a.y+ny*startGap},control:{x:(a.x+b.x)/2+nx*45,y:(a.y+b.y)/2+ny*45},end:labeled('to')?{x:b.x+nx*24,y:b.y+ny*24}:{x:b.x-dx/len*12,y:b.y-dy/len*12}};
}
function drawMolecule(m,opts={}){
  const path=opts.path||[],prin=opts.prin||[],sub=opts.sub||[],sel=opts.sel||[];
  const label=(a,i)=>{
    if(a.e==='C'&&!(m.atoms.length===2&&m.atoms.every(a=>a.e==='C')))return '';
    const count=hydrogens(m,i),h=count?'H'+(count>1?String(count).replace(/\d/g,n=>'₀₁₂₃₄₅₆₇₈₉'[n]):''):'';
    const bond=m.bonds.find(([u,v])=>u===i||v===i),neighbor=bond?m.atoms[bond[0]===i?bond[1]:bond[0]]:null;
    return (h&&neighbor?.x>a.x+14?h+a.e:a.e+h)+(a.charge===1?'⁺':a.charge===-1?'⁻':'');
  };
  let h=`<svg class="mol" viewBox="-24 -28 ${m.w+48} ${m.h+56}" xmlns="http://www.w3.org/2000/svg" role="${opts.click?'group':'img'}" aria-label="Molecular structure; atoms labeled A onward">`;
  for(const [a,b] of m.bonds)if(path.includes(a)&&path.includes(b)){const p=m.atoms[a],q=m.atoms[b];h+=`<line class="anim-path" pathLength="100" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#bfdbfe" stroke-width="17" stroke-linecap="round"/>`;}
  for(const [arr,color,fill] of [[prin,'#059669','#d1fae5'],[sub,'#d97706','#fef3c7'],[opts.alpha||[],'#e11d48','#ffe4e6']])for(const i of arr){const a=m.atoms[i],rx=Math.max(19,label(a,i).length*5+10);h+=`<ellipse class="anim-halo" cx="${a.x}" cy="${a.y}" rx="${rx}" ry="19" fill="${fill}" stroke="${color}" stroke-width="2"/>`;}
  for(const [bi,[a,b,n]] of m.bonds.entries()){
    const p=m.atoms[a],q=m.atoms[b],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
    const ca=label(p,a)?16:0,cb=label(q,b)?16:0,col=path.includes(a)&&path.includes(b)?'#1d4ed8':'#0f172a';
    const stereo=m.stereo?.find(s=>s.bond===bi);
    if(stereo?.type==='wedge'){h+=`<polygon points="${p.x},${p.y} ${q.x-uy*7},${q.y+ux*7} ${q.x+uy*7},${q.y-ux*7}" fill="${col}"/>`;continue;}
    if(stereo?.type==='dash'){for(let t=.15;t<1;t+=.13)h+=`<line x1="${p.x+dx*t-uy*7*t}" y1="${p.y+dy*t+ux*7*t}" x2="${p.x+dx*t+uy*7*t}" y2="${p.y+dy*t-ux*7*t}" stroke="${col}" stroke-width="2"/>`;continue;}
    for(const off of n===1?[0]:n===2?[-3,3]:[-5.5,0,5.5])h+=`<line x1="${p.x+ux*ca-uy*off}" y1="${p.y+uy*ca+ux*off}" x2="${q.x-ux*cb-uy*off}" y2="${q.y-uy*cb+ux*off}" stroke="${col}" stroke-width="2.7" stroke-linecap="round"/>`;
  }
  if(opts.flow?.length){
    h+='<defs><marker id="electronArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#6d28d9" stroke-width="1.5"/></marker></defs>';
    for(const flow of opts.flow){const {start:a,control:c,end:b}=electronFlowGeometry(m,flow);h+=`<path class="anim-path" pathLength="100" d="M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}" fill="none" stroke="#6d28d9" stroke-width="2.5" marker-end="url(#electronArrow)"/>`;}
  }
  m.atoms.forEach((a,i)=>{
    const l=label(a,i);
    if(l)h+=`<text x="${a.x}" y="${a.y+6}" text-anchor="middle" style="font-size:16px;fill:${a.e==='O'?'#047857':a.e==='N'?'#1d4ed8':'#0f172a'}">${esc(l)}</text>`;
    if(opts.click){
      const y=l?a.y+26:a.y;
      h+=`<g class="ahit ${sel.includes(i)?'sel':''}" role="button" tabindex="0" data-act="${opts.act||'selectAtom'}" data-idx="${i}" aria-label="Atom ${atomLabel(i)}, ${a.e}" aria-pressed="${sel.includes(i)}">${l?`<circle class="atom-label-hit" cx="${a.x}" cy="${a.y}" r="16" style="fill:transparent;stroke:none"/>`:""}<circle cx="${a.x}" cy="${y}" r="16"/><text x="${a.x}" y="${y+4}" text-anchor="middle">${atomLabel(i)}</text></g>`;
    }
    if(opts.num?.includes(i)){const ix=opts.num.indexOf(i);h+=`<g class="anim-loc" style="--i:${ix}"><circle cx="${a.x}" cy="${a.y-22}" r="10" fill="#2563eb"/><text x="${a.x}" y="${a.y-18}" text-anchor="middle" style="font-size:11px;fill:#fff">${ix+1}</text></g>`;}
  });
  return h+'</svg>'+(opts.click?`<div class="atom-controls" aria-label="Atom selection buttons">${m.atoms.map((a,i)=>`<button class="atom-key" data-act="${opts.act||'selectAtom'}" data-idx="${i}" aria-label="Select atom ${atomLabel(i)}, ${a.e}" aria-pressed="${sel.includes(i)}">${atomLabel(i)} <small>${a.e}</small></button>`).join('')}</div>`:'')+`<details class="graph-text"><summary>Accessible atom and bond description</summary><p>${esc(graphDescription(m))}</p></details>`;
}

return {valences,hydrogens,molecularFormula,netCharge,formulaLabel,graphDescription,electronFlowGeometry,drawMolecule};})();
const diagrams=(()=>{
const {escapeHTML:esc}=validation;
function drawDiagram(d,value,{concealAnswers=false}={}){
  if(!d)return '';
  let svg='',controls='';
  if(d.type==='fischer'){
    svg=`<line x1="180" y1="35" x2="180" y2="165"/><line x1="80" y1="100" x2="280" y2="100"/>`+[[180,25,d.top],[180,190,d.bottom],[50,105,d.left],[315,105,d.right]].map(([x,y,t])=>`<text x="${x}" y="${y}">${esc(t)}</text>`).join('');
  }else if(d.type==='orbitals'){
    const arrow=(x,y,down)=>{const start=y+(down?-11:11),end=y+(down?11:-11),wing=end+(down?-5:5);return `<path d="M${x} ${start} V${end} M${x-4} ${wing} L${x} ${end} L${x+4} ${wing}" stroke="#1d4ed8"/>`;};
    for(const [i,row]of d.subshells.entries()){
      const y=48+i*63;svg+=`<text x="45" y="${y+5}">${esc(row.label)}</text>`;
      for(const [j,count]of row.electrons.entries()){const x=95+j*33;svg+=`<rect x="${x}" y="${y-18}" width="29" height="36"/>`;if(count)svg+=arrow(x+10,y,false);if(count===2)svg+=arrow(x+20,y,true);}
    }
    controls='<p>Each box is one orbital; arrows denote electron spin states, not motion. Row spacing is schematic, not an energy scale.</p><details><summary>Accessible orbital occupancy</summary><p>'+d.subshells.map(row=>`${esc(row.label)}: ${row.electrons.map(n=>n+' electron'+(n===1?'':'s')).join(', ')}`).join('; ')+'.</p></details>';
  }else if(d.type==='newman'){
    const angle=value??180;
    svg='<circle cx="180" cy="105" r="32" fill="white"/>';
    for(let i=0;i<3;i++){const a=(i*120-90)*Math.PI/180,b=(i*120-90+angle)*Math.PI/180;
      svg+=`<line x1="${180+32*Math.cos(b)}" y1="${105+32*Math.sin(b)}" x2="${180+68*Math.cos(b)}" y2="${105+68*Math.sin(b)}" stroke="#059669"/><text x="${180+85*Math.cos(b)}" y="${110+85*Math.sin(b)}" fill="#047857">${i===0?'CH₃':'H'}</text>`;
      svg+=`<line x1="180" y1="105" x2="${180+58*Math.cos(a)}" y2="${105+58*Math.sin(a)}" stroke="#2563eb"/><text x="${180+78*Math.cos(a)}" y="${110+78*Math.sin(a)}" fill="#1d4ed8">${i===0?'CH₃':'H'}</text>`;
    }
    svg+='<circle cx="180" cy="105" r="4" fill="#2563eb"/>';
    controls=`<label>CH₃–CH₃ dihedral angle: <output>${angle}°</output><input data-control="diagram" type="range" min="0" max="180" step="60" value="${angle}" aria-label="Dihedral angle"></label><p>${concealAnswers?'Use the bond positions to identify the conformation.':angle===180?'Anti: staggered, lowest energy for butane.':angle===60?'Gauche: staggered, methyl groups closer together.':angle===0?'Fully eclipsed: methyl groups overlap; highest energy.':'Eclipsed: torsional strain exceeds staggered conformations.'}</p>`;
  }else if(d.type==='spectrum'){
    svg='<path d="M35 25 V165 H335"/>';
    const peaks=d.peaks;
    for(const [i,p] of peaks.entries()){const x=35+300*(d.max-p.x)/(d.max-d.min),y=165-p.height*110;svg+=`<line x1="${x}" y1="165" x2="${x}" y2="${y}" stroke="#2563eb" stroke-width="4"/><text x="${x}" y="${y-8}">${esc(p.label)}</text>`;}
    svg+=`<text x="40" y="190">${d.max}</text><text x="320" y="190">${d.min}</text><text x="180" y="215">${esc(d.unit)}</text>`;
    controls='<p>Illustrative peak positions only; heights and line shapes are schematic.</p>';
  }else if(d.type==='tlc'){
    const strength=value??30,rf=Math.min(.9,.15+strength*.006);
    svg=`<rect x="85" y="20" width="190" height="170" fill="#fff"/><path d="M85 170 H275 M85 40 H275" stroke-dasharray="5 4"/><circle cx="150" cy="${170-130*rf}" r="7" fill="#2563eb"/><circle cx="215" cy="${170-130*Math.min(.95,rf+.2)}" r="7" fill="#059669"/><text x="180" y="215">Baseline below • solvent front above</text>`;
    controls=`<label>Relative eluent strength <output>${strength}</output><input data-control="diagram" type="range" min="0" max="100" value="${strength}" aria-label="Eluent strength"></label><p>Model spot A Rf = ${rf.toFixed(2)}. On polar silica, a stronger eluent usually increases Rf. This trend model does not predict experimental values.</p>`;
  }else if(d.type==='acid'){
    const ph=value??d.pKa,f=1/(1+10**(d.pKa-ph));
    svg=`<rect x="40" y="70" width="280" height="45" fill="#dbeafe"/><rect x="40" y="70" width="${280*f}" height="45" fill="#059669"/><text x="180" y="145">${(100*f).toFixed(1)}% deprotonated</text>`;
    controls=`<p>Green: A⁻ (deprotonated), ${(100*f).toFixed(1)}%. Light blue: HA (protonated), ${(100*(1-f)).toFixed(1)}%.</p><label>pH (range 0–14) <output>${ph}</output><input data-control="diagram" type="range" min="0" max="14" step="0.1" value="${ph}" aria-label="pH" aria-valuetext="pH ${ph}; ${(100*f).toFixed(1)}% deprotonated"></label><p>Model monoprotic acid, pKa = ${d.pKa}. Fraction A⁻ = 1 / (1 + 10^(pKa − pH)). This concentration-based teaching model neglects activity corrections.</p>`;
  }
  return `<figure class="diagram"><svg viewBox="0 0 360 230" role="img" aria-label="${esc(d.caption)}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#334155" stroke-width="2">${svg}</g></svg><figcaption>${esc(d.caption)}</figcaption>${controls}</figure>`;
}

return {drawDiagram};})();
const learn=(()=>{
const {escapeHTML:esc,validateAnswer}=validation;
const {drawMolecule,formulaLabel}=molecules;
const {drawDiagram}=diagrams;
function anatomy(parts,name){return `<div class="abar">${(parts||[]).map(([c,t,s],i)=>`<span class="npill ${esc(c)}" style="--i:${i}">${esc(t)}<small>${esc(s)}</small></span>`).join('')}<span class="final-merged">${esc(name)}</span></div>`;}
function renderLearn(ch,molecules,state,ui){
  const l=ch.lessons[state.lesson],s=l.steps[state.step],m=molecules[s.molecule||l.molecule];
  const revealed=s.reveal||ui.revealLearn;
  const challenge=ui.tryMode&&s.challenge;
  const good=challenge&&ui.checked&&validateAnswer({type:'atoms',answer:s.challenge.answer},ui.selected);
  const opts=challenge?{click:true,sel:ui.selected}:s.highlights;
  return `<div class="grid2"><section class="card"><div class="c-head"><h1 class="c-title">${esc(l.title)}</h1><span class="c-tag">${esc(l.tag)}</span></div><div class="stage">${drawMolecule(m,opts)}</div>${drawDiagram(s.diagram,ui.diagramValue)}
  ${challenge?`<p>${esc(s.challenge.prompt)}</p><button class="btn pri" data-act="checkTry">Check selection</button> <button class="btn" data-act="try">Back to walkthrough</button>${ui.checked?`<div role="status" class="fbox ${good?'ok':'err'}">${good?esc(s.challenge.explanation):'Not yet. Select exactly the requested atoms; use the walkthrough for a hint.'}</div>`:''}`:`<div class="sbar"><button class="sbtn" data-act="prev" ${state.step===0?'disabled':''}>← Previous</button>${l.steps.map((t,i)=>`<button class="sbtn" data-act="step" data-idx="${i}" aria-pressed="${i===state.step}">${esc(t.label)}</button>`).join('')}<button class="sbtn" data-act="next" ${state.step===l.steps.length-1?'disabled':''}>Next →</button></div><div class="sexp" role="status">${s.text}</div>${revealed?anatomy(s.anatomy,m.name)+`<p class="formula">Formula: ${esc(formulaLabel(m))}</p>`:'<div class="abar">Structure name concealed until its explanation. <button class="btn" data-act="revealLearn">Reveal name</button></div>'}${s.challenge?'<button class="btn try-btn" data-act="try">🖐 Try It Yourself</button>':''}`}</section>
  <aside class="tstack">${[['rule','Core Rules','tc-rule'],['cue','Memory Cues','tc-cue'],['trap','Common Mistakes / MCAT Traps','tc-trap'],['app','MCAT Applications','tc-app']].map(([k,t,c])=>`<details class="tcard ${c} ${s.focus===k?'focus':''}" ${k===(s.focus||'rule')?'open':''}><summary><h2>${t}</h2></summary>${l.cards[k]}</details>`).join('')}<button class="btn pri" data-act="practiceConcept">Practice this concept →</button><details class="drw"><summary>Chapter objectives & sources</summary><ul>${ch.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>Original educational content following the supplied curriculum. ${esc(ch.review.note)}</p>${ch.sources.map(s=>`<p>${s.location.startsWith('https://')?`<a href="${esc(s.location)}" target="_blank" rel="noreferrer">${esc(s.label)}</a>`:esc(s.label)}</p>`).join('')}</details></aside></div>`;
}

return {anatomy,renderLearn};})();
const practice=(()=>{
const {escapeHTML:esc,atomLabel}=validation;
const {drawMolecule,formulaLabel}=molecules;
const {drawDiagram}=diagrams;
const {getProgress}=progress;
const {anatomy}=learn;
function solutionText(s){return s.type==='choice'?s.options[s.answer]:s.type==='atoms'?s.answer.map(atomLabel).join(', '):s.type==='text'?s.accepted[0]:`${s.answer}${s.unit&&s.unit!=='dimensionless'?' '+s.unit:''}`;}
function renderPractice(ch,molecules,state,ui){
  const labs=ch.exercises.filter(e=>e.lesson===ch.lessons[state.lesson].id),ex=labs[state.exercise]||labs[0],p=getProgress(state,ch,ex),done=p.stage===ex.stages.length,s=ex.stages[p.stage];
  const displayed=done?ex.stages.at(-1):s,molecule=displayed.molecule||ex.molecule;
  const switched=molecule!==(ex.stages[p.stage-1]?.molecule||ex.molecule);
  const opts=done?(ex.stages.at(-1).highlights||{}):{...(switched?{}:(ex.stages[p.stage-1]?.highlights||{})),...(s.type==='atoms'?{click:true,sel:ui.selected}:{})};
  return `<div class="sub-nav"><span>Guided workshops</span><div class="workshops">${labs.map((e,i)=>`<button class="btn ${i===state.exercise?'pri':''}" data-act="exercise" data-idx="${i}" aria-pressed="${i===state.exercise}">${esc(e.label)}${state.practice[`${ch.id}:${e.id}`]?.solved?' ✓':''}</button>`).join('')}</div></div><div class="grid2"><section class="card"><div class="c-head"><h1 class="c-title">${esc(ex.title)}</h1><span class="c-tag">${done?(p.solved?'Solved independently':'Studied with support'):`Stage ${p.stage+1} of ${ex.stages.length}`}</span></div><div class="stage">${drawMolecule(molecules[molecule],opts)}</div>${drawDiagram(displayed.molecule?null:ex.diagram,ui.diagramValue,{concealAnswers:!done})}${ex.context?`<p>${esc(ex.context)}</p>`:''}
  ${done?`${anatomy(ex.anatomy,ex.summary)}<p class="formula">Displayed structure: ${esc(molecules[molecule].name)}<br>Formula: ${esc(formulaLabel(molecules[molecule]))}</p><button class="btn" data-act="replay">Replay workshop</button> <button class="btn pri" data-act="nextExercise">Next workshop →</button>`:'<p class="muted">Solve each decision. Hints and revealed solutions are recorded as assisted study.</p><button class="btn" data-act="revealSolution">Reveal worked solution</button>'}</section><section aria-label="Workshop stages">
  ${done?ex.stages.map((st,i)=>`<div class="scard"><h2 class="shead">${i+1}. ${esc(st.prompt)}</h2><p><strong>${esc(solutionText(st))}</strong></p><div class="sexp">${esc(st.explanation)}</div></div>`).join(''):`${p.stage?`<p class="muted">${p.stage} earlier decision${p.stage>1?'s':''} completed.</p>`:''}<div class="scard"><h2 class="shead" tabindex="-1" id="stageTitle">${esc(s.prompt)}</h2><span class="stag">${esc(s.skill)}</span>${s.type==='choice'?`<div class="clist">${s.options.map((o,i)=>`<button class="copt ${ui.correct&&i===s.answer?'ok':''}" data-act="choice" data-idx="${i}" ${ui.correct?'disabled':''}><span class="clet">${atomLabel(i)}</span>${esc(o)}</button>`).join('')}</div>`:s.type==='atoms'?`<p>Select atoms on the structure using click or Tab and Enter. Selected: <strong>${ui.selected.map(atomLabel).join(', ')||'None'}</strong></p><button class="btn pri" data-act="checkAnswer" ${ui.correct?'disabled':''}>Check selection</button>`:`<form id="answerForm"><label for="answer">${s.type==='number'?`Numeric answer${s.unit?' ('+esc(s.unit)+')':''}`:'Your answer'}</label><input id="answer" class="tinp" autocomplete="off" spellcheck="false" ${s.type==='number'?'inputmode="decimal"':''} value="${esc(ui.value)}" ${ui.correct?'disabled':''}><button class="btn pri" type="submit" ${ui.correct?'disabled':''}>Check answer</button></form>`}
  ${ui.feedback?`<div class="fbox ${ui.correct?'ok':'err'}" role="status">${esc(ui.feedback)}</div>`:''}
  ${ui.correct?'<button class="btn suc" data-act="continue">Continue →</button>':`<button class="btn hint" data-act="hint" ${p.hints>=s.hints.length?'disabled':''}>${p.hints>=s.hints.length?'All hints shown':'Show next hint'}</button>${s.hints.slice(0,p.hints).map(h=>`<p class="sexp">${esc(h)}</p>`).join('')}`}</div><p class="locked">${ex.stages.length-p.stage-1} later stage(s) concealed until you continue.</p>`}</section></div>`;
}

return {solutionText,renderPractice};})();
const app=(()=>{
const {escapeHTML:esc,validateAnswer}=validation;
const {readProgress,writeProgress,getProgress,freshState}=progress;
const {applyPreferences}=animations;
const {renderLearn}=learn;
const {renderPractice}=practice;
function startApp(data){
  const {chapters,molecules}=data;
  let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('unavailable');}};}
  const loaded=readProgress(storage,chapters);let state=loaded.state;
  let ui={},storageError=loaded.error;
  let toastTimer;
  function showToast(message){clearTimeout(toastTimer);document.getElementById('toast').textContent=message;toastTimer=setTimeout(()=>{document.getElementById('toast').textContent='';},4500);}
  const resetUI=()=>{ui={selected:[],value:'',feedback:'',correct:false,checked:false,tryMode:false,revealLearn:false,diagramValue:undefined};};resetUI();
  const chapter=()=>chapters.find(c=>c.id===state.chapter)||chapters[0];
  const labs=()=>chapter().exercises.filter(e=>e.lesson===chapter().lessons[state.lesson].id);
  const exercise=()=>labs()[state.exercise]||labs()[0];
  const save=()=>{if(!writeProgress(storage,state))storageError=true;};
  function render(focus){
    const ch=chapter();applyPreferences(state);
    document.title=`Orgo Field Notes · ${ch.id}. ${ch.title}`;
    const solved=ch.exercises.filter(e=>state.practice[`${ch.id}:${e.id}`]?.solved).length;
    document.getElementById('chSel').innerHTML=chapters.map(c=>`<option value="${c.id}" ${c.id===ch.id?'selected':''}>Ch ${String(c.id).padStart(2,'0')} · ${esc(c.title)}</option>`).join('');
    document.getElementById('themeBtn').textContent=state.theme==='dark'?'☀ Light':'☾ Dark';
    document.getElementById('animBtn').textContent=state.animations?'⚡ Animations: ON':'⚡ Animations: Instant';
    document.getElementById('modeNav').innerHTML=[['learn','Learn & Explore'],['guided','Guided Practice']].map(([id,t])=>`<button class="mtab" data-act="mode" data-mode="${id}" ${state.mode===id?'aria-current="page"':''}>${t}</button>`).join('');
    document.getElementById('progressText').textContent=`${solved} / ${ch.exercises.length} workshops solved independently`;
    document.getElementById('progFill').style.width=`${100*solved/ch.exercises.length}%`;
    document.getElementById('storageWarn').hidden=!storageError;
    document.getElementById('view').innerHTML=`<p class="chapter-intro">Chapter ${ch.id} · ${esc(ch.description)}</p><nav class="cnav" aria-label="Concepts">${ch.lessons.map((l,i)=>`<button class="cbtn" data-act="lesson" data-idx="${i}" aria-pressed="${i===state.lesson}"><span>${ch.id}.${i+1}</span>${esc(l.label)}</button>`).join('')}</nav>`+(state.mode==='learn'?renderLearn(ch,molecules,state,ui):renderPractice(ch,molecules,state,ui));
    if(focus)document.querySelector(focus)?.focus();
  }
  function check(value){const ex=exercise(),p=getProgress(state,chapter(),ex),s=ex.stages[p.stage];if(!s||ui.correct)return;
    ui.correct=validateAnswer(s,value);ui.feedback=ui.correct?s.explanation:s.type==='choice'?(s.feedback?.[value]||'Not yet. Reconsider the rule and try again.'):'Not yet. Check the exact selection, punctuation, sign, or requested units. Use a hint if needed.';
    render(ui.correct?'[data-act="continue"]':s.type==='text'||s.type==='number'?'#answer':undefined);
  }
  document.addEventListener('input',e=>{if(e.target.id==='answer')ui.value=e.target.value;});
  document.addEventListener('change',e=>{
    if(e.target.id==='chSel'){state.chapter=Number(e.target.value);state.lesson=state.step=state.exercise=0;resetUI();save();render('#main');}
    if(e.target.dataset.control==='diagram'){ui.diagramValue=Number(e.target.value);render('[data-control="diagram"]');}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='answerForm'){e.preventDefault();check(ui.value);}});
  document.addEventListener('keydown',e=>{const hit=e.target.closest?.('.ahit');if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();hit.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const act=b.dataset.act,i=Number(b.dataset.idx);let focus;
    if(act==='theme'){state.theme=state.theme==='dark'?'light':'dark';}
    else if(act==='animations'){state.animations=!state.animations;}
    else if(act==='mode'){state.mode=b.dataset.mode;resetUI();}
    else if(act==='lesson'){state.lesson=i;state.step=state.exercise=0;resetUI();}
    else if(act==='step'||act==='next'||act==='prev'){state.step=act==='step'?i:Math.max(0,Math.min(chapter().lessons[state.lesson].steps.length-1,state.step+(act==='next'?1:-1)));resetUI();}
    else if(act==='revealLearn'){ui.revealLearn=true;}
    else if(act==='try'){ui.tryMode=!ui.tryMode;ui.selected=[];ui.checked=false;}
    else if(act==='checkTry'){ui.checked=true;}
    else if(act==='selectAtom'){if(ui.correct)return;ui.selected=ui.selected.includes(i)?ui.selected.filter(n=>n!==i):[...ui.selected,i];ui.checked=false;focus=`.${b.classList.contains('atom-key')?'atom-key':'ahit'}[data-idx="${i}"]`;}
    else if(act==='practiceConcept'){state.mode='guided';state.exercise=0;resetUI();}
    else if(act==='exercise'){state.exercise=i;resetUI();}
    else if(act==='choice'){check(i);return;}
    else if(act==='checkAnswer'){check(ui.selected);return;}
    else if(act==='hint'){const p=getProgress(state,chapter(),exercise());p.assisted=true;p.hints=Math.min(p.hints+1,exercise().stages[p.stage].hints.length);}
    else if(act==='continue'){if(!ui.correct)return;const ex=exercise(),p=getProgress(state,chapter(),ex);p.stage++;p.hints=0;if(p.stage===ex.stages.length)p.solved=!p.assisted;resetUI();focus='#stageTitle';}
    else if(act==='revealSolution'){const ex=exercise(),p=getProgress(state,chapter(),ex);p.stage=ex.stages.length;p.assisted=true;p.solved=false;resetUI();}
    else if(act==='replay'){state.practice[`${chapter().id}:${exercise().id}`]={stage:0,assisted:false,solved:false,hints:0};resetUI();}
    else if(act==='nextExercise'){if(state.exercise+1<labs().length)state.exercise++;else{state.exercise=0;if(state.lesson+1<chapter().lessons.length)state.lesson++;else{state.lesson=0;state.chapter=chapters[(chapters.findIndex(c=>c.id===state.chapter)+1)%chapters.length].id;}}resetUI();}
    else if(act==='reset'){document.getElementById('resetDialog').showModal();return;}
    else if(act==='cancelReset'){document.getElementById('resetDialog').close();return;}
    else if(act==='confirmReset'){state.practice={};document.getElementById('resetDialog').close();resetUI();}
    else if(act==='exportProgress'){download('orgo-progress.json',JSON.stringify(state,null,2),'application/json');return;}
    else if(act==='importProgress'){document.getElementById('importFile').click();return;}
    else if(act==='saveApp'){if(location.protocol==='file:'){const clone=document.documentElement.cloneNode(true);clone.querySelector('#view').innerHTML='';download('Orgo-Field-Notes-offline.html','<!doctype html>\n'+clone.outerHTML,'text/html');}else{try{const r=await fetch('Orgo-Field-Notes-offline.html');if(!r.ok)throw Error();download('Orgo-Field-Notes-offline.html',await r.text(),'text/html');}catch{showToast('Download unavailable. Use the standalone HTML included with this build.');}}return;}
    else if(act==='print'){window.print();return;}
    else return;
    save();render(focus);
  });
  document.getElementById('importFile').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>1000000)throw Error();const raw=JSON.parse(await file.text());if(raw.version!==1)throw Error();const temp={getItem:()=>JSON.stringify(raw)};state=readProgress(temp,chapters).state;resetUI();save();render();showToast('Progress imported.');}catch{showToast('Could not import a valid version 1 progress file.');}e.target.value='';
  });
  function download(name,text,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>applyPreferences(state));
  render();
}

return {startApp};})();
app.startApp(JSON.parse(document.getElementById('appData').textContent));