import axios, { AxiosInstance } from 'axios'
import https from 'https'
import { AuthData } from './types'

export function createHttpClient(baseUrl: string, token?: string): AxiosInstance {
    return axios.create({
        baseURL: baseUrl,
        timeout: 60000,
        httpsAgent: new https.Agent({ keepAlive: true }),
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
            "Authorization": token ? `Bearer ${token}` : ""
        }
    })
}

export async function getAccessToken(
    authData: AuthData): Promise<string> {

    const oauthUrl = `https://accounts.accesscontrol.windows.net/${authData.tenantId}/tokens/OAuth/2`
    const resource = `${authData.objectId}/dpdhl.sharepoint.com@${authData.tenantId}`

    const payload = [
        `client_id=${encodeURIComponent(authData.clientId)}`,
        `client_secret=${encodeURIComponent(authData.clientSecret)}`,
        `resource=${encodeURIComponent(resource)}`,
        "grant_type=client_credentials"
    ].join("&")

    const result = await axios(
        oauthUrl,
        {
            method: "post",
            data: payload,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )

    return result.data["access_token"]
}