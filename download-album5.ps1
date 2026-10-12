$folder = 'E:\Kwaaba Photos\Free Health Screening and Community Engagement - January 2025'
New-Item -ItemType Directory -Path $folder -Force | Out-Null

$base = 'https://kwaabafoundation.org/wp-content/uploads/2025/08/'
$names = @(
    'LY__4705-scaled.jpg','LY__4287-scaled.jpg','LY__4543-scaled.jpg',
    'LY__4511-scaled.jpg','LY__4506-scaled.jpg','LY__4455-scaled.jpg',
    'LY__4450-scaled.jpg','LY__4622-scaled-e1756124416271.jpg',
    'LY__4717-scaled.jpg','LY__4446-scaled.jpg','LY__4448-scaled-e1755511656307.jpg',
    'LY__4436-scaled.jpg','LY__4417-scaled.jpg','LY__4408-scaled.jpg',
    'LY__4402-scaled-e1756462411993.jpg','LY__4404-scaled.jpg','LY__4406-scaled.jpg',
    'LY__4389-scaled.jpg','LY__4453-scaled.jpg','LY__4370-scaled.jpg',
    'LY__4364-scaled.jpg','LY__4349-scaled.jpg','LY__4350-scaled.jpg',
    'LY__4348-scaled.jpg','LY__4347-scaled.jpg','LY__4345-scaled.jpg',
    'LY__4343-scaled.jpg','LY__4418-scaled.jpg','LY__4344-scaled-e1754747390514.jpg',
    'LY__4341-scaled.jpg','LY__4339-scaled.jpg','LY__4314-scaled.jpg',
    'LY__4241-scaled.jpg','LY__4301-scaled.jpg','LY__4289-scaled.jpg',
    'LY__4288-scaled.jpg','LY__4254-scaled.jpg','LY__4252-scaled.jpg',
    'LY__4243-scaled.jpg','LY__4310-scaled.jpg','LY__4242-scaled.jpg','11.jpg'
)

Write-Host "Downloading $($names.Count) photos to $folder`n"

$success = 0
$fail = 0
$i = 1
foreach($n in $names) {
    $url = $base + $n
    $dest = Join-Path $folder $n
    Write-Host "[$i/$($names.Count)] Downloading $n..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -TimeoutSec 30
        $size = (Get-Item $dest).Length
        if($size -gt 5000) {
            Write-Host "  OK ($([math]::Round($size/1KB,1)) KB)"
            $success++
        } else {
            Write-Host "  WARNING: suspicious size ($size bytes)"
            Remove-Item $dest -ErrorAction SilentlyContinue
            $fail++
        }
    } catch {
        Write-Host "  FAILED: $_"
        Remove-Item $dest -ErrorAction SilentlyContinue
        $fail++
    }
    $i++
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================"
Write-Host "Completed! Success: $success, Failed: $fail"