import {escapeHTML as esc} from './validation.js';
export function cardKey(ch,lesson,kind){return `${ch.id}:${lesson.id}:${kind}`;}
export function renderVisualSummary(spec,key,selected=0){
 const nodes=spec.items.map((item,i)=>`<li class="visual-node"><span class="visual-step" aria-hidden="true">${i+1}</span><div><strong>${esc(item.label)}</strong><p>${esc(item.text)}</p></div></li>`).join('');
 if(spec.layout==='decision'){
  const index=Number.isInteger(selected)&&selected>=0&&selected<spec.items.length?selected:0,chosen=spec.items[index];
  return `<div class="visual-diagram visual-decision" role="group" aria-label="Decision schematic"><div class="visual-root">${esc(spec.title)}</div><div class="visual-branches" role="group" aria-label="Choose a cue branch">${spec.items.map((item,i)=>`<button type="button" class="visual-branch" data-act="cueBranch" data-card="${esc(key)}" data-idx="${i}" aria-pressed="${i===index}">${esc(item.label)}</button>`).join('')}</div><div class="visual-outcome" role="status"><span>Then check</span><strong>${esc(chosen.text)}</strong></div></div>`;
 }
 return `<div class="visual-diagram visual-${esc(spec.layout)}" role="group" aria-label="${esc(spec.layout)} schematic"><div class="visual-root">${esc(spec.title)}</div><${spec.layout==='flow'?'ol':'ul'} class="visual-nodes">${nodes}</${spec.layout==='flow'?'ol':'ul'}></div>`;
}
export function renderVisualCardBody(lesson,kind,ui={},key=lesson.id+':'+kind){
 const full=Boolean(ui.fullNotes?.[key]),spec=lesson.visualCards[kind],id='note-'+key.replace(/[^a-zA-Z0-9_-]/g,'-');
 return `<div class="visual-card-body" data-card="${esc(key)}"><div class="visual-card-strip"><span>Schematic summary</span><button type="button" class="btn" data-act="cardNote" data-card="${esc(key)}" aria-expanded="${full}" aria-controls="${id}">${full?'Compact card':'Full note'}</button></div><div class="visual-card-compact" ${full?'hidden':''}>${renderVisualSummary(spec,key,ui.cueBranches?.[key])}<p class="visual-scope">Summary only; open the full note for scope and conditions.</p></div><div class="visual-card-note" id="${id}" ${full?'':'hidden'}>${lesson.cards[kind]}</div></div>`;
}
