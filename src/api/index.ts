import { AxiosInstance, AxiosResponse } from "axios";
import { URL_REQUEST } from "../constants";
import { GetInsertedSlotParams } from "../types";

interface InsertedSlotParams extends  GetInsertedSlotParams{
    isDev: boolean,
    chatApiInstance?: AxiosInstance
}

export const getInsertedSlotReward = async (params: InsertedSlotParams): Promise<number> => {
    const { recipientAddress, giftContractAddress, isDev, chatApiInstance} = params
    const url = URL_REQUEST(isDev)
    try {
        const request = await chatApiInstance?.get(`${url}/${giftContractAddress}/inserted-slot/${recipientAddress}`)

        const { data } =  request as AxiosResponse
        
        return data?.data?.reward || 0
    } catch (error) {
        return 0
    }
}

export const getGiftReward = async (giftContractAddress: string, isDev: boolean, chatApiInstance: AxiosInstance): Promise<number> => {
    const url = URL_REQUEST(isDev)
    try {
        const request = await chatApiInstance?.get(`${url}/${giftContractAddress}/config`)

        const { data } = request
        
        return data?.data?.remainingReward || 0
    } catch (error) {
        return 0
    }
}