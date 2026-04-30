# fix-paths.ps1
# Run from: C:\Users\thobe\Downloads\Fak-ugesi
# Usage:    .\fix-paths.ps1

$publicDir = "frontend\public"
$sigPages = @(
    "sig-awards.html",
    "sig-dalakhona.html",
    "sig-fakugesipro.html",
    "sig-immersive.html",
    "sig-jamz.html",
    "sig-pitchathon.html"
)

foreach ($page in $sigPages) {
    $filePath = Join-Path $publicDir $page
    if (-not (Test-Path $filePath)) {
        Write-Host "SKIP (not found): $filePath" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # 1. Fix ../css/styles.css → styles.css
    $content = $content -replace '\.\./css/styles\.css', 'styles.css'

    # 2. Fix ../css/ any other css references
    $content = $content -replace '\.\./css/', ''

    # 3. Remove broken <script src="style.css"></script> line
    $content = $content -replace '<script src="style\.css"></script>\s*\n?', ''
    $content = $content -replace '<script src=''style\.css''></script>\s*\n?', ''

    # 4. Remove 404ing script tags for files that don't exist
    $content = $content -replace '<script src="fakugesi-cross-patch\.js"></script>\s*\n?', ''
    $content = $content -replace '<script src="fak-ugesi-global-effects-v10\.js"></script>\s*\n?', ''
    $content = $content -replace '<script src="starArrows\.js"></script>\s*\n?', ''

    # 5. Fix ../images/ references → /images/
    $content = $content -replace '"\.\./images/', '"/images/'
    $content = $content -replace "'\.\.\/images\/", "'/images/"

    # 6. Fix ../fonts/ references → /fonts/
    $content = $content -replace '"\.\./fonts/', '"/fonts/'
    $content = $content -replace "url\('\.\./fonts/", "url('/fonts/"
    $content = $content -replace 'url\("\.\./fonts/', 'url("/fonts/'
    $content = $content -replace "url\(\.\./fonts/", "url(/fonts/"

    Set-Content $filePath $content -Encoding UTF8 -NoNewline
    Write-Host "FIXED: $page" -ForegroundColor Green
}

Write-Host "`nDone. Restart your server and reload the pages." -ForegroundColor Cyan