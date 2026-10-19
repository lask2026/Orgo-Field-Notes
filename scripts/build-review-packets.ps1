[CmdletBinding()]
param([ValidateRange(0,12)][int]$Chapter=0,[switch]$TextOnly)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
Push-Location -LiteralPath $projectRoot
try {
  $nodeArgs=@('scripts/audit/build-packets.mjs')
  if($Chapter -gt 0){$nodeArgs+=@('--chapter',"$Chapter")}
  if($TextOnly){$nodeArgs+='--text-only'}
  & node @nodeArgs
  if($LASTEXITCODE -ne 0){throw "Review packet build failed (exit $LASTEXITCODE)."}
} finally {Pop-Location}
