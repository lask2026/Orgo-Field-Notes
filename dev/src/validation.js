export function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').trim().toLowerCase()
    .replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ')
    .replace(/\s*([,()-])\s*/g,'$1');
}
export function validateAnswer(stage, value) {
  if(stage.type==='text') return typeof value==='string' && stage.accepted.some(a=>normalizeText(a)===normalizeText(value));
  if(stage.type==='choice') return Number.isInteger(value) && value===stage.answer;
  if(stage.type==='atoms') return Array.isArray(value) && new Set(value).size===value.length && value.length===stage.answer.length && value.every(x=>Number.isInteger(x)&&stage.answer.includes(x));
  if(stage.type==='number') {
    if(typeof value!=='string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return false;
    const n=Number(value); return Number.isFinite(n) && Math.abs(n-stage.answer)<=stage.tolerance;
  }
  return false;
}
export function atomLabel(i){return String.fromCharCode(65+i);}
export function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
