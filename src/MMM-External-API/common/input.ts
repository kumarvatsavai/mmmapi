import { Transport, LoadedProducts, CancelReason } from "./types";
import { Context } from "@azure/functions";
import moment from "moment";

export interface InputParameters {
  clientId: any;
  clientSecret: any;
  objectId: any;
  tenantId: any;
  environment: any;
}

export function validateInputParameters(
  inputParameters: InputParameters
): boolean {
  const { clientId, clientSecret, objectId, tenantId, environment } =
    inputParameters;

  const authCredentialsAreValid =
    typeof clientId === "string" &&
    clientId !== "" &&
    typeof clientSecret === "string" &&
    clientSecret !== "" &&
    typeof objectId === "string" &&
    objectId !== "" &&
    typeof tenantId === "string" &&
    tenantId !== "";

  const environmentIsValid =
    environment === "dev" ||
    environment === "test" ||
    environment === "prod" ||
    environment === "tat";

  const allChecks = [authCredentialsAreValid, environmentIsValid];

  return allChecks.every((check) => check);
}

export interface CancelationInputData {
  batchSize: number;
  delayPeriodInHours: number;
  environment: "dev" | "test" | "tat" | "prod";
}

export interface InputData {
  environment: "dev" | "test" | "tat" | "prod";
}

export function parseEventUpdaterInputParameters(
  inputParameters: InputParameters
): InputData {
  const environment = inputParameters.environment as
    | "dev"
    | "test"
    | "prod"
    | "tat";

  return {
    environment,
  };
}

export function validateTransportsDeparture(
  transportDeparture: Transport,
  context: Context
): Boolean {
  if (transportDeparture.atd && !moment(transportDeparture.atd).isValid()) {
    context.res = {
      status: 400,
      body: "ATD should be of date & time format",
    };
    context.log.error("Wrong ATD format");
    return false;
  }

  if (!transportDeparture.atd) {
    context.log.error("Missing ATD");
    context.res = {
      status: 400,
      body: "ATD is mandatory",
    };
    return false;
  }

  if (
    transportDeparture.finish_loading &&
    !moment(transportDeparture.finish_loading).isValid()
  ) {
    context.res = {
      status: 400,
      body: "'Finish Loading' should be of date & time format",
    };
    context.log.error("Wrong 'Finish Loading' format");
    return false;
  }

  if (
    transportDeparture.capacity_usage &&
    typeof transportDeparture.capacity_usage !== "number"
  ) {
    context.res = {
      status: 400,
      body: "'Capacity Usage' should be a number",
    };
    context.log.error("Wrong 'Capacity Usage' format");
    return false;
  }

  if (
    transportDeparture.loaded_products &&
    transportDeparture.loaded_products.some(
      (x) =>
        !Object.values(LoadedProducts)
          .map((y) => y.toString())
          .includes(x)
    )
  ) {
    console.log(transportDeparture.loaded_products);
    context.res = {
      status: 400,
      body: `Loaded Products' should be one of: \r\n${Object.values(
        LoadedProducts
      )}`,
    };
    context.log.error("Wrong 'Loaded Products' value");
    return false;
  }
}

export function validateTransportsArrival(
  transportArrival: Transport,
  context: Context
): Boolean {
  if (transportArrival.ata && !moment(transportArrival.ata).isValid()) {
    context.res = {
      status: 400,
      body: "ATA should be of date & time format",
    };
    context.log.error("Wrong ATA format");
    return false;
  }

  if (!transportArrival.ata) {
    context.res = {
      status: 400,
      body: "ATA is mandatory",
    };
    context.log.error("Missing ATA");
    return false;
  }
}

export function validateTransportsUnloading(
  transportUnloading: Transport,
  context: Context
): Boolean {
  if (
    transportUnloading.start_unloading &&
    !moment(transportUnloading.start_unloading).isValid()
  ) {
    context.res = {
      status: 400,
      body: "'Start Unloading' should be of date & time format",
    };
    context.log.error("Wrong 'Start Unloading' format");
    return false;
  }

  if (
    transportUnloading.finish_unloading &&
    !moment(transportUnloading.finish_unloading).isValid()
  ) {
    context.res = {
      status: 400,
      body: "'Finish Unloading' should be of date & time format",
    };
    context.log.error("Wrong 'Finish Unloading' format");
    return false;
  }
}

export function validateTransportsCancel(
  transportCancel: Transport,
  context: Context
): Boolean {
  if (
    !transportCancel.cancel_reason ||
    typeof transportCancel.cancel_reason !== "string"
  ) {
    context.res = {
      status: 400,
      body: "'Cancel Reason' is mandatory and should be of a string type",
    };
    context.log.error(
      "'Cancel Reason' is missing or it is not of a string type"
    );
    context.done();
    return;
  }

  if (
    transportCancel.cancel_reason &&
    !Object.values(CancelReason).includes(
      transportCancel.cancel_reason as CancelReason
    )
  ) {
    context.res = {
      status: 400,
      body: `Cancel Reason' should be one of: \r\n${Object.values(
        CancelReason
      )}`,
    };
    context.log.error("Wrong 'Cancel Reason' value");
    return false;
  }
}
