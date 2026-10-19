import {renderVisualCardBody,cardKey} from './visuals.js';
import {renderStageToolbar,renderInline3D} from './viewer3d.js';
import {escapeHTML as esc,validateAnswer} from './validation.js';
import {drawMolecule,formulaLabel} from './molecules.js';
import {drawDiagram} from './diagrams.js';
export function anatomy(parts,name){return `<div class="abar">${(parts||[]).map(([c,t,s],i)=>`<span class="npill ${esc(c)}" style="--i:${i}">${esc(t)}<small>${esc(s)}</small></span>`).join('')}<span class="final-merged">${esc(name)}</span></div>`;}
export function renderLearn(ch,molecules,state,ui){
  const l=ch.lessons[state.lesson],s=l.steps[state.step],m=molecules[s.molecule||l.molecule];
  const revealed=s.reveal||ui.revealLearn;
  const challenge=ui.tryMode&&s.challenge;
  const good=challenge&&ui.checked&&validateAnswer({type:'atoms',answer:s.challenge.answer},ui.selected);
  const opts=challenge?{click:true,sel:ui.selected}:s.highlights;
  return `<div class="grid2"><section class="card"><div class="c-head"><h1 class="c-title">${esc(l.title)}</h1><span class="c-tag">${esc(l.tag)}</span></div>${challenge?'':renderStageToolbar(ui.stage3d)}<div class="stage">${ui.stage3d&&!challenge?renderInline3D(m):drawMolecule(m,opts)}</div>${drawDiagram(s.diagram,ui.diagramValue)}
  ${challenge?`<p>${esc(s.challenge.prompt)}</p><button class="btn pri" data-act="checkTry">Check selection</button> <button class="btn" data-act="try">Back to walkthrough</button>${ui.checked?`<div role="status" class="fbox ${good?'ok':'err'}">${good?esc(s.challenge.explanation):'Not yet. Select exactly the requested atoms; use the walkthrough for a hint.'}</div>`:''}`:`<div class="sbar"><button class="sbtn" data-act="prev" ${state.step===0?'disabled':''}>← Previous</button>${l.steps.map((t,i)=>`<button class="sbtn" data-act="step" data-idx="${i}" aria-pressed="${i===state.step}">${esc(t.label)}</button>`).join('')}<button class="sbtn" data-act="next" ${state.step===l.steps.length-1?'disabled':''}>Next →</button></div><div class="sexp" role="status">${s.text}</div>${revealed?anatomy(s.anatomy,m.name)+`<p class="formula">Formula: ${esc(formulaLabel(m))}</p>`:'<div class="abar">Structure name concealed until its explanation. <button class="btn" data-act="revealLearn">Reveal name</button></div>'}${s.challenge?'<button class="btn try-btn" data-act="try">🖐 Try It Yourself</button>':''}`}</section>
  <aside class="tstack">${renderLearnCards(ch,l,s,ui)}</aside></div>`;
}

export function renderLearnCards(ch,l,s,ui={}){
 const allFull=['rule','cue','trap','app'].every(k=>ui.fullNotes?.[cardKey(ch,l,k)]);
 return `<button type="button" class="btn" data-act="expandCards">${allFull?'Compact notes':'Expand all notes'}</button>${[['rule','Core Rules','tc-rule'],['cue','Memory Cues','tc-cue'],['trap','Common Mistakes / MCAT Traps','tc-trap'],['app','MCAT Applications','tc-app']].map(([k,t,c])=>`<details data-section="${cardKey(ch,l,k)}" class="tcard ${c} ${s.focus===k?'focus':''}" ${(ui.openSections?.[cardKey(ch,l,k)]??k===(s.focus||'rule'))?'open':''}><summary><h2>${t}</h2></summary>${renderVisualCardBody(l,k,ui,cardKey(ch,l,k))}</details>`).join('')}<button class="btn pri" data-act="practiceConcept">Practice this concept →</button><details class="drw"><summary>Chapter objectives & sources</summary><ul>${ch.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>Original educational content following the supplied curriculum. ${esc(ch.review.note)}</p>${ch.sources.map(s=>`<p>${s.location.startsWith('https://')?`<a href="${esc(s.location)}" target="_blank" rel="noreferrer">${esc(s.label)}</a>`:esc(s.label)}</p>`).join('')}</details>`;
}
