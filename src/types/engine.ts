import { AxiosInstance } from "axios";

export interface GiftFactoryEngine {
    privateKey?: string,
    isDev: boolean,
    chatApiInstance?: AxiosInstance
}
  