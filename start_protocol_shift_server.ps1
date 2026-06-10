$ErrorActionPreference = "SilentlyContinue"

$GameDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 8124
$LogFile = Join-Path $GameDir "protocol_shift_server.log"

function Write-ServerLog($Message) {
  $Stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $LogFile -Value "[$Stamp] $Message"
}

function Get-ContentType($Path) {
  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8"; break }
    ".css" { "text/css; charset=utf-8"; break }
    ".js" { "text/javascript; charset=utf-8"; break }
    ".png" { "image/png"; break }
    ".jpg" { "image/jpeg"; break }
    ".jpeg" { "image/jpeg"; break }
    ".svg" { "image/svg+xml"; break }
    default { "application/octet-stream" }
  }
}

function Send-Response($Stream, $Status, $ContentType, [byte[]]$Body) {
  $Reason = if ($Status -eq 200) { "OK" } elseif ($Status -eq 403) { "Forbidden" } else { "Not Found" }
  $Header = "HTTP/1.1 $Status $Reason`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
  $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if ($Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

try {
  $Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $Port)
  $Listener.Start()
  Write-ServerLog "Started server on http://127.0.0.1:$Port/"
} catch {
  Write-ServerLog "Could not start server on port $Port. $($_.Exception.Message)"
  exit 1
}

while ($true) {
  $Client = $null
  try {
    $Client = $Listener.AcceptTcpClient()
    $Stream = $Client.GetStream()
    $Reader = [System.IO.StreamReader]::new($Stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $RequestLine = $Reader.ReadLine()

    while ($Reader.Peek() -ge 0) {
      $Line = $Reader.ReadLine()
      if ([string]::IsNullOrEmpty($Line)) { break }
    }

    if ([string]::IsNullOrWhiteSpace($RequestLine)) {
      $Client.Close()
      continue
    }

    $Parts = $RequestLine.Split(" ")
    $UrlPath = if ($Parts.Length -ge 2) { $Parts[1] } else { "/" }
    $UrlPath = $UrlPath.Split("?")[0]
    if ($UrlPath -eq "/") { $UrlPath = "/index.html" }
    $UrlPath = [System.Uri]::UnescapeDataString($UrlPath).TrimStart("/")
    $LocalPath = [System.IO.Path]::GetFullPath((Join-Path $GameDir $UrlPath))
    $RootPath = [System.IO.Path]::GetFullPath($GameDir)

    if (-not $LocalPath.StartsWith($RootPath)) {
      Send-Response $Stream 403 "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Forbidden"))
    } elseif (-not [System.IO.File]::Exists($LocalPath)) {
      Send-Response $Stream 404 "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Not found"))
    } else {
      $Bytes = [System.IO.File]::ReadAllBytes($LocalPath)
      Send-Response $Stream 200 (Get-ContentType $LocalPath) $Bytes
    }
  } catch {
    Write-ServerLog "Request error. $($_.Exception.Message)"
  } finally {
    if ($Client) { $Client.Close() }
  }
}
