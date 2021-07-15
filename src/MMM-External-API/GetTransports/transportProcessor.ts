import { Logger } from "@azure/functions";
import moment from "moment";
import { APIClient } from "../common/api";
import { TRANSPORT_LIST_NAME } from "../common/const";
import { Transport, TransportsResponse } from "../common/types";
import { computeTableSuffix } from "../common/utils";

export class TransportProcessor {
  constructor(
    private apiClient: APIClient,
    private logger: Logger,
    private env: string
  ) {}

  async getTransports(
    modificationDate: string,
    originGateway: string,
    destinationGateway
  ): Promise<TransportsResponse> {
    const listName = `${TRANSPORT_LIST_NAME}${computeTableSuffix(this.env)}`;

    let response = [];
    let resultCode = 200;

    try {
      response = await this.apiClient.getFilterredTransports(
        listName,
        modificationDate,
        originGateway,
        destinationGateway
      );
    } catch {
      resultCode = 206;
      response = await (
        await this.apiClient.getPartialTransports(listName)
      ).filter(
        (x) =>
          (x.mmm_origin_gateway === originGateway || !originGateway) &&
          (x.mmm_destination_gateway === destinationGateway ||
            !destinationGateway) &&
          Date.parse(x.Modified) >= Date.parse(modificationDate)
      );
    }

    const transports = response.map((x: any) => {
      return {
        id: x.ID,
        origin: x.mmm_origin,
        origin_gateway: x.mmm_origin_gateway,
        destination: x.mmm_destination,
        destination_gateway: x.mmm_destination_gateway,
        std: x.mmm_std,
        sta: x.mmm_sta,
        lta: x.mmm_lta,
        line: x.mmm_line,
        trip_id: x.mmm_trip_id,
        trip_segment_seq: x.mmm_trip_segment_seq,
        original_trip_id: x.mmm_original_trip_id,
        driver_name: x.mmm_driver_name,
        network_type: x.mmm_network_type,
        truck_type: x.mmm_truck_type,
        loading_mode: x.mmm_loading_mode,
        loaded_products: x.mmm_loaded_products
          ? (x.mmm_loaded_products as string).split(", ")
          : null,
        status: x.mmm_status,
        costs: x.mmm_costs?.mmm_costs,
        costs_per_km: x.mmm_costs_per_km,
        costs_born_by: x.mmm_costs_born_by,
        distance: x.mmm_distance,
        load_meter: x.mmm_load_meter,
        contract_by: x.mmm_contract_by,
        operator: x.mmm_operator,
        roundtrip_with: x.mmm_roundtrip_with,
        remarks: x.mmm_remarks,
        stpos: x.mmm_stpos,
        trip_time: x.mmm_trip_time,
        adhoc: x.mmm_adhoc,
        modified: x.Modified,
        atd: x.mmm_atd,
        mrn_number: x.mmm_mrn_number,
        finish_loading: x.mmm_finish_loading,
        licence_plate: x.mmm_licence_plate,
        second_licence_plate: x.mmm_second_licence_plate,
        load_message: x.mmm_load_message,
        capacity_usage: !!x.mmm_capacity_usage
          ? +x.mmm_capacity_usage.substring(0, x.mmm_capacity_usage.length - 1)
          : null,
        origin_seal_number: x.mmm_origin_seal_number,
        second_origin_seal_number: x.mmm_second_origin_seal_number,
        departure_description: x.mmm_departure_description,
        departure_delay_reason: x.mmm_departure_delay_reason,
        ata: x.mmm_ata,
        start_unloading: x.mmm_start_unloading,
        finish_unloading: x.mmm_end_unloading,
        destination_seal_number: x.mmm_destination_seal_number,
        second_destination_seal_number: x.mmm_second_dest_seal_number,
        arrival_description: x.mmm_arrival_description,
        arrival_delay_reason: x.mmm_arrival_delay_reason,
        cancel_reason: x.mmm_cancel_reason,
      } as Transport;
    });

    return {
      resultCode: resultCode,
      transports: transports,
    } as TransportsResponse;
  }
}
