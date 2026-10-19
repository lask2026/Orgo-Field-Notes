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
function formulaLabel(m){const charge=netCharge(m);return (m.displayFormula||m.formula)+(charge?`; net charge ${charge<0?'−':'+'}${Math.abs(charge)}`:'');}
function graphDescription(m){return m.atoms.map((a,i)=>`${atomLabel(i)}: ${a.e}${a.charge?` charge ${a.charge}`:''}, ${hydrogens(m,i)} implicit H`).join('; ')+'. Bonds: '+m.bonds.map(([a,b,n])=>`${atomLabel(a)}–${atomLabel(b)} ${['','single','double','triple'][n]}`).join('; ')+'.';}
function numberBadgePosition(m,i,radius=28){
  const a=m.atoms[i];
  const distance=(p,u,v)=>{const dx=v.x-u.x,dy=v.y-u.y,t=Math.max(0,Math.min(1,((p.x-u.x)*dx+(p.y-u.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-u.x-t*dx,p.y-u.y-t*dy);};
  // Search around the vertex instead of placing every number on an upward carbonyl bond.
  const candidates=Array.from({length:16},(_,j)=>{const angle=-Math.PI/2+j*Math.PI/8;return{x:a.x+radius*Math.cos(angle),y:a.y+radius*Math.sin(angle)};}).filter(p=>p.x>=-6&&p.x<=m.w+6&&p.y>=-10&&p.y<=m.h+10);
  const score=p=>Math.min(...m.bonds.map(([u,v])=>distance(p,m.atoms[u],m.atoms[v])),...m.atoms.filter((b,j)=>j!==i&&b.e!=='C').map(b=>Math.hypot(p.x-b.x,p.y-b.y)-16));
  return candidates.reduce((best,p)=>score(p)>score(best)+.01?p:best,candidates[0]);
}
function electronFlowGeometry(m,flow){
  const point=side=>flow[side+'Atom']!==undefined?m.atoms[flow[side+'Atom']]:(()=>{const [a,b]=m.bonds[flow[side+'Bond']];return{x:(m.atoms[a].x+m.atoms[b].x)/2,y:(m.atoms[a].y+m.atoms[b].y)/2};})();
  const a=point('from'),b=point('to'),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
  const labeled=side=>flow[side+'Atom']!==undefined&&(m.atoms[flow[side+'Atom']].e!=='C'||m.atoms[flow[side+'Atom']].charge);
  const startGap=labeled('from')?24:6;
  // Approach visible labels from the curve's outer side, keeping the shaft and head off the glyph.
  return {start:{x:a.x+nx*startGap,y:a.y+ny*startGap},control:{x:(a.x+b.x)/2+nx*45,y:(a.y+b.y)/2+ny*45},end:labeled('to')?{x:b.x+nx*24,y:b.y+ny*24}:{x:b.x-dx/len*12,y:b.y-dy/len*12}};
}
function drawMolecule(m,opts={}){
  const path=opts.path||[],prin=opts.prin||[],sub=opts.sub||[],sel=opts.sel||[];
  const label=(a,i)=>{
    if(a.e==='C'&&!a.charge&&!a.showHydrogens&&!(m.atoms.length===2&&m.atoms.every(a=>a.e==='C')))return '';
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
      const p=l?numberBadgePosition(m,i,42):a;
      h+=`<g class="ahit ${sel.includes(i)?'sel':''}" role="button" tabindex="0" data-act="${opts.act||'selectAtom'}" data-idx="${i}" aria-label="Atom ${atomLabel(i)}, ${a.e}" aria-pressed="${sel.includes(i)}">${l?`<path d="M${a.x},${a.y} L${p.x},${p.y}" style="stroke:transparent;stroke-width:20;pointer-events:stroke"/><circle class="atom-label-hit" cx="${a.x}" cy="${a.y}" r="16" style="fill:transparent;stroke:none"/>`:""}<circle cx="${p.x}" cy="${p.y}" r="16"/><text x="${p.x}" y="${p.y+4}" text-anchor="middle">${atomLabel(i)}</text></g>`;
    }
    if(opts.num?.includes(i)){const ix=opts.num.indexOf(i),p=numberBadgePosition(m,i);h+=`<g class="anim-loc" style="--i:${ix}"><circle cx="${p.x}" cy="${p.y}" r="10" fill="#2563eb"/><text x="${p.x}" y="${p.y+4}" text-anchor="middle" style="font-size:11px;fill:#fff">${ix+1}</text></g>`;}
  });
  return h+'</svg>'+(opts.click?`<div class="atom-controls" aria-label="Atom selection buttons">${m.atoms.map((a,i)=>`<button class="atom-key" data-act="${opts.act||'selectAtom'}" data-idx="${i}" aria-label="Select atom ${atomLabel(i)}, ${a.e}" aria-pressed="${sel.includes(i)}">${atomLabel(i)} <small>${a.e}</small></button>`).join('')}</div>`:'')+`<details class="graph-text"><summary>Accessible atom and bond description</summary><p>${esc(graphDescription(m))}</p></details>`;
}

return {valences,hydrogens,molecularFormula,netCharge,formulaLabel,graphDescription,numberBadgePosition,electronFlowGeometry,drawMolecule};})();
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
    for(const [i,p] of peaks.entries()){const x=35+300*(d.max-p.x)/(d.max-d.min),y=165-p.height*110;
      if(p.shape==='broad'){
        const points=Array.from({length:151},(_,i)=>{const px=35+2*i,v=d.max-i*(d.max-d.min)/150,py=165-p.height*110*Math.exp(-4*Math.log(2)*((v-p.x)/p.width)**2);return `${i?'L':'M'}${px},${py}`;}).join(' ');
        svg+=`<path class="spectral-band" d="${points}" stroke="#2563eb"/>`;
      }else{
        const n=p.lines||1,weights=Array.from({length:n},(_,k)=>{let r=1;for(let j=1;j<=k;j++)r=r*(n-j)/j;return r;}),maxWeight=Math.max(...weights);
        for(let k=0;k<n;k++){const xx=x+(k-(n-1)/2)*(p.spacing||.05)*300/(d.max-d.min),yy=165-p.height*110*weights[k]/maxWeight;svg+=`<line class="spectral-line" x1="${xx}" y1="165" x2="${xx}" y2="${yy}" stroke="#2563eb" stroke-width="${n>1?2:4}"/>`;}
      }
      svg+=`<text x="${x}" y="${y-8-(peaks.some((q,j)=>j<i&&Math.abs(q.x-p.x)*300/(d.max-d.min)<60)?20:0)}">${esc(p.label)}</text>`;
    }
    svg+=`<text x="40" y="190">${d.max}</text><text x="320" y="190">${d.min}</text><text x="180" y="215">${esc(d.unit)}</text>`;
    controls='<p>Illustrative spectrum, not experimental data. Band widths, line spacing and heights are schematic; signal integration is not peak height.</p>';
  }else if(d.type==='tlc'){
    const strength=value??30,rf=Math.min(.9,.15+strength*.006);
    const rfB=Math.min(.95,rf+.2);
    svg=`<rect x="85" y="20" width="190" height="170" fill="#fff"/><path d="M85 170 H275 M85 40 H275" stroke-dasharray="5 4"/><circle cx="150" cy="${170-130*rf}" r="7" fill="#2563eb"/><text x="130" y="${174-130*rf}">A</text><circle cx="215" cy="${170-130*rfB}" r="7" fill="#059669"/><text x="235" y="${174-130*rfB}">B</text><text x="180" y="215">Baseline below • solvent front above</text>`;
    controls=`<label>Relative eluent strength <output>${strength}</output><input data-control="diagram" type="range" min="0" max="100" value="${strength}" aria-label="Eluent strength" aria-valuetext="Strength ${strength}; spot A Rf ${rf.toFixed(2)}; spot B Rf ${rfB.toFixed(2)}"></label><p>Model spot A (blue, left) Rf = ${rf.toFixed(2)}; spot B (green, right) Rf = ${rfB.toFixed(2)}. On polar silica, a stronger eluent usually increases Rf. This independent trend model does not predict experimental values or the separate worked-distance calculation.</p>`;
  }else if(d.type==='acid'){
    const ph=value??d.pKa,f=1/(1+10**(d.pKa-ph));
    svg=`<rect x="40" y="70" width="280" height="45" fill="#dbeafe"/><rect x="40" y="70" width="${280*f}" height="45" fill="#059669"/><text x="180" y="145">${(100*f).toFixed(1)}% deprotonated</text>`;
    controls=`<p>Green: A⁻ (deprotonated), ${(100*f).toFixed(1)}%. Light blue: HA (protonated), ${(100*(1-f)).toFixed(1)}%.</p><label>pH (range 0–14) <output>${ph}</output><input data-control="diagram" type="range" min="0" max="14" step="0.1" value="${ph}" aria-label="pH" aria-valuetext="pH ${ph}; ${(100*f).toFixed(1)}% deprotonated"></label><p>Model monoprotic acid, pKa = ${d.pKa}. Fraction A⁻ = 1 / (1 + 10^(pKa − pH)). This concentration-based teaching model neglects activity corrections.</p>`;
  }
  return `<figure class="diagram"><svg viewBox="0 0 360 230" role="img" aria-label="${esc(d.caption)}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#334155" stroke-width="2">${svg}</g></svg><figcaption>${esc(d.caption)}</figcaption>${controls}</figure>`;
}

return {drawDiagram};})();
const cardchemistry=(()=>{
const {escapeHTML:esc}=validation;
const {drawMolecule,formulaLabel}=molecules;
const {drawDiagram}=diagrams;

function paper(label,body){
 return `<svg class="chem-cartoon" viewBox="0 0 480 260" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}
function text(x,y,t,extra=''){return `<text x="${x}" y="${y}" ${extra}>${esc(t)}</text>`;}
function apparatus(type){
 if(type==='polarimeter')return paper('Polarimeter apparatus schematic',
  '<path d="M20 110 H445 M435 103 L445 110 L435 117" stroke="#d97706"/><path d="M70 62 V158 M63 65 L77 65 M63 155 L77 155" stroke="#2563eb"/><rect x="125" y="73" width="195" height="74" rx="16" fill="#dbeafe"/><ellipse cx="125" cy="110" rx="13" ry="37"/><path d="M370 73 L395 147" stroke="#059669"/>'+
  text(70,40,'Polarizer')+text(220,111,'Sample: c, path l')+text(390,40,'Analyzer')+text(240,193,'[α] = αobs / (l × c)')+text(240,219,'l in dm; c in g/mL in this convention'));
 if(type==='distillation')return paper('Simple distillation apparatus schematic',
  '<path d="M80 105 V48 H111 V105 A48 48 0 1 1 80 105" fill="#eff6ff"/><path d="M53 155 Q96 145 139 155" stroke="#2563eb"/><path d="M96 18 V84" stroke="#e11d48"/><path d="M111 65 L175 65 L365 143 L365 168"/><path d="M176 49 L373 129 L361 159 L164 79 Z" fill="#dbeafe"/><path d="M174 65 L365 143" stroke="#334155"/><path d="M280 89 L288 67 M225 112 L215 134" stroke="#2563eb"/><path d="M345 168 L345 182 L316 220 H420 L390 182 V168"/><path d="M334 205 H404" stroke="#2563eb"/><path d="M55 222 H135 M65 211 H125" stroke="#d97706"/>'+
  text(80,36,'Heat', 'visibility="hidden"')+text(76,237,'Heat')+text(232,37,'Condenser')+text(429,188,'Collect')+text(407,218,'liquid')+text(105,12,'Thermometer at takeoff'));
 if(type==='extraction')return paper('Separatory funnel with two phases; phase identity is unspecified',
  '<path d="M192 17 H288 V46 C348 75 332 120 253 177 V200 H227 V177 C148 120 132 75 192 46 Z" fill="#eff6ff"/><path d="M163 95 H317" stroke="#2563eb"/><path d="M189 139 H290" stroke="#059669"/><path d="M240 200 V224 M217 207 H263" stroke="#475569"/><path d="M55 76 H148 M323 121 H420"/>'+
  text(74,61,'Top phase')+text(399,107,'Bottom phase')+text(240,238,'Stopcock')+text(240,75,'Immiscible liquids')+text(240,122,'Density sets order'));
 if(type==='micelle'){
  let body='<circle cx="240" cy="115" r="72" stroke="#cbd5e1" stroke-dasharray="4 5"/>';
  for(let i=0;i<16;i++){const a=i*Math.PI/8,x=240+72*Math.cos(a),y=115+72*Math.sin(a),u=240+34*Math.cos(a),v=115+34*Math.sin(a);body+=`<path d="M${x} ${y} L${(x+u)/2+5*Math.sin(a)} ${(y+v)/2-5*Math.cos(a)} L${u} ${v}" stroke="#d97706"/><circle cx="${x}" cy="${y}" r="7" fill="#dbeafe" stroke="#2563eb"/>`;}
  return paper('Micelle aggregate cartoon, not an atom-resolved molecular structure',body+text(240,18,'Water outside')+text(240,119,'Tail-rich core')+text(240,218,'Polar heads face water; tails gather inside'));
 }
 if(type==='column')return paper('Size-exclusion apparatus cartoon with schematic large and small analyte tokens',
  '<path d="M180 20 V190 Q180 213 240 213 Q300 213 300 190 V20 M180 20 Q240 1 300 20" fill="#eff6ff"/>'+
  [52,104,156].map(y=>[202,278].map(x=>`<circle cx="${x}" cy="${y}" r="18" fill="#e2e8f0" stroke="#94a3b8"/><circle cx="${x}" cy="${y}" r="10" stroke-dasharray="3 3"/>`).join('')).join('')+
  '<path d="M241 28 V184 M234 174 L241 184 L248 174" stroke="#2563eb"/><circle cx="241" cy="78" r="13" fill="#bfdbfe" stroke="#2563eb"/><circle cx="207" cy="104" r="5" fill="#fcd34d" stroke="#92400e"/><circle cx="241" cy="229" r="8" fill="#bfdbfe" stroke="#2563eb"/>'+
  text(85,62,'Large')+text(85,85,'bypass pores')+text(395,107,'Small')+text(395,130,'enter pores')+text(240,254,'Larger species generally elute first','style="font-size:14px"'));
 if(type==='overlap')return paper('Side-on p-orbital overlap model; colors indicate wavefunction phase',
  '<path d="M60 120 H420" stroke-dasharray="5 5"/><ellipse cx="180" cy="74" rx="28" ry="42" fill="#dbeafe" stroke="#2563eb"/><ellipse cx="300" cy="74" rx="28" ry="42" fill="#dbeafe" stroke="#2563eb"/><ellipse cx="180" cy="166" rx="28" ry="42" fill="#ffe4e6" stroke="#e11d48"/><ellipse cx="300" cy="166" rx="28" ry="42" fill="#ffe4e6" stroke="#e11d48"/><path d="M194 62 Q240 40 286 62 M194 178 Q240 200 286 178" stroke="#6d28d9"/><path d="M180 120 H300" stroke="#334155" stroke-width="7"/><circle cx="180" cy="120" r="5" fill="#334155"/><circle cx="300" cy="120" r="5" fill="#334155"/>'+
  text(240,24,'Side-on p overlap: π')+text(240,115,'σ axis')+text(240,233,'Phase colors are not electric charge'));
 return '';
}
function namespace(markup,key){
 const prefix='cc-'+key.replace(/[^a-zA-Z0-9_-]/g,'-');
 return markup.replace(/class="([^"]*)"/g,(_,s)=>'class="'+s.split(' ').map(c=>'card-'+c).join(' ')+'"')
  .replaceAll('electronArrow',prefix+'-electronArrow');
}
function renderChemicalFigure(spec,lesson,{molecules,revealed=false,conceal=false}={},key='figure'){
 if(!spec||conceal)return '';
 if(!molecules)return '';
 const panels=spec.steps.map((index,i)=>{
  const step=lesson.steps[index];if(!step)throw Error('Unknown chemistry figure step '+index);
  const id=step.molecule||lesson.molecule,m=molecules[id];if(!m)throw Error('Unknown chemistry figure molecule '+id);
  const atomic=spec.type==='projection'&&step.diagram?.type==='orbitals';
  const projected=spec.type==='projection'&&step.diagram;
  let drawing=projected?drawDiagram({...step.diagram,caption:atomic?'Isolated-atom occupancy schematic':'Illustrative '+step.diagram.type+' projection'},undefined):drawMolecule(m,step.highlights||{});
  if(projected&&['spectrum','tlc'].includes(step.diagram.type))drawing=drawMolecule(m,step.highlights||{})+drawing;
  drawing=drawing.replace(/<label\b[^>]*>[\s\S]*?<\/label>/g,'');
  drawing=namespace(drawing,key+'-'+i);
  const note=atomic?'<p class="chem-model-note">Isolated-atom model; no molecular structure or measured energy scale is shown.</p>':revealed?`<p class="chem-composition">${esc(m.name)} · ${esc(formulaLabel(m))}</p><details class="chem-review"><summary>Graph review note</summary><p>${esc(m.review)}</p></details>`:'<p class="chem-model-note">Canonical graph · identity and formula follow the walkthrough reveal.</p>';
  return `<div class="chem-panel" ${atomic?'':`data-chem-molecule="${esc(id)}"`}><span class="chem-example">${atomic?'Atomic model':'Example '+(i+1)}</span>${drawing}${note}</div>`;
 });
 const arrow=spec.type==='reaction'?'→':spec.type==='resonance'?'↔':'';
 const content=panels.map((p,i)=>(i&&arrow?`<div class="chem-relation" aria-label="${spec.type==='resonance'?'resonance contributors':'schematic transformation'}">${arrow}</div>`:'')+p).join('');
 return `<figure class="chem-figure" data-chem-type="${esc(spec.type)}"><div class="chem-paper ${panels.length>1?'chem-multiple':''}">${content}${apparatus(spec.type)}</div><figcaption>${esc(spec.caption)}</figcaption></figure>`;
}

return {apparatus,renderChemicalFigure};})();
const visuals=(()=>{
const {renderChemicalFigure}=cardchemistry;
const {escapeHTML:esc}=validation;
function cardKey(ch,lesson,kind){return `${ch.id}:${lesson.id}:${kind}`;}
function renderThemeSvg(theme, kind, title) {
  const accent = kind === 'rule' ? '#2563eb' : kind === 'cue' ? '#d97706' : kind === 'trap' ? '#e11d48' : '#0d9488';
  const soft = kind === 'rule' ? '#dbeafe' : kind === 'cue' ? '#fef3c7' : kind === 'trap' ? '#ffe4e6' : '#ccfbf1';
  const cartoons = {
    'priority-crown': `<g><rect x="10" y="16" width="66" height="44" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="43" y="35" fill="#166534" font-size="9.5" font-weight="800" text-anchor="middle">1. –COOH</text><text x="43" y="49" fill="#15803d" font-size="8.5" font-weight="700" text-anchor="middle">-oic acid</text><rect x="86" y="20" width="66" height="40" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="119" y="37" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">2. –COOR</text><text x="119" y="50" fill="#1d4ed8" font-size="8.5" font-weight="700" text-anchor="middle">-oate / -amide</text><rect x="162" y="24" width="68" height="36" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="196" y="39" fill="#92400e" font-size="9.5" font-weight="800" text-anchor="middle">3. –CHO/C=O</text><text x="196" y="51" fill="#b45309" font-size="8.5" font-weight="700" text-anchor="middle">-al &gt; -one</text><rect x="240" y="28" width="70" height="32" rx="6" fill="#f1f5f9" stroke="#64748b"/><text x="275" y="42" fill="#334155" font-size="9" font-weight="800" text-anchor="middle">4. –OH &gt; NH₂</text><text x="275" y="53" fill="#475569" font-size="8" font-weight="700" text-anchor="middle">&gt; C=C &gt; C≡C</text></g>`,
    'isomer-tree': `<g><rect x="110" y="6" width="100" height="20" rx="5" fill="${soft}" stroke="${accent}"/><text x="160" y="19" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">Isomers (Same Formula)</text><line x1="135" y1="26" x2="72" y2="42" stroke="#64748b" stroke-width="1.8"/><line x1="185" y1="26" x2="248" y2="42" stroke="#64748b" stroke-width="1.8"/><rect x="14" y="42" width="116" height="26" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="72" y="58" fill="#92400e" font-size="9.5" font-weight="800" text-anchor="middle">Constitutional (Diff Bonds)</text><rect x="186" y="42" width="122" height="26" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="247" y="58" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">Stereoisomers (Diff 3D)</text></g>`,
    'cip-wheel': `<g><circle cx="64" cy="38" r="24" fill="${soft}" stroke="${accent}" stroke-width="2"/><text x="64" y="22" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">#1</text><text x="82" y="48" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">#2</text><text x="46" y="48" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">#3</text><path d="M72 20 A16 16 0 0 1 80 38" fill="none" stroke="${accent}" stroke-width="2"/><rect x="116" y="12" width="192" height="52" rx="7" fill="#f8fafc" stroke="#cbd5e1"/><text x="212" y="30" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">#4 Dash: CW = (R) | CCW = (S)</text><text x="212" y="46" fill="#e11d48" font-size="9" font-weight="700" text-anchor="middle">#4 Wedge or Fischer Horiz → FLIP!</text></g>`,
    'polarimeter-tube': `<g><rect x="64" y="22" width="120" height="30" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="124" y="41" fill="#1e3a8a" font-size="9.5" font-weight="800" text-anchor="middle">Chiral Sample (c, l)</text><line x1="28" y1="18" x2="28" y2="56" stroke="#d97706" stroke-width="3"/><line x1="210" y1="20" x2="236" y2="54" stroke="#059669" stroke-width="3"/><text x="268" y="34" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">[α] = α / (c·l)</text><text x="268" y="50" fill="#059669" font-size="9" font-weight="700" text-anchor="middle">ee = |%R − %S|</text></g>`,
    'orbital-nodes': `<g><circle cx="44" cy="38" r="18" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="44" y="68" fill="#1e40af" font-size="8.5" font-weight="800" text-anchor="middle">s (l=0, 0 angular)</text><ellipse cx="122" cy="24" rx="10" ry="14" fill="#dbeafe" stroke="#2563eb" stroke-width="1.8"/><ellipse cx="122" cy="52" rx="10" ry="14" fill="#ffe4e6" stroke="#e11d48" stroke-width="1.8"/><line x1="102" y1="38" x2="142" y2="38" stroke="#64748b" stroke-dasharray="3 2"/><text x="122" y="68" fill="#0f172a" font-size="8.5" font-weight="800" text-anchor="middle">p (l=1, 1 plane)</text><rect x="172" y="14" width="136" height="46" rx="7" fill="${soft}" stroke="${accent}"/><text x="240" y="32" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">Hydrogen-like: nodes = n − 1</text><text x="240" y="48" fill="${accent}" font-size="9" font-weight="700" text-anchor="middle">Angular = l | Radial = n−l−1</text></g>`,
    'sigma-pi-mo': `<g><ellipse cx="70" cy="22" rx="42" ry="9" fill="#dbeafe" stroke="#2563eb" stroke-width="1.8"/><line x1="36" y1="38" x2="104" y2="38" stroke="#0f172a" stroke-width="3"/><ellipse cx="70" cy="54" rx="42" ry="9" fill="#ffe4e6" stroke="#e11d48" stroke-width="1.8"/><text x="70" y="41" fill="#fff" font-size="8" font-weight="800" text-anchor="middle">σ</text><rect x="138" y="12" width="170" height="52" rx="7" fill="${soft}" stroke="${accent}"/><text x="223" y="30" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">C=C = 1σ + 1π | C≡C = 1σ + 2π</text><text x="223" y="47" fill="${accent}" font-size="9" font-weight="700" text-anchor="middle">BO = ½(Bonding − Antibonding*)</text></g>`,
    's-character-gauge': `<g><rect x="12" y="16" width="90" height="44" rx="6" fill="#f1f5f9" stroke="#64748b"/><text x="57" y="34" fill="#334155" font-size="9.5" font-weight="800" text-anchor="middle">sp³ (25% s)</text><text x="57" y="48" fill="#475569" font-size="8.5" font-weight="700" text-anchor="middle">109.5° · pKa 50</text><rect x="114" y="16" width="90" height="44" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="159" y="34" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">sp² (33% s)</text><text x="159" y="48" fill="#1d4ed8" font-size="8.5" font-weight="700" text-anchor="middle">120° · pKa 44</text><rect x="216" y="16" width="92" height="44" rx="6" fill="#dcfce7" stroke="#059669"/><text x="262" y="34" fill="#065f46" font-size="9.5" font-weight="800" text-anchor="middle">sp (50% s)</text><text x="262" y="48" fill="#047857" font-size="8.5" font-weight="700" text-anchor="middle">180° · pKa 25!</text></g>`,
    'ario-pka-scale': `<g><rect x="12" y="14" width="296" height="22" rx="5" fill="#f8fafc" stroke="#cbd5e1"/><rect x="12" y="14" width="74" height="22" rx="5" fill="#ffe4e6"/><text x="49" y="29" fill="#9f1239" font-size="9.5" font-weight="800" text-anchor="middle">1. Atom</text><text x="123" y="29" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">2. Resonance</text><text x="200" y="29" fill="#92400e" font-size="9.5" font-weight="800" text-anchor="middle">3. Induction</text><text x="270" y="29" fill="#065f46" font-size="9.5" font-weight="800" text-anchor="middle">4. Orbital</text><text x="160" y="56" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">↓ pKa = Stronger Acid | pH &gt; pKa → Deprotonated (A⁻)</text></g>`,
    'sn1-sn2-umbrella': `<g><rect x="10" y="10" width="144" height="54" rx="7" fill="#dbeafe" stroke="#2563eb"/><text x="82" y="28" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">SN2: 1 Step Concerted</text><text x="82" y="43" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">1°/2° + Strong Nu⁻ (Aprotic)</text><text x="82" y="57" fill="#1d4ed8" font-size="8.5" font-weight="800" text-anchor="middle">100% Backside Inversion</text><rect x="166" y="10" width="144" height="54" rx="7" fill="#fef3c7" stroke="#d97706"/><text x="238" y="28" fill="#92400e" font-size="9.5" font-weight="800" text-anchor="middle">SN1: 2 Steps via C⁺</text><text x="238" y="43" fill="#78350f" font-size="8.5" font-weight="700" text-anchor="middle">3° + Weak Nu (Protic)</text><text x="238" y="57" fill="#b45309" font-size="8.5" font-weight="800" text-anchor="middle">Planar ion → partial racemization</text></g>`,
    'redox-ladder': `<g><rect x="10" y="20" width="66" height="36" rx="6" fill="#f1f5f9" stroke="#64748b"/><text x="43" y="41" fill="#334155" font-size="9.5" font-weight="800" text-anchor="middle">1° ROH</text><path d="M78 30 L118 30" stroke="#2563eb" stroke-width="2"/><text x="98" y="24" fill="#1e40af" font-size="8" font-weight="800" text-anchor="middle">PCC</text><rect x="120" y="20" width="72" height="36" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="156" y="41" fill="#1e40af" font-size="9.5" font-weight="800" text-anchor="middle">Aldehyde</text><path d="M194 30 L234 30" stroke="#e11d48" stroke-width="2"/><text x="214" y="24" fill="#be123c" font-size="8" font-weight="800" text-anchor="middle">CrO₃</text><rect x="236" y="20" width="74" height="36" rx="6" fill="#ffe4e6" stroke="#e11d48"/><text x="273" y="41" fill="#9f1239" font-size="9.5" font-weight="800" text-anchor="middle">R–COOH</text></g>`,
    'homo-lumo-gap': `<g><line x1="26" y1="16" x2="86" y2="16" stroke="#e11d48" stroke-width="2.5"/><line x1="26" y1="56" x2="86" y2="56" stroke="#2563eb" stroke-width="2.5"/><text x="56" y="39" fill="#0f172a" font-size="8.5" font-weight="800" text-anchor="middle">Large ΔE (UV)</text><line x1="126" y1="28" x2="186" y2="28" stroke="#e11d48" stroke-width="2.5"/><line x1="126" y1="46" x2="186" y2="46" stroke="#2563eb" stroke-width="2.5"/><text x="156" y="62" fill="#059669" font-size="8.5" font-weight="800" text-anchor="middle">↓ ΔE → ↑ λ_max</text><rect x="202" y="14" width="106" height="46" rx="7" fill="${soft}" stroke="${accent}"/><text x="255" y="33" fill="#0f172a" font-size="9" font-weight="800" text-anchor="middle">↑ Conjugation</text><text x="255" y="48" fill="${accent}" font-size="8.5" font-weight="700" text-anchor="middle">Often longer wavelength</text></g>`,
    'spec-puzzle': `<g><rect x="10" y="14" width="70" height="46" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="45" y="33" fill="#1e40af" font-size="8.5" font-weight="800" text-anchor="middle">1. IHD &amp; MS</text><text x="45" y="47" fill="#1d4ed8" font-size="8" font-weight="700" text-anchor="middle">Rings + π</text><rect x="86" y="14" width="70" height="46" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="121" y="33" fill="#92400e" font-size="8.5" font-weight="800" text-anchor="middle">2. IR Peaks</text><text x="121" y="47" fill="#b45309" font-size="8" font-weight="700" text-anchor="middle">C=O / O–H</text><rect x="162" y="14" width="70" height="46" rx="6" fill="#dcfce7" stroke="#059669"/><text x="197" y="33" fill="#065f46" font-size="8.5" font-weight="800" text-anchor="middle">3. ¹H Shift</text><text x="197" y="47" fill="#047857" font-size="8" font-weight="700" text-anchor="middle">Symmetry + Area</text><rect x="238" y="14" width="72" height="46" rx="6" fill="#f3e8ff" stroke="#7c3aed"/><text x="274" y="33" fill="#5b21b6" font-size="8.5" font-weight="800" text-anchor="middle">4. (n + 1)</text><text x="274" y="47" fill="#6d28d9" font-size="8" font-weight="700" text-anchor="middle">Connect CHx</text></g>`,
    'sep-funnel': `<g><polygon points="34,12 94,12 76,52 52,52" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="42" y1="32" x2="86" y2="32" stroke="#0f172a" stroke-width="1.8"/><text x="64" y="25" fill="#1e40af" font-size="8" font-weight="800" text-anchor="middle">Et₂O (d=0.71)</text><text x="64" y="45" fill="#065f46" font-size="8" font-weight="800" text-anchor="middle">Aq. (Ionized)</text><rect x="112" y="12" width="196" height="50" rx="7" fill="${soft}" stroke="${accent}"/><text x="210" y="29" fill="#0f172a" font-size="9" font-weight="800" text-anchor="middle">NaHCO₃ → Extracts RCOOH (pKa 5)</text><text x="210" y="43" fill="#1e40af" font-size="8.5" font-weight="700" text-anchor="middle">NaOH → Extracts Phenol (pKa 10)</text><text x="210" y="56" fill="#059669" font-size="8.5" font-weight="700" text-anchor="middle">HCl → Extracts Amine (RNH₃⁺)</text></g>`,
    'distillation-apparatus': `<g><rect x="10" y="14" width="94" height="46" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="57" y="33" fill="#1e40af" font-size="9" font-weight="800" text-anchor="middle">Simple (wide ΔBP)</text><text x="57" y="47" fill="#1d4ed8" font-size="8" font-weight="700" text-anchor="middle">Wide ΔBP</text><rect x="113" y="14" width="94" height="46" rx="6" fill="#dcfce7" stroke="#059669"/><text x="160" y="33" fill="#065f46" font-size="9" font-weight="800" text-anchor="middle">Fractional (close ΔBP)</text><text x="160" y="47" fill="#047857" font-size="8" font-weight="700" text-anchor="middle">Packed Column</text><rect x="216" y="14" width="94" height="46" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="263" y="33" fill="#92400e" font-size="9" font-weight="800" text-anchor="middle">Vacuum (heat sensitive)</text><text x="263" y="47" fill="#b45309" font-size="8" font-weight="700" text-anchor="middle">↓ P_ext → ↓ BP</text></g>`,
    'tlc-column': `<g><rect x="22" y="8" width="54" height="58" rx="4" fill="#fff" stroke="#475569" stroke-width="1.8"/><line x1="22" y1="18" x2="76" y2="18" stroke="#94a3b8" stroke-dasharray="3 2"/><line x1="22" y1="56" x2="76" y2="56" stroke="#334155" stroke-width="1.5"/><circle cx="38" cy="26" r="4.5" fill="#2563eb"/><circle cx="60" cy="46" r="4.5" fill="#e11d48"/><rect x="92" y="12" width="216" height="50" rx="7" fill="${soft}" stroke="${accent}"/><text x="200" y="30" fill="#0f172a" font-size="9" font-weight="800" text-anchor="middle">Silica TLC: Nonpolar = High Rf (Top)</text><text x="200" y="46" fill="${accent}" font-size="8.5" font-weight="700" text-anchor="middle">Polar (–OH/–COOH) Sticks = Low Rf</text></g>`,
    'bio-chromatography': `<g><rect x="10" y="14" width="94" height="46" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="57" y="33" fill="#1e40af" font-size="9" font-weight="800" text-anchor="middle">SEC (Size Excl)</text><text x="57" y="47" fill="#1d4ed8" font-size="8" font-weight="700" text-anchor="middle">BIG Elutes 1st!</text><rect x="113" y="14" width="94" height="46" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="160" y="33" fill="#92400e" font-size="9" font-weight="800" text-anchor="middle">Ion-Exchange</text><text x="160" y="47" fill="#b45309" font-size="8" font-weight="700" text-anchor="middle">Cation(−) / Anion(+)</text><rect x="216" y="14" width="94" height="46" rx="6" fill="#dcfce7" stroke="#059669"/><text x="263" y="33" fill="#065f46" font-size="9" font-weight="800" text-anchor="middle">Affinity (Ni-NTA)</text><text x="263" y="47" fill="#047857" font-size="8" font-weight="700" text-anchor="middle">His-Tag + Imidazole</text></g>`
  };
  const body = cartoons[theme];
  if(!body)return '';
  return `<svg class="vcard-svg" viewBox="0 0 320 74" role="img" aria-label="${esc(title)} visual schematic">${body}</svg>`;
}

function renderComparisonTable(compRows) {
  if (!compRows || !compRows.length) return '';
  return `<div class="vcomp-wrap"><table class="vcomp-table"><thead><tr><th>Concept / Condition</th><th>Trend &amp; Mechanism</th><th>High-Yield Outcome</th></tr></thead><tbody>${compRows.map(([c1, c2, c3]) => `<tr><td><span class="vcomp-pill">${esc(c1)}</span></td><td>${esc(c2)}</td><td class="vcomp-out">${esc(c3)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderVisualCardBody(l, kind, ui = {}, cardKey = l.id+':'+kind, chemistry = {}) {
  const key = cardKey;
  const source=l.visualCards;
  const rule=source.rule;
  const entry={chips:rule.chips,comp:rule.comparison,svgTheme:rule.theme};
  for(const k of ['rule','cue','trap','app']){
   const v=source[k];entry[k]={strip:v.title};
   if(k==='rule'){if(v.formula){entry[k].formula=v.formula;entry[k].formulaNotes=v.items.map(i=>[i.label,i.text]);}else entry[k].ladder=v.items.map((i,n)=>[i.step||String(n+1),i.label,i.text,i.color||'blue']);}
   if(k==='cue')entry[k].tree={prompt:v.prompt,branches:v.items.map(i=>[i.label,i.outcome||i.label,i.text])};
   if(k==='trap'){entry[k].wrong=v.items[0].text;entry[k].right=v.items[1].text;}
   if(k==='app')entry[k].nodes=v.items.map(i=>[i.label,i.outcome||'',i.text]);
  }
  const spec=entry[kind],rawText=l.cards[kind],isExpanded=Boolean(ui.fullNotes?.[cardKey]);
  const stripMeta = {
    rule: ['CORE RULE · PRIORITY & TREND', 'vstrip-blue'],
    cue: ['MEMORY CUE · DECISION TRICK', 'vstrip-orange'],
    trap: ['MCAT TRAP · WRONG VS RIGHT', 'vstrip-red'],
    app: ['MCAT LINK · BIO / LAB PASSAGE', 'vstrip-teal']
  }[kind] || ['STUDY NOTE', 'vstrip-blue'];

  const stripText = spec?.strip || l.title;
  const chipsHtml = (kind === 'rule' && entry.chips && entry.chips.length)
    ? `<div class="vcard-chips">${entry.chips.map((c, idx) => `<span class="vchip vchip-${idx % 4}">${esc(c)}</span>`).join('')}</div>`
    : '';
  const cartoon=kind==='rule'&&!chemistry.conceal?renderThemeSvg(entry.svgTheme,kind,l.title):'';
  const svgHtml=kind==='rule'?(cartoon?`<div class="vcard-svg-box">${cartoon}</div>`:renderChemicalFigure(rule.figure,l,chemistry,key)):'';
  const compHtml = kind === 'rule' ? renderComparisonTable(entry.comp) : '';

  let schemaHtml = '';
  if (kind === 'rule' && spec) {
    if (spec.ladder) {
      schemaHtml = `<div class="vcard-schema vschema-ladder"><div class="vschema-head">Priority &amp; Mechanism Ladder</div><ol class="vladder-list">${spec.ladder.map(([num, title, desc, color]) => `<li class="vladder-item vl-${esc(color || 'blue')}"><span class="vl-step">${esc(num)}</span><div class="vl-body"><strong>${esc(title)}</strong><span>${esc(desc)}</span></div></li>`).join('')}</ol>${compHtml}</div>`;
    } else if (spec.formula) {
      schemaHtml = `<div class="vcard-schema vschema-formula"><div class="vschema-head">Key Equation &amp; Reference Scale</div><div class="vformula-box">${esc(spec.formula)}</div><div class="vformula-notes">${(spec.formulaNotes || []).map(([lbl, note]) => `<div class="vf-note"><strong>${esc(lbl)}</strong><span>${esc(note)}</span></div>`).join('')}</div>${compHtml}</div>`;
    }
  } else if (kind === 'cue' && spec?.tree) {
    const activeIdx = Number(ui.cueBranches?.[key] || 0);
    const branches = spec.tree.branches || [];
    const safeIdx = activeIdx >= 0 && activeIdx < branches.length ? activeIdx : 0;
    const chosen = branches[safeIdx] || branches[0];
    schemaHtml = `<div class="vcard-schema vschema-tree"><div class="vtree-prompt"><span class="vtree-q">Decision Tree:</span> ${esc(spec.tree.prompt)}</div><div class="vtree-tabs" role="group" aria-label="Mnemonic decision branches">${branches.map(([bLabel], idx) => `<button type="button" class="vtree-btn ${idx === safeIdx ? 'active' : ''}" data-act="cueBranch" data-card="${esc(key)}" data-idx="${idx}" aria-pressed="${idx === safeIdx}"><span class="vtree-num">${idx + 1}</span> ${esc(bLabel)}</button>`).join('')}</div>${chosen ? `<div class="vtree-outcome visual-outcome"><span class="vtree-outcome-tag">${esc(chosen[1])}</span><p class="vtree-outcome-text">${esc(chosen[2])}</p></div>` : ''}</div>`;
  } else if (kind === 'trap' && spec) {
    schemaHtml = `<div class="vcard-schema vschema-trap"><div class="vtrap-col vtrap-wrong"><div class="vtrap-title">✗ Common Trap</div><p>${esc(spec.wrong)}</p></div><div class="vtrap-col vtrap-right"><div class="vtrap-title">✓ Correct Reasoning</div><p>${esc(spec.right)}</p></div></div>`;
  } else if (kind === 'app' && spec?.nodes) {
    schemaHtml = `<div class="vcard-schema vschema-app"><div class="vschema-head">High-Yield Passage Connections</div><div class="vapp-grid">${spec.nodes.map(([label, sub, detail], idx) => `<div class="vapp-node"><div class="vapp-top"><span class="vapp-idx">0${idx + 1}</span><strong>${esc(label)}</strong></div><div class="vapp-code">${esc(sub)}</div><span class="vapp-desc">${esc(detail)}</span></div>`).join('')}</div></div>`;
  }

  return `<div class="visual-card-body vcard-visual-wrap" data-card="${esc(key)}"><div class="vcard-strip ${stripMeta[1]}"><span class="vstrip-badge">${esc(stripMeta[0])}</span><span class="vstrip-text">${esc(stripText)}</span><button type="button" class="vnote-toggle" data-act="cardNote" data-card="${esc(cardKey)}" aria-expanded="${isExpanded ? 'true' : 'false'}">${isExpanded ? 'Hide Full Note ▴' : 'Full Note ▾'}</button></div><div class="visual-card-compact">${chipsHtml}${svgHtml}<div class="visual-diagram">${schemaHtml}</div></div><div class="visual-card-note vcard-prose" ${isExpanded?'':'hidden'}>${rawText}</div></div>`;
}

return {cardKey,renderVisualCardBody};})();
const viewer3d=(()=>{
const {escapeHTML:esc,atomLabel}=validation;
const {formulaLabel,hydrogens}=molecules;
function renderStageToolbar(is3d=false){
 return `<div class="stage-toolbar" role="group" aria-label="Graph view controls"><button type="button" class="btn" data-act="stageView" aria-pressed="${is3d}">${is3d?'Return to 2D':'Illustrative 3D'}</button><button type="button" class="btn" data-act="open3d">Fullscreen 3D</button></div>`;
}
function renderInline3D(mol){
 return `<div class="inline-projection"><div id="inlineProjectionViewport">${renderProjection(mol,35,20)}</div><div class="viewer-controls"><label>Rotate <input data-projection="yaw" type="range" min="-180" max="180" value="35"></label><label>Tilt <input data-projection="pitch" type="range" min="-80" max="80" value="20"></label></div><p>Illustrative graph with arbitrary depth offsets, not a physical conformer. Angles, distances and stereochemistry cannot be inferred from this projection.</p></div>`;
}
function projectGraph(mol,yaw=35,pitch=20){
 const cx=mol.atoms.reduce((s,a)=>s+a.x,0)/mol.atoms.length,cy=mol.atoms.reduce((s,a)=>s+a.y,0)/mol.atoms.length;
 const a=yaw*Math.PI/180,b=pitch*Math.PI/180;
 return mol.atoms.map((atom,i)=>{
  // Drawing coordinates supply connectivity context, not optimized geometry.
  const x=(atom.x-cx),y=(atom.y-cy),z=(i%2?1:-1)*12;
  const u=x*Math.cos(a)+z*Math.sin(a),v=-x*Math.sin(a)+z*Math.cos(a);
  return {i,x:u,y:y*Math.cos(b)-v*Math.sin(b),z:y*Math.sin(b)+v*Math.cos(b)};
 });
}
function renderProjection(mol,yaw,pitch,spacefill=false){
 const points=projectGraph(mol,yaw,pitch),extent=Math.max(60,...points.flatMap(p=>[Math.abs(p.x),Math.abs(p.y)])),scale=140/extent;
 const xy=p=>({x:200+p.x*scale,y:170+p.y*scale});
 const bonds=spacefill?'':mol.bonds.map(([u,v,order])=>{
  const a=xy(points[u]),b=xy(points[v]),len=Math.hypot(b.x-a.x,b.y-a.y)||1,dx=-(b.y-a.y)/len*3,dy=(b.x-a.x)/len*3;
  return Array.from({length:order},(_,j)=>{const k=j-(order-1)/2;return `<line x1="${a.x+k*dx}" y1="${a.y+k*dy}" x2="${b.x+k*dx}" y2="${b.y+k*dy}"/>`;}).join('');
 }).join('');
 const labels=[];
 const nodes=[...points].sort((a,b)=>a.z-b.z).map(p=>{
  const a=mol.atoms[p.i],v=xy(p),q=a.charge?`${a.charge>0?'+':'−'}${Math.abs(a.charge)===1?'':Math.abs(a.charge)}`:'';
  labels.push(`<text x="${v.x}" y="${v.y+3}">${esc(atomLabel(p.i))}: ${esc(a.e+q)}</text>`);
  return `<g class="projection-atom element-${esc(a.e)}"><circle cx="${v.x}" cy="${v.y}" r="${spacefill?23:10}"/></g>`;
 }).join('');
 return `<svg viewBox="0 0 400 340" role="img" aria-label="Illustrative projection of the displayed molecular graph"><g class="projection-bonds">${bonds}</g>${nodes}<g class="projection-labels">${labels.join('')}</g></svg>`;
}
function open3DViewer(mol,revealed=false){
 if(!mol)return;document.getElementById('viewer3dDialog')?.close();const dlg=document.createElement('dialog');dlg.id='viewer3dDialog';dlg.className='viewer3d-dialog';dlg.setAttribute('aria-labelledby','viewer3dTitle');document.body.append(dlg);
 let yaw=35,pitch=20,spacefill=false;const prior=document.activeElement;
 dlg.innerHTML=`<div class="viewer-head"><h2 id="viewer3dTitle">${revealed?esc(mol.name):'Displayed molecular graph'}</h2><button type="button" class="btn" id="close3d">Close 3D</button></div><p class="viewer-note">Illustrative graph projection with arbitrary depth offsets for inspection. Rotation adds no structural evidence: bond angles, distances, conformations and stereochemistry are not determined by this view. It is not an optimized or experimental geometry.</p><div id="projectionViewport"></div><div class="viewer-controls"><label>Rotate <input id="projectionYaw" type="range" min="-180" max="180" value="35"></label><label>Tilt <input id="projectionPitch" type="range" min="-80" max="80" value="20"></label><button type="button" class="btn" id="projectionStyle" aria-pressed="false">Larger atom spheres</button><button type="button" class="btn" id="projectionReset">Reset view</button></div><p>${revealed?`Formula: ${esc(formulaLabel(mol))}. `:''}Atom letters retain the 2D graph indices. Hydrogens are listed below rather than assigned invented positions.</p><details><summary>Atom inventory and review note</summary><p>${revealed?esc(mol.review):'Teaching graph; molecular identity and author review note remain concealed until revealed.'}</p><ul>${mol.atoms.map((a,i)=>`<li>${esc(atomLabel(i))}: ${esc(a.e)}; H count ${hydrogens(mol,i)}${a.charge?`; charge ${a.charge}`:''}</li>`).join('')}</ul></details>`;
 const draw=()=>{dlg.querySelector('#projectionViewport').innerHTML=renderProjection(mol,yaw,pitch,spacefill);};draw();
 dlg.oninput=e=>{if(e.target.id==='projectionYaw')yaw=Number(e.target.value);if(e.target.id==='projectionPitch')pitch=Number(e.target.value);draw();};
 dlg.onclick=e=>{const id=e.target.closest('button')?.id;if(id==='close3d')dlg.close();if(id==='projectionStyle'){spacefill=!spacefill;e.target.setAttribute('aria-pressed',String(spacefill));draw();}if(id==='projectionReset'){yaw=35;pitch=20;dlg.querySelector('#projectionYaw').value=yaw;dlg.querySelector('#projectionPitch').value=pitch;draw();}};
 dlg.onclose=()=>{dlg.remove();dlg.oninput=dlg.onclick=null;prior?.focus();};dlg.showModal();dlg.querySelector('#close3d').focus();
}

return {renderStageToolbar,renderInline3D,projectGraph,renderProjection,open3DViewer};})();
const learn=(()=>{
const {renderVisualCardBody,cardKey}=visuals;
const {renderStageToolbar,renderInline3D}=viewer3d;
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
  return `<div class="grid2"><section class="card"><div class="c-head"><h1 class="c-title">${esc(l.title)}</h1><span class="c-tag">${esc(l.tag)}</span></div>${challenge?'':renderStageToolbar(ui.stage3d)}<div class="stage">${ui.stage3d&&!challenge?renderInline3D(m):drawMolecule(m,opts)}</div>${drawDiagram(s.diagram,ui.diagramValue)}
  ${challenge?`<p>${esc(s.challenge.prompt)}</p><button class="btn pri" data-act="checkTry">Check selection</button> <button class="btn" data-act="try">Back to walkthrough</button>${ui.checked?`<div role="status" class="fbox ${good?'ok':'err'}">${good?esc(s.challenge.explanation):'Not yet. Select exactly the requested atoms; use the walkthrough for a hint.'}</div>`:''}`:`<div class="sbar"><button class="sbtn" data-act="prev" ${state.step===0?'disabled':''}>← Previous</button>${l.steps.map((t,i)=>`<button class="sbtn" data-act="step" data-idx="${i}" aria-pressed="${i===state.step}">${esc(t.label)}</button>`).join('')}<button class="sbtn" data-act="next" ${state.step===l.steps.length-1?'disabled':''}>Next →</button></div><div class="sexp" role="status">${s.text}</div>${revealed?anatomy(s.anatomy,m.name)+`<p class="formula">Formula: ${esc(formulaLabel(m))}</p>`:'<div class="abar">Structure name concealed until its explanation. <button class="btn" data-act="revealLearn">Reveal name</button></div>'}${s.challenge?'<button class="btn try-btn" data-act="try">🖐 Try It Yourself</button>':''}`}</section>
  <aside class="tstack">${renderLearnCards(ch,l,s,ui,molecules,revealed)}</aside></div>`;
}

function renderLearnCards(ch,l,s,ui={},molecules,revealed=false){
 const allFull=['rule','cue','trap','app'].every(k=>ui.fullNotes?.[cardKey(ch,l,k)]);
 return `<div class="tstack-bar"><span class="tstack-lbl">⚡ High-Yield Visual Cues</span><button type="button" class="vnote-all-btn" data-act="expandCards">${allFull?'Compact Visual Mode':'Expand All Full Notes'}</button></div>${[['rule','Core Rules','tc-rule'],['cue','Memory Cues','tc-cue'],['trap','Common Mistakes / MCAT Traps','tc-trap'],['app','MCAT Applications','tc-app']].map(([k,t,c])=>`<details data-section="${cardKey(ch,l,k)}" class="tcard ${c} ${s.focus===k?'focus':''}" ${(ui.openSections?.[cardKey(ch,l,k)]??k===(s.focus||'rule'))?'open':''}><summary><h2>${t}</h2></summary>${renderVisualCardBody(l,k,ui,cardKey(ch,l,k),{molecules,revealed,conceal:Boolean(ui.tryMode&&s.challenge)})}</details>`).join('')}<button class="btn pri" data-act="practiceConcept">Practice this concept →</button><details class="drw"><summary>Chapter objectives & sources</summary><ul>${ch.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>Original educational content following the supplied curriculum. ${esc(ch.review.note)}</p>${ch.sources.map(s=>`<p>${s.location.startsWith('https://')?`<a href="${esc(s.location)}" target="_blank" rel="noreferrer">${esc(s.label)}</a>`:esc(s.label)}</p>`).join('')}</details>`;
}

return {anatomy,renderLearn,renderLearnCards};})();
const practice=(()=>{
const {renderStageToolbar,renderInline3D}=viewer3d;
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
  // A correct decision earns its own visual explanation before Continue.
  // Unanswered stages may retain prior context only on the same molecular graph.
  // An explicitly empty highlight set clears focus; it is not a fallback request.
  const priorHighlights=switched?{}:(ex.stages[p.stage-1]?.highlights||{});
  const opts=done?(ex.stages.at(-1).highlights||{}):{...(ui.correct?(s.highlights||{}):priorHighlights),...(s.type==='atoms'?{click:true,sel:ui.selected}:{})};
  return `<div class="sub-nav"><span>Guided workshops</span><div class="workshops">${labs.map((e,i)=>`<button class="btn ${i===state.exercise?'pri':''}" data-act="exercise" data-idx="${i}" aria-pressed="${i===state.exercise}">${esc(e.label)}${state.practice[`${ch.id}:${e.id}`]?.solved?' ✓':''}</button>`).join('')}</div></div><div class="grid2"><section class="card"><div class="c-head"><h1 class="c-title">${esc(ex.title)}</h1><span class="c-tag">${done?(p.solved?'Solved independently':'Studied with support'):`Stage ${p.stage+1} of ${ex.stages.length}`}</span></div>${done?renderStageToolbar(ui.stage3d):''}<div class="stage">${ex.concealStructure&&!done?'<p class="concealed-structure">Candidate structure withheld. Use the supplied observations to infer it; the structure is shown after completion.</p>':(done&&ui.stage3d?renderInline3D(molecules[molecule]):drawMolecule(molecules[molecule],opts))}</div>${drawDiagram(displayed.molecule?null:ex.diagram,ui.diagramValue,{concealAnswers:!done})}${ex.context?`<p>${esc(ex.context)}</p>`:''}
  ${done?`${anatomy(ex.anatomy,ex.summary)}<p class="formula">Displayed structure: ${esc(molecules[molecule].name)}<br>Formula: ${esc(formulaLabel(molecules[molecule]))}</p><button class="btn" data-act="replay">Replay workshop</button> <button class="btn pri" data-act="nextExercise">Next workshop →</button>`:'<p class="muted">Solve each decision. Hints and revealed solutions are recorded as assisted study.</p><button class="btn" data-act="revealSolution">Reveal worked solution</button>'}</section><section aria-label="Workshop stages">
  ${done?ex.stages.map((st,i)=>`<div class="scard"><h2 class="shead">${i+1}. ${esc(st.prompt)}</h2><p><strong>${esc(solutionText(st))}</strong></p><div class="sexp">${esc(st.explanation)}</div></div>`).join(''):`${p.stage?`<p class="muted">${p.stage} earlier decision${p.stage>1?'s':''} completed.</p>`:''}<div class="scard"><h2 class="shead" tabindex="-1" id="stageTitle">${esc(s.prompt)}</h2><span class="stag">${esc(s.skill)}</span>${s.type==='choice'?`<div class="clist">${s.options.map((o,i)=>`<button class="copt ${ui.correct&&i===s.answer?'ok':''}" data-act="choice" data-idx="${i}" ${ui.correct?'disabled':''}><span class="clet">${atomLabel(i)}</span>${esc(o)}</button>`).join('')}</div>`:s.type==='atoms'?`<p>Select atoms on the structure using click or Tab and Enter. Selected: <strong>${ui.selected.map(atomLabel).join(', ')||'None'}</strong></p><button class="btn pri" data-act="checkAnswer" ${ui.correct?'disabled':''}>Check selection</button>`:`<form id="answerForm"><label for="answer">${s.type==='number'?`Numeric answer${s.unit?' ('+esc(s.unit)+')':''}`:'Your answer'}</label><input id="answer" class="tinp" autocomplete="off" spellcheck="false" ${s.type==='number'?'inputmode="decimal"':''} value="${esc(ui.value)}" ${ui.correct?'disabled':''}><button class="btn pri" type="submit" ${ui.correct?'disabled':''}>Check answer</button></form>`}
  ${ui.feedback?`<div class="fbox ${ui.correct?'ok':'err'}" role="status">${esc(ui.feedback)}</div>`:''}
  ${ui.correct?'<button class="btn suc" data-act="continue">Continue →</button>':`<button class="btn hint" data-act="hint" ${p.hints>=s.hints.length?'disabled':''}>${p.hints>=s.hints.length?'All hints shown':'Show next hint'}</button>${s.hints.slice(0,p.hints).map(h=>`<p class="sexp">${esc(h)}</p>`).join('')}`}</div><p class="locked">${ex.stages.length-p.stage-1} later stage(s) concealed until you continue.</p>`}</section></div>`;
}

return {solutionText,renderPractice};})();
const app=(()=>{
const {open3DViewer,renderProjection}=viewer3d;
const {escapeHTML:esc,validateAnswer}=validation;
const {readProgress,writeProgress,getProgress,freshState}=progress;
const {applyPreferences}=animations;
const {renderLearn,renderLearnCards}=learn;
const {renderPractice}=practice;
function startApp(data){
  const {chapters,molecules}=data;
  let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('unavailable');}};}
  const loaded=readProgress(storage,chapters);let state=loaded.state;
  let ui={},storageError=loaded.error;
  let toastTimer;
  function showToast(message){clearTimeout(toastTimer);document.getElementById('toast').textContent=message;toastTimer=setTimeout(()=>{document.getElementById('toast').textContent='';},4500);}
  const resetUI=()=>{ui={selected:[],value:'',feedback:'',correct:false,checked:false,tryMode:false,revealLearn:false,diagramValue:undefined,fullNotes:ui.fullNotes||{},cueBranches:ui.cueBranches||{},openSections:ui.openSections||{}};};resetUI();
  const chapter=()=>chapters.find(c=>c.id===state.chapter)||chapters[0];
  const labs=()=>chapter().exercises.filter(e=>e.lesson===chapter().lessons[state.lesson].id);
  const exercise=()=>labs()[state.exercise]||labs()[0];
  const save=()=>{if(!writeProgress(storage,state))storageError=true;};
  function currentViewerMolecule(){
    const ch=chapter();if(state.mode==='learn'){const l=ch.lessons[state.lesson],s=l.steps[state.step];if(ui.tryMode&&s.challenge)return null;return molecules[s.molecule||l.molecule];}
    const ex=exercise(),p=getProgress(state,ch,ex);return p.stage===ex.stages.length?molecules[ex.stages.at(-1).molecule||ex.molecule]:null;
  }
  function syncCards(){document.querySelectorAll('.tstack details[data-section]').forEach(d=>{ui.openSections[d.dataset.section]=d.open;});}
  function renderCardsOnly(focus){
    const stack=document.querySelector('.tstack');if(!stack||state.mode!=='learn')return;
    const ch=chapter(),l=ch.lessons[state.lesson];stack.innerHTML=renderLearnCards(ch,l,l.steps[state.step],ui,molecules,Boolean(l.steps[state.step].reveal||ui.revealLearn));if(focus)stack.querySelector(focus)?.focus();
  }
  function render(focus){
    syncCards();
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
    document.getElementById('view').innerHTML=`<p class="chapter-intro">Chapter ${ch.id} · ${esc(ch.title)} — ${esc(ch.description)}</p><nav class="cnav" aria-label="Concepts">${ch.lessons.map((l,i)=>`<button class="cbtn" data-act="lesson" data-idx="${i}" aria-pressed="${i===state.lesson}"><span>Lesson ${i+1}</span>${esc(l.label)}</button>`).join('')}</nav>`+(state.mode==='learn'?renderLearn(ch,molecules,state,ui):renderPractice(ch,molecules,state,ui));
    if(focus)document.querySelector(focus)?.focus();
  }
  function check(value){const ex=exercise(),p=getProgress(state,chapter(),ex),s=ex.stages[p.stage];if(!s||ui.correct)return;
    ui.correct=validateAnswer(s,value);ui.feedback=ui.correct?s.explanation:s.type==='choice'?(s.feedback?.[value]||'Not yet. Reconsider the rule and try again.'):'Not yet. Check the exact selection, punctuation, sign, or requested units. Use a hint if needed.';
    render(ui.correct?'[data-act="continue"]':s.type==='text'||s.type==='number'?'#answer':undefined);
  }
  document.addEventListener('input',e=>{if(e.target.id==='answer')ui.value=e.target.value;
    if(e.target.dataset.projection){const mol=currentViewerMolecule();if(!mol)return;const yaw=document.querySelector('[data-projection="yaw"]'),pitch=document.querySelector('[data-projection="pitch"]');document.getElementById('inlineProjectionViewport').innerHTML=renderProjection(mol,Number(yaw.value),Number(pitch.value));}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='chSel'){state.chapter=Number(e.target.value);state.lesson=state.step=state.exercise=0;resetUI();save();render('#main');}
    if(e.target.dataset.control==='diagram'){ui.diagramValue=Number(e.target.value);render('[data-control="diagram"]');}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='answerForm'){e.preventDefault();check(ui.value);}});
  document.addEventListener('keydown',e=>{const hit=e.target.closest?.('.ahit');if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();hit.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const act=b.dataset.act,i=Number(b.dataset.idx);let focus;
    syncCards();
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
    else if(act==='cardNote'){
      syncCards();ui.fullNotes[b.dataset.card]=!ui.fullNotes[b.dataset.card];
      renderCardsOnly(`[data-act="cardNote"][data-card="${b.dataset.card}"]`);return;
    }
    else if(act==='expandCards'){
      syncCards();const ch=chapter(),l=ch.lessons[state.lesson],keys=['rule','cue','trap','app'].map(k=>`${ch.id}:${l.id}:${k}`),full=!keys.every(k=>ui.fullNotes[k]);
      keys.forEach(k=>{ui.fullNotes[k]=full;ui.openSections[k]=true;});renderCardsOnly('[data-act="expandCards"]');return;
    }
    else if(act==='cueBranch'){
      syncCards();const key=b.dataset.card,l=chapter().lessons[state.lesson];if(!Number.isInteger(i)||i<0||i>=l.visualCards.cue.items.length)return;
      ui.cueBranches[key]=i;renderCardsOnly(`[data-act="cueBranch"][data-card="${key}"][data-idx="${i}"]`);return;
    }
    else if(act==='stageView'){if(!currentViewerMolecule())return;ui.stage3d=!ui.stage3d;render('[data-act="stageView"]');return;}
    else if(act==='open3d'){
      const ch=chapter();
      if(state.mode==='learn'){
        const l=ch.lessons[state.lesson],s=l.steps[state.step];if(ui.tryMode&&s.challenge)return;
        open3DViewer(molecules[s.molecule||l.molecule],Boolean(s.reveal||ui.revealLearn));
      }else{const ex=exercise(),p=getProgress(state,ch,ex);if(p.stage!==ex.stages.length)return;open3DViewer(molecules[ex.stages.at(-1).molecule||ex.molecule],true);}
      return;
    }
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