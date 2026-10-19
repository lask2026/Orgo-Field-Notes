import {escapeHTML as esc} from './validation.js';
import {drawMolecule,formulaLabel} from './molecules.js';
import {drawDiagram} from './diagrams.js';

function paper(label,body){
 return `<svg class="chem-cartoon" viewBox="0 0 480 260" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}
function text(x,y,t,extra=''){return `<text x="${x}" y="${y}" ${extra}>${esc(t)}</text>`;}
export function apparatus(type){
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
export function renderChemicalFigure(spec,lesson,{molecules,revealed=false,conceal=false}={},key='figure'){
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
