import { Logger } from "@azure/functions";
import { AxiosInstance } from "axios";

export class APIClient {
  private httpClient: AxiosInstance;
  private logger: Logger;

  constructor(httpClient: AxiosInstance, logger: Logger) {
    this.httpClient = httpClient;
    this.logger = logger;
  }

  async getAllItemsInList<T>(
    listName: string,
    filters: string
  ): Promise<Array<T>> {
    const fullUrl = `/_api/web/lists/GetByTitle('${listName}')/items?${filters}`;
    this.logger.info("full url: ", fullUrl);
    const result = await this.httpClient.get(
      `/_api/web/lists/GetByTitle('${listName}')/items?${filters}`
    );
    return result.data.value;
  }

  async getTransportById(listName: string, id: string) {
    const fullUrl = `/_api/web/lists/GetByTitle('${listName}')/GetItemById(${id})`;
    this.logger.info("full url: ", fullUrl);
    const result = await this.httpClient.get(fullUrl);
    return result.data;
  }

  async updateTransportById(listName: string, id: string, data: object) {
    const fullUrl = `/_api/web/lists/GetByTitle('${listName}')/GetItemById(${id})`;
    this.logger.info("full url: ", fullUrl);
    const result = await this.httpClient.post(fullUrl, data, {
      headers: {
        "IF-MATCH": "*",
        "X-HTTP-Method": "MERGE",
      },
    });
    return result;
  }

  prepeareGatewayFiltersString(lastModificationDate: string): string {
    const filter = `Modified ge '${lastModificationDate}'`;
    this.logger.info("calculated custom filters", filter);
    return `$filter=(${filter})&$top=100000`;
  }

  prepeareTransportFiltersString(
    lastModificationDate: string,
    origin_gateway: string,
    destination_gateway
  ): string {
    const origin_gateway_filter = !origin_gateway
      ? ""
      : `(mmm_origin_gateway eq '${origin_gateway}') and`;
    const destination_gateway_filter = !destination_gateway
      ? ""
      : `(mmm_destination_gateway eq '${destination_gateway}') and`;
    const modificationDateFilter = `(Modified ge '${lastModificationDate}')`;
    return `$filter=(${origin_gateway_filter} ${destination_gateway_filter} ${modificationDateFilter})&$select=*,mmm_costs/Id,mmm_costs/mmm_costs&$expand=mmm_costs&$top=100000`;
  }

  prepeareShortTransportFiltersString(): string {
    return `$select=*,mmm_costs/Id,mmm_costs/mmm_costs&$expand=mmm_costs&$top=5000&$orderby=mmm_std asc`;
  }

  async getFilterredGateways(
    listName: string,
    lastModificationDate: string
  ): Promise<Array<any>> {
    const filter = this.prepeareGatewayFiltersString(lastModificationDate);
    const res = await this.getAllItemsInList(listName, filter);
    return res;
  }

  async getFilterredTransports(
    listName: string,
    lastModificationDate: string,
    origin_gateway: string,
    destination_gateway
  ): Promise<Array<any>> {
    const filter = this.prepeareTransportFiltersString(
      lastModificationDate,
      origin_gateway,
      destination_gateway
    );
    const res = await this.getAllItemsInList(listName, filter);
    return res;
  }

  async getPartialTransports(listName: string): Promise<Array<any>> {
    const filter = this.prepeareShortTransportFiltersString();
    const res = await this.getAllItemsInList(listName, filter);
    return res;
  }
}
