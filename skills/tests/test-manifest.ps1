#requires -Version 5
$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot '../skills/apk-reverse/scripts/manifest-summary.ps1'
$temp = Join-Path ([IO.Path]::GetTempPath()) ('android-skills-test-' + [guid]::NewGuid().ToString('N') + '.xml')

function Assert-Line($Lines, [string]$Expected) {
    if ($Lines -notcontains $Expected) { throw "Missing output: $Expected" }
}

try {
    @'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.fixture">
  <uses-permission android:name="android.permission.INTERNET"/>
  <application>
    <activity android:name=".Main" android:exported="false"/>
    <activity-alias android:name=".Launcher" android:targetActivity=".Main" android:exported="true">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity-alias>
    <service android:name=".Sync"/>
  </application>
</manifest>
'@ | Set-Content -LiteralPath $temp -Encoding UTF8
    $lines = @(& $script -ManifestPath $temp)
    Assert-Line $lines 'package=com.example.fixture'
    Assert-Line $lines 'permission_count=1'
    Assert-Line $lines 'permission=android.permission.INTERNET'
    Assert-Line $lines 'activity_count=1'
    Assert-Line $lines 'activity_alias_count=1'
    Assert-Line $lines 'main_activity=.Launcher'
    Assert-Line $lines 'service_count=1'
    Assert-Line $lines 'receiver_count=0'
    Assert-Line $lines "service=.Sync`t`t"

    '<manifest package="empty"><application/></manifest>' | Set-Content -LiteralPath $temp -Encoding UTF8
    $lines = @(& $script -ManifestPath $temp)
    Assert-Line $lines 'permission_count=0'
    Assert-Line $lines 'activity_count=0'

    @'
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="direct">
  <application><activity android:name=".Home"><intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter></activity></application>
</manifest>
'@ | Set-Content -LiteralPath $temp -Encoding UTF8
    $lines = @(& $script -ManifestPath $temp)
    Assert-Line $lines 'main_activity=.Home'
    Assert-Line $lines 'activity_alias_count=0'

    '<!DOCTYPE manifest [<!ENTITY sample "value">]><manifest package="bad"/>' | Set-Content -LiteralPath $temp -Encoding UTF8
    $rejected = $false
    try { & $script -ManifestPath $temp | Out-Null } catch { $rejected = $true }
    if (-not $rejected) { throw 'DTD input was not rejected' }

    '<not-a-manifest/>' | Set-Content -LiteralPath $temp -Encoding UTF8
    $rejected = $false
    try { & $script -ManifestPath $temp | Out-Null } catch { $rejected = $true }
    if (-not $rejected) { throw 'Invalid root was not rejected' }
    Write-Output 'PASS: manifest fields, launcher alias, empty components, DTD and invalid root.'
}
finally {
    # Delete only the exact temporary file created above; never recurse.
    if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp }
}
