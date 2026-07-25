$en = Get-Content "messages\en.json" -Raw | ConvertFrom-Json
$pages = $en.pages
$allProps = $pages | Get-Member -MemberType NoteProperty
$names = $allProps.Name
for ($c = 0; $c -lt 4; $c++) {
  $start = $c * 35
  $end = [Math]::Min($start + 34, $names.Count - 1)
  $chunkNames = $names[$start..$end]
  $chunkObj = @{}
  foreach ($n in $chunkNames) {
    $chunkObj[$n] = $pages.$n
  }
  $json = $chunkObj | ConvertTo-Json -Depth 10
  $path = "chunk${c}.json"
  Set-Content -Path $path -Value $json
  Write-Host ("Chunk {0}: {1} pages -> {2}" -f $c, $chunkNames.Count, $path)
}
