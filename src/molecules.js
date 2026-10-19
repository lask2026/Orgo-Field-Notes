import {escapeHTML as esc,atomLabel} from './validation.js';
export function valences(m){return m.atoms.map((_,i)=>m.bonds.reduce((s,[a,b,n])=>s+((a===i||b===i)?n:0),0));}
export function hydrogens(m,i){const a=m.atoms[i],v=valences(m)[i];return a.h??Math.max(0,({C:4,N:a.charge===1?4:3,O:a.charge===-1?1:2,H:1,F:1,Cl:1,Br:1,I:1,P:5,S:2}[a.e]??v)-v);}
export function molecularFormula(m){
  const counts={};m.atoms.forEach((a,i)=>{counts[a.e]=(counts[a.e]||0)+1;const h=hydrogens(m,i);if(h)counts.H=(counts.H||0)+h;});
  const order=['C','H',...Object.keys(counts).filter(k=>k!=='C'&&k!=='H').sort()];
  return order.filter(e=>counts[e]).map(e=>e+(counts[e]===1?'':counts[e])).join('');
}
export function graphDescription(m){return m.atoms.map((a,i)=>`${atomLabel(i)}: ${a.e}${a.charge?` charge ${a.charge}`:''}, ${hydrogens(m,i)} implicit H`).join('; ')+'. Bonds: '+m.bonds.map(([a,b,n])=>`${atomLabel(a)}–${atomLabel(b)} ${['','single','double','triple'][n]}`).join('; ')+'.';}
export function drawMolecule(m,opts={}){
  const path=opts.path||[],prin=opts.prin||[],sub=opts.sub||[],sel=opts.sel||[];
  const label=(a,i)=>a.e==='C'?'':a.e+(hydrogens(m,i)?'H'+(hydrogens(m,i)>1?hydrogens(m,i):''):'')+(a.charge===1?'⁺':a.charge===-1?'⁻':'');
  let h=`<svg class="mol" viewBox="-24 -28 ${m.w+48} ${m.h+56}" xmlns="http://www.w3.org/2000/svg" role="${opts.click?'group':'img'}" aria-label="Molecular structure; atoms labeled A onward">`;
  for(const [a,b] of m.bonds)if(path.includes(a)&&path.includes(b)){const p=m.atoms[a],q=m.atoms[b];h+=`<line class="anim-path" pathLength="100" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#bfdbfe" stroke-width="17" stroke-linecap="round"/>`;}
  for(const [arr,color,fill] of [[prin,'#059669','#d1fae5'],[sub,'#d97706','#fef3c7'],[opts.alpha||[],'#e11d48','#ffe4e6']])for(const i of arr){const a=m.atoms[i];h+=`<circle class="anim-halo" cx="${a.x}" cy="${a.y}" r="19" fill="${fill}" stroke="${color}" stroke-width="2"/>`;}
  for(const [bi,[a,b,n]] of m.bonds.entries()){
    const p=m.atoms[a],q=m.atoms[b],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
    const ca=label(p,a)?16:0,cb=label(q,b)?16:0,col=path.includes(a)&&path.includes(b)?'#1d4ed8':'#0f172a';
    const stereo=m.stereo?.find(s=>s.bond===bi);
    if(stereo?.type==='wedge'){h+=`<polygon points="${p.x},${p.y} ${q.x-uy*7},${q.y+ux*7} ${q.x+uy*7},${q.y-ux*7}" fill="${col}"/>`;continue;}
    if(stereo?.type==='dash'){for(let t=.15;t<1;t+=.13)h+=`<line x1="${p.x+dx*t-uy*7*t}" y1="${p.y+dy*t+ux*7*t}" x2="${p.x+dx*t+uy*7*t}" y2="${p.y+dy*t-ux*7*t}" stroke="${col}" stroke-width="2"/>`;continue;}
    for(const off of n===1?[0]:n===2?[-3,3]:[-5.5,0,5.5])h+=`<line x1="${p.x+ux*ca-uy*off}" y1="${p.y+uy*ca+ux*off}" x2="${q.x-ux*cb-uy*off}" y2="${q.y-uy*cb+ux*off}" stroke="${col}" stroke-width="2.7" stroke-linecap="round"/>`;
  }
  m.atoms.forEach((a,i)=>{
    const l=label(a,i);
    if(l)h+=`<text x="${a.x}" y="${a.y+6}" text-anchor="middle" style="font-size:16px;fill:${a.e==='O'?'#047857':a.e==='N'?'#1d4ed8':'#0f172a'}">${esc(l)}</text>`;
    if(opts.click){
      const y=l?a.y+26:a.y;
      h+=`<g class="ahit ${sel.includes(i)?'sel':''}" role="button" tabindex="0" data-act="${opts.act||'selectAtom'}" data-idx="${i}" aria-label="Atom ${atomLabel(i)}, ${a.e}" aria-pressed="${sel.includes(i)}"><circle cx="${a.x}" cy="${y}" r="16"/><text x="${a.x}" y="${y+4}" text-anchor="middle">${atomLabel(i)}</text></g>`;
    }
    if(opts.num?.includes(i)){const ix=opts.num.indexOf(i);h+=`<g class="anim-loc" style="--i:${ix}"><circle cx="${a.x}" cy="${a.y-22}" r="10" fill="#2563eb"/><text x="${a.x}" y="${a.y-18}" text-anchor="middle" style="font-size:11px;fill:#fff">${ix+1}</text></g>`;}
  });
  return h+'</svg>'+`<details class="graph-text"><summary>Accessible atom and bond description</summary><p>${esc(graphDescription(m))}</p></details>`;
}
