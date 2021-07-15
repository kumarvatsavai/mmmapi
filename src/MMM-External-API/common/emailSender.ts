import { Logger } from "@azure/functions";
import { AxiosInstance } from "axios"
import { createHttpClient } from "./http";

export class EmailSender {
    private httpClient: AxiosInstance;

    constructor(private logger: Logger, private apiKey: string, private basicUrl: string, private from: string) {
        this.httpClient = createHttpClient("");
    }
   
    async send(recepients: string[], body: string, subject: string) {
        
        if (recepients.length === 0) {
            this.logger.info(`Recipients list is clear.`);
            return;
        }
        
        this.logger.info(`Emails will be sent to ${recepients.join(", ")} with subject ${subject}`);
        
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          };
                               
        const basicUrl = 'https://api.sendgrid.com/api/mail.send.json';
        let recepientsString = '';
        for(let i=0; i< recepients.length; i++) {
            recepientsString += `&to[]=${recepients[i]}`;
        }
        const params = `?from=${this.from}${recepientsString}&html=${body}&subject=${subject}`;
        
        await this.httpClient.post(this.basicUrl + params, '', {
            headers: headers
          });
    }
}