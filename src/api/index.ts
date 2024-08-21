import { AxiosInstance, AxiosResponse } from "axios";
import { GetInsertedSlotParams } from "../types";

interface InsertedSlotParams extends  GetInsertedSlotParams{
    chatApiInstance?: AxiosInstance
}

export const getInsertedSlotReward = async (params: InsertedSlotParams): Promise<number> => {
    const { recipientAddress, giftContractAddress, chatApiInstance} = params
    try {
        const request = await chatApiInstance?.get(`/transactions/${giftContractAddress}/inserted-slot/${recipientAddress}`)

        const { data } =  request as AxiosResponse
        
        return data?.data?.reward || 0
    } catch (error) {
        return 0
    }
}

export const getGiftReward = async (giftContractAddress: string, chatApiInstance: AxiosInstance): Promise<number> => {
    try {
        const request = await chatApiInstance?.get(`/transactions/${giftContractAddress}/config`)

        const { data } = request
        
        return data?.data?.remainingReward || 0
    } catch (error) {
        return 0
    }
}