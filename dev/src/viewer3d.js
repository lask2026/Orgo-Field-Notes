import {escapeHTML as esc,atomLabel} from './validation.js';
import {formulaLabel,hydrogens} from './molecules.js';
export function renderStageToolbar(is3d=false){
 return `<div class="stage-toolbar" role="group" aria-label="Graph view controls"><button type="button" class="btn" data-act="stageView" aria-pressed="${is3d}">${is3d?'Return to 2D':'Illustrative 3D'}</button><button type="button" class="btn" data-act="open3d">Fullscreen 3D</button></div>`;
}
export function renderInline3D(mol){
 return `<div class="inline-projection"><div id="inlineProjectionViewport">${renderProjection(mol,35,20)}</div><div class="viewer-controls"><label>Rotate <input data-projection="yaw" type="range" min="-180" max="180" value="35"></label><label>Tilt <input data-projection="pitch" type="range" min="-80" max="80" value="20"></label></div><p>Illustrative graph with arbitrary depth offsets, not a physical conformer. Angles, distances and stereochemistry cannot be inferred from this projection.</p></div>`;
}
export function projectGraph(mol,yaw=35,pitch=20){
 const cx=mol.atoms.reduce((s,a)=>s+a.x,0)/mol.atoms.length,cy=mol.atoms.reduce((s,a)=>s+a.y,0)/mol.atoms.length;
 const a=yaw*Math.PI/180,b=pitch*Math.PI/180;
 return mol.atoms.map((atom,i)=>{
  // Drawing coordinates supply connectivity context, not optimized geometry.
  const x=(atom.x-cx),y=(atom.y-cy),z=(i%2?1:-1)*12;
  const u=x*Math.cos(a)+z*Math.sin(a),v=-x*Math.sin(a)+z*Math.cos(a);
  return {i,x:u,y:y*Math.cos(b)-v*Math.sin(b),z:y*Math.sin(b)+v*Math.cos(b)};
 });
}
export function renderProjection(mol,yaw,pitch,spacefill=false){
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
export function open3DViewer(mol,revealed=false){
 if(!mol)return;document.getElementById('viewer3dDialog')?.close();const dlg=document.createElement('dialog');dlg.id='viewer3dDialog';dlg.className='viewer3d-dialog';dlg.setAttribute('aria-labelledby','viewer3dTitle');document.body.append(dlg);
 let yaw=35,pitch=20,spacefill=false;const prior=document.activeElement;
 dlg.innerHTML=`<div class="viewer-head"><h2 id="viewer3dTitle">${revealed?esc(mol.name):'Displayed molecular graph'}</h2><button type="button" class="btn" id="close3d">Close 3D</button></div><p class="viewer-note">Illustrative graph projection with arbitrary depth offsets for inspection. Rotation adds no structural evidence: bond angles, distances, conformations and stereochemistry are not determined by this view. It is not an optimized or experimental geometry.</p><div id="projectionViewport"></div><div class="viewer-controls"><label>Rotate <input id="projectionYaw" type="range" min="-180" max="180" value="35"></label><label>Tilt <input id="projectionPitch" type="range" min="-80" max="80" value="20"></label><button type="button" class="btn" id="projectionStyle" aria-pressed="false">Larger atom spheres</button><button type="button" class="btn" id="projectionReset">Reset view</button></div><p>${revealed?`Formula: ${esc(formulaLabel(mol))}. `:''}Atom letters retain the 2D graph indices. Hydrogens are listed below rather than assigned invented positions.</p><details><summary>Atom inventory and review note</summary><p>${revealed?esc(mol.review):'Teaching graph; molecular identity and author review note remain concealed until revealed.'}</p><ul>${mol.atoms.map((a,i)=>`<li>${esc(atomLabel(i))}: ${esc(a.e)}; H count ${hydrogens(mol,i)}${a.charge?`; charge ${a.charge}`:''}</li>`).join('')}</ul></details>`;
 const draw=()=>{dlg.querySelector('#projectionViewport').innerHTML=renderProjection(mol,yaw,pitch,spacefill);};draw();
 dlg.oninput=e=>{if(e.target.id==='projectionYaw')yaw=Number(e.target.value);if(e.target.id==='projectionPitch')pitch=Number(e.target.value);draw();};
 dlg.onclick=e=>{const id=e.target.closest('button')?.id;if(id==='close3d')dlg.close();if(id==='projectionStyle'){spacefill=!spacefill;e.target.setAttribute('aria-pressed',String(spacefill));draw();}if(id==='projectionReset'){yaw=35;pitch=20;dlg.querySelector('#projectionYaw').value=yaw;dlg.querySelector('#projectionPitch').value=pitch;draw();}};
 dlg.onclose=()=>{dlg.remove();dlg.oninput=dlg.onclick=null;prior?.focus();};dlg.showModal();dlg.querySelector('#close3d').focus();
}
