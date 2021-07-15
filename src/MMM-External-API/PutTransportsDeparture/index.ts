import { AzureFunction, Context, HttpRequest, Logger } from "@azure/functions";
import { APIClient } from "../common/api";
import { createHttpClient, getAccessToken } from "../common/http";
import { validateInputParameters } from "../common/input";
import { AuthData, Transport } from "../common/types";
import { validateTransportsDeparture } from '../common/input';
import { TransportDepartureProcessor } from "./TransportDepartureProcessor";

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
        context.log.error('Some input parameters are either missing or invalid');
        context.done();
        return;
    }  
    

    let newTransport = req.body as Transport;
    let _id = req.params.id;
    
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
      
        const transportProcessor = new TransportDepartureProcessor(apiClient, logger, inputParameters.environment);

        const request = await transportProcessor.getTransport(_id);

        if (request && !request.mmm_atd) {
            const validateFields = validateTransportsDeparture(newTransport, context);
            if (validateFields === false) {
                context.done();
                return;
            }
            const result = await transportProcessor.updateTransportDeparture(_id, newTransport);

            context.res = {
                body: "Successful operation."
            };
            context.done();
            return;
        } else {
            context.log.warn(`Item with id: ${_id} already contains ATD`);
            context.res = {
                status: 400,
                body: `Item with id: ${_id} already contains ATD`
            };
            context.done();
            return;
        };
    }
    catch(e) {
        if (e.response.status === 400) {
            context.log.error('Invalid transport id supplied');
            context.res = {
                status: 400,
                body: 'Invalid transport id supplied'
            };
            context.done();
            return;
        }
        context.log.error(e);
        context.res = {
            status: 500,
            body: 'Error during request executing. Please contact the developers.'
        };
        context.done();
        return;
    }
};

export default httpTrigger;


