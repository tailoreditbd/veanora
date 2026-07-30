Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$imageRoot = Join-Path $projectRoot 'assets\img'
$generatedRoot = 'C:\Users\Hp\.codex\generated_images\019fb1d1-58f3-7fa1-8a32-b038bf86a1db'

function Save-CroppedJpeg {
    param(
        [string]$Source,
        [string]$Target,
        [int]$Width,
        [int]$Height
    )

    $sourceImage = [System.Drawing.Image]::FromFile($Source)
    $sourceRatio = $sourceImage.Width / $sourceImage.Height
    $targetRatio = $Width / $Height

    if ($sourceRatio -gt $targetRatio) {
        $cropHeight = $sourceImage.Height
        $cropWidth = [int]($cropHeight * $targetRatio)
        $cropX = [int](($sourceImage.Width - $cropWidth) / 2)
        $cropY = 0
    } else {
        $cropWidth = $sourceImage.Width
        $cropHeight = [int]($cropWidth / $targetRatio)
        $cropX = 0
        $cropY = [int](($sourceImage.Height - $cropHeight) / 2)
    }

    $output = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($output)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.DrawImage(
        $sourceImage,
        (New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)),
        (New-Object System.Drawing.Rectangle($cropX, $cropY, $cropWidth, $cropHeight)),
        [System.Drawing.GraphicsUnit]::Pixel
    )

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]91
    )
    $output.Save($Target, $codec, $parameters)

    $graphics.Dispose()
    $output.Dispose()
    $sourceImage.Dispose()
}

function Save-TrimmedLogo {
    param([string]$Source, [string]$Target)

    $sourceImage = New-Object System.Drawing.Bitmap($Source)
    $background = $sourceImage.GetPixel(0, 0)
    $minX = $sourceImage.Width
    $minY = $sourceImage.Height
    $maxX = 0
    $maxY = 0

    for ($y = 0; $y -lt $sourceImage.Height; $y += 2) {
        for ($x = 0; $x -lt $sourceImage.Width; $x += 2) {
            $pixel = $sourceImage.GetPixel($x, $y)
            $difference = [Math]::Abs($pixel.R - $background.R) +
                [Math]::Abs($pixel.G - $background.G) +
                [Math]::Abs($pixel.B - $background.B)
            if ($difference -gt 42) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $margin = 34
    $minX = [Math]::Max(0, $minX - $margin)
    $minY = [Math]::Max(0, $minY - $margin)
    $maxX = [Math]::Min($sourceImage.Width - 1, $maxX + $margin)
    $maxY = [Math]::Min($sourceImage.Height - 1, $maxY + $margin)
    $crop = New-Object System.Drawing.Rectangle(
        $minX,
        $minY,
        ($maxX - $minX + 1),
        ($maxY - $minY + 1)
    )

    $output = New-Object System.Drawing.Bitmap($crop.Width, $crop.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($output)
    $graphics.DrawImage(
        $sourceImage,
        (New-Object System.Drawing.Rectangle(0, 0, $crop.Width, $crop.Height)),
        $crop,
        [System.Drawing.GraphicsUnit]::Pixel
    )
    $output.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $output.Dispose()
    $sourceImage.Dispose()
}

Save-TrimmedLogo `
    -Source (Join-Path $imageRoot 'logo\logo.png') `
    -Target (Join-Path $imageRoot 'veanora-logo.png')

Save-CroppedJpeg `
    -Source (Join-Path $generatedRoot 'exec-17c691ee-4fa8-446e-ba60-85d6567855ad.png') `
    -Target (Join-Path $imageRoot 'hero-1.jpg') `
    -Width 1920 -Height 1080

Save-CroppedJpeg `
    -Source (Join-Path $generatedRoot 'exec-18fd6ebc-1665-4e7b-b8a8-ac1dc5f1554c.png') `
    -Target (Join-Path $imageRoot 'hero-2.jpg') `
    -Width 1920 -Height 1080

Save-CroppedJpeg `
    -Source (Join-Path $generatedRoot 'exec-983090d2-2f7f-4e72-be36-75599d4989da.png') `
    -Target (Join-Path $imageRoot 'hero-3.jpg') `
    -Width 1920 -Height 1080

Save-CroppedJpeg `
    -Source (Join-Path $generatedRoot 'exec-f9b5c6eb-a5a9-4fe3-abfc-3d66f7f039b7.png') `
    -Target (Join-Path $imageRoot 'band-saree.jpg') `
    -Width 1200 -Height 1600

Save-CroppedJpeg `
    -Source (Join-Path $generatedRoot 'exec-0a0ed4cc-199b-4396-9dbe-68d6664c5a78.png') `
    -Target (Join-Path $imageRoot 'cat-women.jpg') `
    -Width 1024 -Height 1024

Write-Output 'Installed Veanora logo and five generated campaign assets.'
