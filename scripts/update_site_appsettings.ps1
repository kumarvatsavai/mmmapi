param(
    [Parameter(Mandatory = $True)]
    [string]
    $rgName,

    [Parameter(Mandatory = $True)]
    [string]
    $appName,

    [Parameter(Mandatory = $True)]
    [string[]]
    $settingNames,

    [Parameter(Mandatory = $True)]
    [string[]]
    $settingValues,

    [Parameter(Mandatory = $False)]
    [string]
    $slotName = $null,

    [Parameter(Mandatory = $False)]
    [bool]
    $singleExecution = $False
)


#******************************************************************************
# Script body
# Execution begins here
#******************************************************************************
$ErrorActionPreference = "Stop"

# sign in
if ($singleExecution) {
    Write-Host "Logging in...";
    Connect-AzAccount;
} 

$webApp = Get-AzWebApp -ResourceGroupName $rgName -Name $appName
$appSettingList = $webApp.SiteConfig.AppSettings

$hash = @{ }
ForEach ($kvp in $appSettingList) {
    Write-Output 'Setting value.. $kvp.Value' + $kvp.Value;
    $hash[$kvp.Name] = $kvp.Value
}

$i = 0
ForEach ($settingName in $settingNames) {
    Write-Output 'New Setting value.. settingName: ' + $settingName + ' settingValue: ' + $settingValues[$i];
    $hash[$settingName] = $settingValues[$i]
    $i++
}

if ($slotName) {
    Set-AzWebAppSlot -ResourceGroupName $rgName -Name $appName -Slot $slotName -AppSettings $hash -Use32BitWorkerProcess $true
}
else {
    Set-AzWebApp -ResourceGroupName $rgName -Name $appName -AppSettings $hash -Use32BitWorkerProcess $true
}