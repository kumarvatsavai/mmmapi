import { AzureFunction, Context, HttpRequest, Logger } from "@azure/functions"
import moment from "moment";
import { APIClient } from "../common/api";
import { createHttpClient, getAccessToken } from "../common/http";
import { AuthData } from "../common/types";
import { TransportProcessor } from "./transportProcessor";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const modifiedDate = req.query.modified;
    if (!modifiedDate || !moment(modifiedDate).isValid()) {
        context.res = {
            status: 400,
            body: "Invalid query parameter supplied"
        }
        return;
    }

    const origin_gateway = req.query.origin_gateway;
    const destination_gateway = req.query.destination_gateway;

    const logger: Logger = context.log;
    
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
        const transportProcessor = new TransportProcessor(apiClient, logger, process.env["environment"]);

        const result = await transportProcessor.getTransports(modifiedDate, origin_gateway, destination_gateway);

        context.res = {
            status: result.resultCode,
            body: result.transports
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