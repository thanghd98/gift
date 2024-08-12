import { GetInsertedSlotParams } from "../types";

const URL = 'https://superwallet-chat-api-stg.coin98.tech/adapters/lucky-gift'

export const getInsertedSlotReward = async (params: GetInsertedSlotParams): Promise<number> => {
    const { recipientAddress, giftContractAddress } = params
    try {
        const request = await fetch(`${URL}/${giftContractAddress}/inserted-slot/${recipientAddress}`,{
            headers: {
                apiKey: "dev_adapter9898"
            }
        })

        const { data } = await request.json()
        
        return data?.reward || 0
    } catch (error) {
        return 0
    }
}

export const getGiftReward = async (giftContractAddress: string): Promise<number> => {
    try {
        const request = await fetch(`${URL}/${giftContractAddress}/config`,{
            headers: {
                apiKey: "dev_adapter9898"
            }
        })

        const { data } = await request.json()
        
        return data?.remainingReward || 0
    } catch (error) {
        return 0
    }
}