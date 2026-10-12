$base = "E:\Kwaaba Photos\GAFCCEH Installs New Blood Bank Through CIMIC Relations - August 2025"
if (-not (Test-Path $base)) { New-Item -ItemType Directory -Path $base -Force | Out-Null }

$photos = @(
  @{ name = '001.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.08-PM.jpeg' },
  @{ name = '002.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.07-PM-2.jpeg' },
  @{ name = '003.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.07-PM-1.jpeg' },
  @{ name = '004.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.07-PM.jpeg' },
  @{ name = '005.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.06-PM-1.jpeg' },
  @{ name = '006.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.06-PM.jpeg' },
  @{ name = '007.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.05-PM.jpeg' },
  @{ name = '008.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.04-PM.jpeg' },
  @{ name = '009.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.03-PM.jpeg' },
  @{ name = '010.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.48.01-PM.jpeg' },
  @{ name = '011.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.59-PM-1.jpeg' },
  @{ name = '012.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.59-PM.jpeg' },
  @{ name = '013.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.58-PM.jpeg' },
  @{ name = '014.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.57-PM-1.jpeg' },
  @{ name = '015.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.57-PM.jpeg' },
  @{ name = '016.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.56-PM.jpeg' },
  @{ name = '017.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.55-PM-1.jpeg' },
  @{ name = '018.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.55-PM.jpeg' },
  @{ name = '019.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.54-PM.jpeg' },
  @{ name = '020.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.53-PM.jpeg' },
  @{ name = '021.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.52-PM-1.jpeg' },
  @{ name = '022.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.52-PM.jpeg' },
  @{ name = '023.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.51-PM.jpeg' },
  @{ name = '024.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.42-PM-1.jpeg' },
  @{ name = '025.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.50-PM.jpeg' },
  @{ name = '026.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.49-PM-1.jpeg' },
  @{ name = '027.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.49-PM.jpeg' },
  @{ name = '028.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.48-PM-1.jpeg' },
  @{ name = '029.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.48-PM.jpeg' },
  @{ name = '030.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.47-PM-1.jpeg' },
  @{ name = '031.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.47-PM.jpeg' },
  @{ name = '032.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.46-PM-1.jpeg' },
  @{ name = '033.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.46-PM.jpeg' },
  @{ name = '034.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.45-PM-1.jpeg' },
  @{ name = '035.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.45-PM.jpeg' },
  @{ name = '036.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.43-PM.jpeg' },
  @{ name = '037.jpeg';  url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-01-at-2.47.42-PM.jpeg' }
)

Write-Host "Downloading $($photos.Count) photos to $base"
foreach ($p in $photos) {
  $out = Join-Path $base $p.name
  Write-Host "`nDownloading $($p.name)..."
  try {
    Invoke-WebRequest -Uri $p.url -OutFile $out -Headers @{'User-Agent'='Mozilla/5.0'}
    Write-Host "  OK ($((Get-Item $out).Length) bytes)"
  } catch {
    Write-Host "  FAILED: $($_.Exception.Message)"
  }
}
Write-Host "`nAll done! Total: $((Get-ChildItem $base).Count) files"