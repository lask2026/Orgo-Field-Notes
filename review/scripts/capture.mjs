import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {chromium} from '../../testing/tests/playwright-runtime.mjs';import {root,readJSON,hash} from './cases.mjs';
process.chdir(root);const args=process.argv.slice(2),i=args.indexOf('--chapter'),only=i<0?null:Number(args[i+1]);
const chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>readJSON('dev/chapters/'+f)).filter(c=>only===null||c.id===only);
const executablePath=[chromium.executablePath(),'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
try{for(const ch of chapters){
 const dir=`review/packets/chapter-${String(ch.id).padStart(2,'0')}`;fs.mkdirSync(`${dir}/screenshots`,{recursive:true});const packet=readJSON(`${dir}/cases.json`),evidence={chapter:ch.id,sourceSnapshot:packet.sourceSnapshot,captureStatus:'running',screenshots:[],interactions:[],pageErrors:[],note:'Actual local Chromium UI captures. Successful encoded answers test software behavior, not independent chemistry.'};
 const context=await browser.newContext({viewport:{width:1360,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',offline:true});const page=await context.newPage();page.on('pageerror',e=>evidence.pageErrors.push(e.message));
 const save=()=>fs.writeFileSync(`${dir}/evidence.json`,JSON.stringify(evidence,null,2)+'\n');
 async function shot(id,kind,locator){const file=`screenshots/${id.replace(/[^a-zA-Z0-9_-]/g,'_')}.png`;await locator.screenshot({path:`${dir}/${file}`,animations:'disabled'});const size=await locator.boundingBox();evidence.screenshots.push({id,kind,file,sha256:hash(fs.readFileSync(`${dir}/${file}`)),width:Math.round(size.width),height:Math.round(size.height)});}
 try{
 await page.goto(pathToFileURL(path.resolve('Orgo-Field-Notes-offline.html')).href);await page.selectOption('#chSel',String(ch.id));
 for(let li=0;li<ch.lessons.length;li++){
  const l=ch.lessons[li];await page.locator('[data-mode="learn"]').click();await page.locator(`[data-act="lesson"][data-idx="${li}"]`).click();
  for(let si=0;si<l.steps.length;si++){
   const step=l.steps[si],id=`${l.id}-step-${si+1}`;await page.locator(`[data-act="step"][data-idx="${si}"]`).click();await shot(id,'learn-molecule',page.locator('.stage'));if(await page.locator('.diagram').count())await shot(id+'-diagram','learn-diagram',page.locator('.diagram'));
   if(step.challenge){await page.locator('[data-act="try"]').click();for(const a of step.challenge.answer)await page.locator(`.atom-key[data-idx="${a}"]`).click();await page.locator('[data-act="checkTry"]').click();assert.equal(await page.locator('.fbox.ok').count(),1);await shot(id+'-challenge','learn-challenge',page.locator('.grid2 > .card'));evidence.interactions.push({id,result:'encoded challenge accepted'});await page.locator('[data-act="try"]').click();}
  }
 }
 await page.locator('[data-mode="guided"]').click();
 for(const ex of ch.exercises){const li=ch.lessons.findIndex(l=>l.id===ex.lesson),ei=ch.exercises.filter(e=>e.lesson===ex.lesson).indexOf(ex);
  await page.locator(`[data-act="lesson"][data-idx="${li}"]`).click();await page.locator(`[data-act="exercise"][data-idx="${ei}"]`).click();assert.equal(await page.locator('.final-merged').count(),0);
  for(let si=0;si<ex.stages.length;si++){
   const s=ex.stages[si],id=`${ex.id}-stage-${si+1}`;await shot(id+'-molecule','practice-molecule',page.locator('.stage'));await shot(id+'-question','practice-question',page.locator('.scard'));
   if(si===0&&await page.locator('.diagram').count())await shot(ex.id+'-diagram','practice-diagram',page.locator('.diagram'));
   if(s.type==='choice'){await page.locator(`[data-act="choice"][data-idx="${s.answer===0?1:0}"]`).click();assert.equal(await page.locator('[data-act="continue"]').count(),0);await page.locator(`[data-act="choice"][data-idx="${s.answer}"]`).click();}
   else if(s.type==='atoms'){await page.locator('[data-act="checkAnswer"]').click();assert.equal(await page.locator('[data-act="continue"]').count(),0);for(const a of s.answer){await page.locator(`.atom-key[data-idx="${a}"]`).focus();await page.keyboard.press('Enter');}await page.locator('[data-act="checkAnswer"]').click();}
   else{await page.locator('#answer').fill('invalid answer');await page.locator('#answer').press('Enter');assert.equal(await page.locator('[data-act="continue"]').count(),0);await page.locator('#answer').fill(s.type==='text'?s.accepted[0]:String(s.answer));await page.locator('#answer').press('Enter');}
   assert.equal(await page.locator('.fbox.ok').count(),1);await shot(id+'-feedback','practice-feedback',page.locator('.scard'));await page.locator('[data-act="continue"]').click();evidence.interactions.push({id,result:'incorrect rejected; encoded key accepted; continued'});
  }
  assert.equal(await page.locator('.c-tag').innerText(),'Solved independently');await shot(ex.id+'-complete','practice-complete',page.locator('.grid2'));
 }
 await page.locator('[data-mode="learn"]').click();await page.locator('[data-act="lesson"][data-idx="0"]').click();await shot('layout-desktop-light','layout',page.locator('body'));await page.setViewportSize({width:375,height:812});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await shot('layout-mobile-light','layout',page.locator('body'));await page.locator('#themeBtn').click();await shot('layout-mobile-dark','layout',page.locator('body'));
 assert.deepEqual(evidence.pageErrors,[]);evidence.captureStatus='passed';save();console.log(`Captured chapter ${ch.id}: ${evidence.screenshots.length} images; ${evidence.interactions.length} checked interactions.`);
 }catch(e){evidence.captureStatus='failed';evidence.error=e.stack;save();throw e;}finally{await context.close();}
}}finally{await browser.close();}
