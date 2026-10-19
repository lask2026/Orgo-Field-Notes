param(
  [string]$Chapter = '1',
  [string]$Config = 'review/config/panel.local.json',
  [ValidateSet('all','blind','audit','challenge')][string]$Phase = 'all',
  [ValidateRange(1,10000)][int]$MaxRequests = 1,
  [switch]$Execute,
  [switch]$Resume
)
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  $reviewArgs = @('review/scripts/review-panel.mjs','--config',$Config,'--chapter',$Chapter,'--phase',$Phase,'--max-requests',"$MaxRequests")
  if ($Execute) { $reviewArgs += '--execute' }
  if ($Resume) { $reviewArgs += '--resume' }
  & node @reviewArgs
  $reviewExit = $LASTEXITCODE
} finally { Pop-Location }
exit $reviewExit
