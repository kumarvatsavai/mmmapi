import { Logger } from "@azure/functions";
import { APIClient } from "../common/api";
import { GATEWAY_LIST_NAME } from "../common/const";
import { Gateway } from "../common/types";
import { computeTableSuffix } from "../common/utils";

export class GatewayProcessor {

    constructor(private apiClient: APIClient, private logger: Logger, private env: string) {
    }

    async getGetways(modificationDate: string) : Promise<Gateway[]> {
        const listName = `${GATEWAY_LIST_NAME}${computeTableSuffix(this.env)}`;
        const response = await this.apiClient.getFilterredGateways(listName, modificationDate);
        return response.map((x: any) => { return {
            id: x.ID,
            gateway_title: x.mmm_gateway_title,
            gateway_name: x.mmm_gateway_name,
            gateway_code: x.mmm_gateway_id,
            address_country: x.mmm_address_country,
            country: x.mmm_country_code,
            fernv_reference: x.mmm_fernv_reference,
            modified: x.Modified} as Gateway})
    }
}