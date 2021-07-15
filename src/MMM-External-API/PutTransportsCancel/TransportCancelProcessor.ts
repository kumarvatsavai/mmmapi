import { Logger } from "@azure/functions";
import { APIClient } from "../common/api";
import { TRANSPORT_LIST_NAME } from "../common/const";
import { Transport } from "../common/types";
import { computeTableSuffix } from "../common/utils";

export class TransportCancelProcessor {

    constructor(private apiClient: APIClient, private logger: Logger, private env: string) {
    }

    async getTransport(id: string) {
        const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;
        const request = await this.apiClient.getTransportById(listName, id);

        return request;
    }

    async updateTransportCancel(id: string, data: Transport) {
        const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;

        const mappedTransport = {
            mmm_cancel_reason: data.cancel_reason
        }
        const response = await this.apiClient.updateTransportById(listName, id, mappedTransport)

        return response;
    }
}