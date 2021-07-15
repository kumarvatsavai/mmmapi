import { Logger } from "@azure/functions";
import { APIClient } from "../common/api";
import { TRANSPORT_LIST_NAME } from "../common/const";
import { Transport } from "../common/types";
import { computeTableSuffix } from "../common/utils";

export class TransportDepartureProcessor {
  constructor(
    private apiClient: APIClient,
    private logger: Logger,
    private env: string
  ) {}

  async getTransport(id: string) {
    const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;

    const request = await this.apiClient.getTransportById(listName, id);

    return request;
  }

  async updateTransportDeparture(id: string, data: Transport) {
    const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;

    const mappedTransport = {
      mmm_atd: data.atd, // datetime
      mmm_loaded_products: data.loaded_products.join(", "),
      mmm_mrn_number: data.mrn_number,
      mmm_finish_loading: data.finish_loading, // datetime
      mmm_licence_plate: data.licence_plate,
      mmm_second_licence_plate: data.second_licence_plate,
      mmm_load_message: data.load_message,
      mmm_driver_name: data.driver_name,
      mmm_capacity_usage: data.capacity_usage
        ? data.capacity_usage + "%"
        : data.capacity_usage,
      mmm_origin_seal_number: data.origin_seal_number,
      mmm_second_origin_seal_number: data.second_origin_seal_number,
      mmm_departure_description: data.departure_description,
      mmm_departure_delay_reason: data.departure_delay_reason,
    };
    const response = await this.apiClient.updateTransportById(
      listName,
      id,
      mappedTransport
    );

    return response;
  }
}
