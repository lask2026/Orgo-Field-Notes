// Compatibility entrypoint. No keyed answers are synthesized into review output.
import {runPanel} from './review-panel.mjs';
runPanel(process.argv.slice(2)).then(result => {
  console.log(JSON.stringify(result.summary ? {out:result.out,status:result.summary.status,requests:result.summary.inferenceRequestsThisInvocation} : result.plan,null,2));
  if(result.summary?.status==='partial')process.exitCode=2;
}).catch(error => {console.error(error.message);process.exitCode=1;});
