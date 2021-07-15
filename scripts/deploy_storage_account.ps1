<#
 .SYNOPSIS
	Deploys Function App to Azure

 .DESCRIPTION
	Deploys Function App ARM template

 .PARAMETER subscriptionId
	The subscription id where the template will be deployed.

 .PARAMETER templateFileName
	Name of the file with tagging ARM template

 .PARAMETER singleExecution
	Set to true if script is executed alone. If script is used in another workflow use false
#>
param(
	[Parameter(Mandatory = $True)]
	[string]
	$subscriptionId,

	[Parameter(Mandatory = $True)]
	[string]
	$templateFileName,
	
	[Parameter(Mandatory = $False)]
	[bool]
	$singleExecution = $False
)
#******************************************************************************
# Script body
# Execution begins here
#******************************************************************************
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
. $scriptDir\command_line_interface_helpers.ps1

$templateFile = "$scriptDir\$templateFileName"
FileExistsOrExit -absoluteFileName $templateFile

# # sign in
# if ($singleExecution) {
# 	Write-Host "Logging in...";
# 	Connect-AzAccount;
# } 

Write-Host "Selecting subscription '$subscriptionId'";
Select-AzSubscription -SubscriptionID $subscriptionId;

Write-Host "Starting deployment..."
$output = New-AzDeployment `
	-TemplateFile $templateFile `
	-baseName transport-generator `
	-Location westeurope `
	-Verbose

return $output