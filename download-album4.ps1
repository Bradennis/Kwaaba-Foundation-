$base = "E:\Kwaaba Photos\GAFCCEH Installs New Blood Bank Through CIMIC Relations Album 2 - August 2025"
if (-not (Test-Path $base)) { New-Item -ItemType Directory -Path $base -Force | Out-Null }

$photos = @(
  @{ name = 'thumb.jpeg';   url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.26-PM.jpeg' },
  @{ name = '001.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.29-PM.jpeg' },
  @{ name = '002.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.34-PM.jpeg' },
  @{ name = '003.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.42-PM.jpeg' },
  @{ name = '004.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.40-PM.jpeg' },
  @{ name = '005.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.38-PM.jpeg' },
  @{ name = '006.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.37-PM.jpeg' },
  @{ name = '007.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.36-PM.jpeg' },
  @{ name = '008.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.35-PM.jpeg' },
  @{ name = '009.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.32-PM.jpeg' },
  @{ name = '010.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.31-PM.jpeg' },
  @{ name = '011.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.30-PM.jpeg' },
  @{ name = '012.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.28-PM.jpeg' },
  @{ name = '013.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.27-PM-1.jpeg' },
  @{ name = '014.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.27-PM.jpeg' },
  @{ name = '015.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.26-PM-1.jpeg' },
  @{ name = '016.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.25-PM.jpeg' },
  @{ name = '017.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.24-PM-1.jpeg' },
  @{ name = '018.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.24-PM.jpeg' },
  @{ name = '019.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.23-PM.jpeg' },
  @{ name = '020.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.22-PM-1.jpeg' },
  @{ name = '021.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.22-PM.jpeg' },
  @{ name = '022.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.21-PM.jpeg' },
  @{ name = '023.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.20-PM-1.jpeg' },
  @{ name = '024.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.20-PM.jpeg' },
  @{ name = '025.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.19-PM-1.jpeg' },
  @{ name = '026.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-11.17.19-PM.jpeg' },
  @{ name = '027.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/4f567caa-1129-4a23-af9b-66d5ec99e2bf.jpeg' },
  @{ name = '028.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-8.58.46-AM.jpeg' },
  @{ name = '029.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-8.58.50-AM.jpeg' },
  @{ name = '030.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-8.58.53-AM.jpeg' },
  @{ name = '031.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-8.58.57-AM.jpeg' },
  @{ name = '032.jpeg';     url = 'https://kwaabafoundation.org/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-8.59.11-AM.jpeg' }
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