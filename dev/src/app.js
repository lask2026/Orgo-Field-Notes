import {escapeHTML as esc,validateAnswer} from './validation.js';
import {readProgress,writeProgress,getProgress,freshState} from './progress.js';
import {applyPreferences} from './animations.js';
import {renderLearn} from './learn.js';
import {renderPractice} from './practice.js';
export function startApp(data){
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
    document.getElementById('view').innerHTML=`<p class="chapter-intro">Chapter ${ch.id} · ${esc(ch.title)} — ${esc(ch.description)}</p><nav class="cnav" aria-label="Concepts">${ch.lessons.map((l,i)=>`<button class="cbtn" data-act="lesson" data-idx="${i}" aria-pressed="${i===state.lesson}"><span>Lesson ${i+1}</span>${esc(l.label)}</button>`).join('')}</nav>`+(state.mode==='learn'?renderLearn(ch,molecules,state,ui):renderPractice(ch,molecules,state,ui));
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
