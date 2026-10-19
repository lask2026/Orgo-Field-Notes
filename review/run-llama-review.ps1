[CmdletBinding()]
param(
 [ValidateRange(1,12)][int]$Chapter=2,
 [string]$Model='llama3.1:8b',
 [ValidateSet('all','blind','audit')][string]$Mode='all',
 [ValidateRange(0,10000)][int]$Limit=0,
 [ValidateRange(2048,131072)][int]$Context=8192,
 [ValidateRange(256,16384)][int]$MaxOutput=2048,
 [ValidateRange(1,3600)][int]$TimeoutSeconds=300,
 [switch]$Resume,
 [switch]$DryRun
)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
Push-Location -LiteralPath $projectRoot
try {
 $nodeArgs=@('review/scripts/run-llama.mjs','--chapter',"$Chapter",'--model',$Model,'--mode',$Mode,'--limit',"$Limit",'--context',"$Context",'--max-output',"$MaxOutput",'--timeout',"$TimeoutSeconds")
 if($Resume){$nodeArgs+='--resume'}
 if($DryRun){$nodeArgs+='--dry-run'}
 & node @nodeArgs
 if($LASTEXITCODE -ne 0){throw "Review incomplete or failed (exit $LASTEXITCODE). Saved results are preserved; inspect them before retrying with -Resume."}
} finally {Pop-Location}
