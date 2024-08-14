import { URL_REQUEST } from "../constants";
import { GetInsertedSlotParams } from "../types";

interface InsertedSlotParams extends  GetInsertedSlotParams{
    code: string,
    isDev: boolean
}

export const getInsertedSlotReward = async (params: InsertedSlotParams): Promise<number> => {
    const { recipientAddress, giftContractAddress, isDev, code} = params
    const url = URL_REQUEST(isDev)
    try {
        const request = await fetch(`${url}/${giftContractAddress}/inserted-slot/${recipientAddress}`,{
            headers: {
                apiKey: code
            }
        })

        const { data } = await request.json()
        
        return data?.reward || 0
    } catch (error) {
        return 0
    }
}

export const getGiftReward = async (giftContractAddress: string, code: string, isDev: boolean): Promise<number> => {
    const url = URL_REQUEST(isDev)
    try {
        const request = await fetch(`${url}/${giftContractAddress}/config`,{
            headers: {
                apiKey: code
            }
        })

        const { data } = await request.json()
        
        return data?.remainingReward || 0
    } catch (error) {
        return 0
    }
}