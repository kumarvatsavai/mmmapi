<#############################################
#
# Azure Command Line Interface Helpers
#
##############################################>

Function FileExistsOrExit([string]$absoluteFileName) {
	if(![System.IO.File]::Exists($absoluteFileName)){
		Write-Host "File '$absoluteFileName' does not exist!"
		exit
	}
}

Function CreateResourceGroupIfNotPresent([string]$resourceGroupName, [string]$resourceGroupLocation) {
	$resourceGroup = Get-AzResourceGroup -Name $resourceGroupName -ErrorAction SilentlyContinue
	if(!$resourceGroup) {
		Write-Host "Creating resource group '$resourceGroupName' in location '$resourceGroupLocation'";
		New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
	} else{
		Write-Host "Using existing resource group '$resourceGroupName'";
	}
}

Function IsResourceGroupPresent {
	param([string]$resourceGroupName)
	Get-AzResourceGroup -Name $resourceGroupName -ev notPresent -ea 0
}

