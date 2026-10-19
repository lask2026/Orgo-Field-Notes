import {escapeHTML as esc} from './validation.js';
export function drawDiagram(d,value,{concealAnswers=false}={}){
  if(!d)return '';
  let svg='',controls='';
  if(d.type==='fischer'){
    svg=`<line x1="180" y1="35" x2="180" y2="165"/><line x1="80" y1="100" x2="280" y2="100"/>`+[[180,25,d.top],[180,190,d.bottom],[50,105,d.left],[315,105,d.right]].map(([x,y,t])=>`<text x="${x}" y="${y}">${esc(t)}</text>`).join('');
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
    controls=`<label>pH <output>${ph}</output><input data-control="diagram" type="range" min="0" max="14" step="0.1" value="${ph}" aria-label="pH"></label><p>Model monoprotic acid, pKa = ${d.pKa}. Fraction A⁻ = 1 / (1 + 10^(pKa − pH)).</p>`;
  }
  return `<figure class="diagram"><svg viewBox="0 0 360 230" role="img" aria-label="${esc(d.caption)}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#334155" stroke-width="2">${svg}</g></svg><figcaption>${esc(d.caption)}</figcaption>${controls}</figure>`;
}
