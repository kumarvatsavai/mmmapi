import moment from "moment";

export function computeTableSuffix(environment: string): string {
    let tableSuffix = "_dev"
    if (environment == "test") {
        tableSuffix = "_test"
    } else if (environment == "tat") {
        tableSuffix = "_tat"
    }
     else if (environment == "prod") {
        tableSuffix = ""
    }
    return tableSuffix;
}

export function getCurrentDateTime(): moment.Moment {
    return moment(moment.now()).utc();
}