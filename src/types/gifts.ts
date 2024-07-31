import { BigNumber } from "ethers"

export interface CreateGiftsParams{
    rewardToken: string,
    totalReward: number | bigint | BigNumber,
    totalSlots: number | bigint | BigNumber,
    randomPercent: number | bigint | BigNumber,
    baseMultiplier?: number | bigint | BigNumber
}

export interface GasSponsorCreateGiftsParams{
   giftContractAddress: string,
   inputConfig: CreateGiftsParams,
   feeToken: string,
   amount?: number | string
}