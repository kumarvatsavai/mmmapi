import { Logger } from "@azure/functions";
import { APIClient } from "../common/api";
import { TRANSPORT_LIST_NAME } from "../common/const";
import { Transport } from "../common/types";
import { computeTableSuffix } from "../common/utils";

export class TransportUnloadingProcessor {

    constructor(private apiClient: APIClient, private logger: Logger, private env: string) {
    }

    async getTransport(id: string) {
        const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;

        const request = await this.apiClient.getTransportById(listName, id);

        return request;
    }

    async updateTransportDeparture(id: string, data: Transport) {
        const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;
        
        const mappedTransport = {
            mmm_start_unloading: data.start_unloading,              // datetime
            mmm_end_unloading: data.finish_unloading,               // datetime
            mmm_destination_seal_number: data.destination_seal_number,
            mmm_second_dest_seal_number: data.second_destination_seal_number,
        }
        const response = await this.apiClient.updateTransportById(listName, id, mappedTransport)

        return response;
    }
}