$base = "E:\Kwaaba Photos\Holy Child School @ 80 Blood Donation Frames - March 2026"
if (-not (Test-Path $base)) { New-Item -ItemType Directory -Path $base -Force | Out-Null }

$photos = @(
  @{ name = "thumb.png";       url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/demure.png" },
  @{ name = "01.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/Action.png" },
  @{ name = "02.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-4.png" },
  @{ name = "03.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-5.png" },
  @{ name = "04.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-6.png" },
  @{ name = "05.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-6b.png" },
  @{ name = "06.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-7.png" },
  @{ name = "07.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-33.png" },
  @{ name = "08.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-34.png" },
  @{ name = "09.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-35.png" },
  @{ name = "10.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-551.png" },
  @{ name = "11.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-552.png" },
  @{ name = "12.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-554.png" },
  @{ name = "13.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart2.png" },
  @{ name = "14.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart3.png" },
  @{ name = "15.png";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart4.png" },
  @{ name = "16.jpg";          url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__0287-1-scaled.jpg" },
  @{ name = "17.jpeg";         url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__9848-1.jpg-scaled.jpeg" },
  @{ name = "18.jpeg";         url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__9905.jpg-scaled.jpeg" },
  @{ name = "19.jpeg";         url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/WhatsApp-Image-202.jpeg" },
  @{ name = "20.jpeg";         url = "https://kwaabafoundation.org/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-14-at-12.22.35-PM.jpeg" }
)

foreach ($p in $photos) {
  $out = Join-Path $base $p.name
  Write-Host "`nDownloading $($p.name)..."
  try {
    Invoke-WebRequest -Uri $p.url -OutFile $out -Headers @{"User-Agent"="Mozilla/5.0"}
    $size = (Get-Item $out).Length
    Write-Host "  OK ($size bytes)"
  } catch {
    Write-Host "  FAILED: $($_.Exception.Message)"
  }
}

Write-Host "`nAll done! Files saved to: $base"
Write-Host "Total files: $((Get-ChildItem $base).Count)"