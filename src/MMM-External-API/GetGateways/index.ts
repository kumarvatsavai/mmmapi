import { AzureFunction, Context, HttpRequest, Logger } from "@azure/functions"
import moment = require("moment");
import { APIClient } from "../common/api";
import { createHttpClient, getAccessToken } from "../common/http";
import { validateInputParameters } from "../common/input";
import { AuthData, Gateway } from "../common/types";
import { GatewayProcessor } from "./gatewaysProcessor";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const inputParameters = {
        clientId:           process.env["clientId"],
        clientSecret:       process.env["clientSecret"],
        objectId:           process.env["objectId"],
        tenantId:           process.env["tenantId"],
        environment:        process.env["environment"],
    };

    const logger: Logger = context.log;

    const inputParametersAreValid = validateInputParameters(inputParameters);

    if (!inputParametersAreValid) {

        context.res = {
            status: 500,
            body: "Configuration error. Please contact the developers."
        }
        context.log.error('some input parameters are either missing or invalid');        
        context.done();
        return;
    }  
    
        
    const date = req.query.modified;
    if (!date || !moment(date).isValid()) {
        context.res = {
            status: 400,
            body: "Invalid query parameter supplied"
        }
        return;
    }

    
    try {

        const authData: AuthData = { 
            clientId:     process.env["clientId"],
            clientSecret: process.env["clientSecret"],
            objectId:     process.env["objectId"],
            tenantId:     process.env["tenantId"]
        }
        
        const accessToken = await getAccessToken(authData);
        const httpClient = createHttpClient("https://dpdhl.sharepoint.com/sites/MMM", accessToken); 
        const apiClient = new APIClient(httpClient, logger);

        const gatewayProcessor = new GatewayProcessor(apiClient, logger, inputParameters.environment);

        const result = await gatewayProcessor.getGetways(date);
   /*     
        const gateways = await apiClient.getAllItemsInList('gateway', filter); 

        const result = gateways.map((x: any) => { return {    
            id: x.ID,
            gateway_title: x.mmm_gateway_title,
            gateway_name: x.mmm_gateway_name,
            gateway_code: x.mmm_gateway_id,
            address_country: x.mmm_address_country,
            country: x.mmm_country_code,
            modified: x.Modified} as Gateway})
*/
        context.res = {
            body: result
        };
    }
    catch(e) {
        logger.error(e);
        context.res = {
            status: 500,
            body: 'Error during request executing. Please contact the developers.'
        };
    }
};

export default httpTrigger;


