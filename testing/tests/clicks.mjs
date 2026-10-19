import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {chromium} from './playwright-runtime.mjs';
const chapters=Array.from({length:12},(_,i)=>JSON.parse(fs.readFileSync(`dev/chapters/chapter-${String(i+1).padStart(2,'0')}.json`)));
const report={startedAt:new Date().toISOString(),status:'running',clicks:0,lessons:0,cardToggles:0,branches:0,viewerChecks:0,practiceStages:0,hints:0,wrongChoices:0,errors:[],scenarios:[]};
const executablePath=[chromium.executablePath(),'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
let browser;
try{
 browser=await chromium.launch({headless:true,executablePath});
 const click=async locator=>{await locator.click();report.clicks++;};
 for(const scenario of [{width:1440,theme:'light'},{width:375,theme:'dark'}]){
  const ctx=await browser.newContext({offline:true,viewport:{width:scenario.width,height:1000}}),page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('Orgo-Field-Notes-offline.html')).href);
  if(scenario.theme==='dark')await click(page.locator('#themeBtn'));
  for(const ch of chapters){
   await page.selectOption('#chSel',String(ch.id));await click(page.locator('[data-mode="learn"]'));
   for(let li=0;li<ch.lessons.length;li++){
    const lesson=ch.lessons[li];await click(page.locator(`[data-act="lesson"][data-idx="${li}"]`));
    await click(page.locator('[data-act="expandCards"]'));await click(page.locator('[data-act="expandCards"]'));
    for(const kind of ['rule','cue','trap','app']){
     const key=`${ch.id}:${lesson.id}:${kind}`,card=page.locator(`details[data-section="${key}"]`),toggle=card.locator('[data-act="cardNote"]');
     assert.equal(await card.evaluate(e=>e.open),true);
     assert.equal(await toggle.getAttribute('aria-expanded'),'false');
     await click(toggle);assert.equal(await card.locator('.visual-card-note').isVisible(),true);assert.equal(await card.locator('.visual-card-compact').isVisible(),true);
     const expected=await page.evaluate(html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent;},lesson.cards[kind]);
     assert.equal(await card.locator('.visual-card-note').textContent(),expected,`${key}: canonical full note`);
     await click(toggle);assert.equal(await card.locator('.visual-card-note').isVisible(),false);
     await click(card.locator(':scope > summary'));assert.equal(await card.evaluate(e=>e.open),false);
     await click(card.locator(':scope > summary'));assert.equal(await card.evaluate(e=>e.open),true);report.cardToggles+=4;
    }
    for(let bi=0;bi<lesson.visualCards.cue.items.length;bi++){
     const branch=page.locator(`[data-act="cueBranch"][data-idx="${bi}"]`);await click(branch);
     assert.equal(await branch.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.vtree-outcome-text').textContent(),lesson.visualCards.cue.items[bi].text);report.branches++;
    }
    const source=page.locator('.tstack > details.drw');await click(source.locator(':scope > summary'));assert.ok((await source.innerText()).includes(ch.review.note));await click(source.locator(':scope > summary'));
    await click(page.locator('[data-act="stageView"]'));const inline=page.locator('#inlineProjectionViewport');assert.equal(await inline.locator('svg').count(),1);
    const before=await inline.innerHTML();await page.locator('[data-projection="yaw"]').fill('90');await page.locator('[data-projection="yaw"]').dispatchEvent('input');assert.notEqual(await inline.innerHTML(),before);
    await page.locator('[data-projection="pitch"]').fill('-40');await page.locator('[data-projection="pitch"]').dispatchEvent('input');
    await click(page.locator('[data-act="open3d"]'));assert.equal(await page.locator('#projectionViewport svg').count(),1);
    await page.locator('#projectionYaw').fill('-90');await page.locator('#projectionYaw').dispatchEvent('input');await page.locator('#projectionPitch').fill('40');await page.locator('#projectionPitch').dispatchEvent('input');
    await click(page.locator('#projectionStyle'));assert.equal(await page.locator('#projectionStyle').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#projectionViewport line').count(),0);
    await click(page.locator('#projectionReset'));assert.equal(await page.locator('#projectionYaw').inputValue(),'35');assert.equal(await page.locator('#projectionPitch').inputValue(),'20');
    await click(page.locator('#close3d'));await page.locator('#viewer3dDialog').waitFor({state:'detached'});assert.equal(await page.locator('#viewer3dDialog').count(),0);
    await click(page.locator('[data-act="stageView"]'));assert.equal(await page.locator('.stage .mol').count(),1);report.viewerChecks++;
    await click(page.locator('[data-act="next"]'));assert.equal(await page.locator('[data-act="step"][aria-pressed="true"]').getAttribute('data-idx'),'1');
    await click(page.locator('[data-act="prev"]'));assert.equal(await page.locator('[data-act="step"][aria-pressed="true"]').getAttribute('data-idx'),'0');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${ch.id}:${lesson.id} overflow`);report.lessons++;
   }
   console.log(`PASS clicks chapter ${ch.id}: ${scenario.width}px ${scenario.theme}`);
  }
  report.scenarios.push(scenario);await ctx.close();
 }
 // Separate offline state: every hint, every wrong choice, every assisted stage and completion navigation.
 const ctx=await browser.newContext({offline:true}),page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));await page.goto(pathToFileURL(path.resolve('Orgo-Field-Notes-offline.html')).href);
 for(const ch of chapters){
  await page.selectOption('#chSel',String(ch.id));await click(page.locator('[data-mode="guided"]'));
  for(const ex of ch.exercises){
   await page.selectOption('#chSel',String(ch.id));
   const li=ch.lessons.findIndex(l=>l.id===ex.lesson),ei=ch.exercises.filter(e=>e.lesson===ex.lesson).indexOf(ex);
   await click(page.locator(`[data-act="lesson"][data-idx="${li}"]`));await click(page.locator(`[data-act="exercise"][data-idx="${ei}"]`));
   for(const s of ex.stages){
    assert.equal(await page.locator('[data-act="open3d"]').count(),0);
    for(const hint of s.hints){await click(page.locator('[data-act="hint"]'));assert.ok((await page.locator('[aria-label="Workshop stages"]').innerText()).includes(hint));report.hints++;}
    assert.equal(await page.locator('[data-act="hint"]').isDisabled(),true);
    if(s.type==='choice'){
     for(let i=0;i<s.options.length;i++)if(i!==s.answer){await click(page.locator(`[data-act="choice"][data-idx="${i}"]`));assert.equal(await page.locator('.fbox.err').count(),1);assert.equal(await page.locator('[data-act="continue"]').count(),0);report.wrongChoices++;}
     await click(page.locator(`[data-act="choice"][data-idx="${s.answer}"]`));
    }else if(s.type==='atoms'){
     for(const i of s.answer)await click(page.locator(`.atom-key[data-idx="${i}"]`));await click(page.locator('[data-act="checkAnswer"]'));
    }else{await page.locator('#answer').fill(s.type==='text'?s.accepted[0]:String(s.answer));await click(page.locator('#answerForm button'));}
    assert.equal(await page.locator('.fbox.ok').count(),1,`${ch.id}:${ex.id}`);await click(page.locator('[data-act="continue"]'));report.practiceStages++;
   }
   assert.equal(await page.locator('.c-tag').innerText(),'Studied with support');
   await click(page.locator('[data-act="replay"]'));await click(page.locator('[data-act="revealSolution"]'));assert.equal(await page.locator('.scard').count(),ex.stages.length);assert.equal(await page.locator('.c-tag').innerText(),'Studied with support');
   await click(page.locator('[data-act="nextExercise"]'));assert.equal(await page.locator('h1').count(),1);
   const labs=ch.exercises.filter(e=>e.lesson===ex.lesson),nextLesson=ei+1<labs.length?li:(li+1)%ch.lessons.length,nextChapter=ei+1===labs.length&&li+1===ch.lessons.length?(ch.id%12)+1:ch.id;
   assert.equal(await page.locator('#chSel').inputValue(),String(nextChapter));
   assert.equal(await page.locator('[data-act="lesson"][aria-pressed="true"]').getAttribute('data-idx'),String(nextLesson));
   assert.equal(await page.locator('[data-act="exercise"][aria-pressed="true"]').getAttribute('data-idx'),String(ei+1<labs.length?ei+1:0));
  }
  console.log(`PASS hints/options chapter ${ch.id}`);
 }
 // Dispatch print in the isolated test page; never open a system print dialog.
 await page.evaluate(()=>{window.print=()=>{window.__printed=true;};});await click(page.locator('[data-act="print"]'));assert.equal(await page.evaluate(()=>window.__printed),true);
 await click(page.locator('#animBtn'));await click(page.locator('#animBtn'));
 const chooser=page.waitForEvent('filechooser');await click(page.locator('[data-act="importProgress"]'));await chooser;
 assert.deepEqual(report.errors,[]);report.status='passed';
}catch(e){report.status='failed';report.errors.push(e.stack);throw e;}
finally{report.finishedAt=new Date().toISOString();fs.mkdirSync('testing/artifacts',{recursive:true});fs.writeFileSync('testing/artifacts/clicks.json',JSON.stringify(report,null,2)+'\n');await browser?.close();console.log(JSON.stringify(report));}

