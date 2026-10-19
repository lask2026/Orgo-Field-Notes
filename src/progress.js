export const STORAGE_KEY='orgo-field-notes-v1';
export const freshState=()=>({version:1,chapter:1,mode:'learn',lesson:0,step:0,exercise:0,theme:'light',animations:true,practice:{}});
export function cleanState(raw,chapters){
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
export function readProgress(storage,chapters){
  try{return {state:cleanState(JSON.parse(storage.getItem(STORAGE_KEY)),chapters),error:false};}
  catch{return {state:freshState(),error:true};}
}
export function writeProgress(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function getProgress(state,chapter,exercise){const key=`${chapter.id}:${exercise.id}`;return state.practice[key]??=( {stage:0,assisted:false,solved:false,hints:0});}
