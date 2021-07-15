export interface AuthData {
  clientId: string;
  clientSecret: string;
  objectId: string;
  tenantId: string;
}

export interface Gateway {
  id: string;
  gateway_title: string;
  gateway_name: string;
  gateway_code: string;
  address_country: string;
  country: string;
  fernv_reference: string;
  modified: string;
}

export interface TransportsResponse {
  resultCode: number;
  transports: Transport[];
}

export interface Transport {
  id: string;
  origin: string;
  origin_gateway: string;
  destination: string;
  destination_gateway: string;
  std: string;
  sta: string;
  lta: string;
  line: string;
  trip_id: string;
  trip_segment_seq: string;
  original_trip_id: string;
  driver_name: string;
  network_type: string;
  truck_type: string;
  loading_mode: string;
  loaded_products: string[];
  status: string;
  costs: number;
  costs_per_km: number;
  costs_born_by: string;
  distance: number;
  load_meter: number;
  contract_by: string;
  operator: string;
  roundtrip_with: string;
  remarks: string;
  stpos: string;
  trip_time: string;
  adhoc: boolean;
  modified: string;
  atd: string;
  mrn_number: string;
  finish_loading: string;
  licence_plate: string;
  second_licence_plate: string;
  load_message: string;
  capacity_usage: number;
  origin_seal_number: string;
  second_origin_seal_number: string;
  departure_description: string;
  departure_delay_reason: string;
  ata: string;
  start_unloading: string;
  finish_unloading: string;
  destination_seal_number: string;
  second_destination_seal_number: string;
  arrival_description: string;
  arrival_delay_reason: string;
  cancel_reason: string;
}

export enum LoadedProducts {
  DHL_EUROPLUS = "DHL Europlus",
  EUROPACKET = "Europaket",
  DHL_PARCEL_CONNECT = "DHL Parcel Connect",
  DHL_PARCEL_INTERNATIONAL = "DHL Parcel International",
  DHL_PACKET = "DHL Paket",
  DHL_PARCEL_RETURN_CONNECT = "DHL Parcel Return Connect",
  OTHER = "Other",
}

export enum CancelReason {
  LOW_VOLUME = "Low Volume",
  SCHEDULING_ERROR = "Scheduling Error",
  HOLIDAY_PLANNING = "Holiday Planning",
  STANDBY_NOT_NEEDED = "Standby not needed",
  STRIKE = "Strike",
  OTHER = "Other",
}
