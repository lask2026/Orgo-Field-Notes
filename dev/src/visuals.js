// Presentation only: teaching text remains in the canonical chapter cards.
export function renderVisualCardBody(lesson,kind){
 const text=lesson.cards[kind],labels={rule:['01','Rule'],cue:['02','Recall'],trap:['03','Check'],app:['04','Apply']},[number,label]=labels[kind];
 // Split only explicit paragraph/break boundaries, retaining every qualification.
 const pieces=text.replace(/^<p>|<\/p>$/g,'').split(/<br\s*\/?>(?:\s*)|<\/p>\s*<p>/i).filter(Boolean);
 return `<div class="visual-card-body"><div class="visual-card-strip"><span class="visual-card-number">${number}</span>${label}<button type="button" class="btn" data-act="cardNote" aria-expanded="false">Full note</button></div><div class="visual-card-compact">${pieces.map((p,i)=>`<div class="visual-card-item"><span aria-hidden="true">${i+1}</span><div>${p}</div></div>`).join('')}</div><div class="visual-card-note" hidden>${text}</div></div>`;
}
