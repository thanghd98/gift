import type { TokenInfo, Wallet } from "@wallet/core"
import type { Wallet as Signer } from "ethers"

export interface CreateGiftsParams {
    wallet: Wallet
    rewardToken: Partial<TokenInfo>,
    totalReward: number | bigint,
    totalSlots: number | bigint,
    randomPercent: number| bigint,
    endTimestamp: number | bigint,
    baseMultiplier?: number | bigint
    gasPrice?: number,
    gasLimit?: number
}


export interface InputConfig extends Omit<CreateGiftsParams, 'wallet' | 'rewardToken' | 'gasPrice' | 'gasLimit' >{
    rewardToken: string
}
export interface GasSponsorCreateGiftsParams {
   signer: Signer
   giftContractAddress: string,
   inputConfig: InputConfig,
   feeToken: string,
   nonce?: number | string,
   gasPrice?: number,
   gasLimit?: number
}

export interface SetFee {
    tokenAddress?: string,
    isActivated?: boolean,
    percentAmount?: number,
    feeRecipient?: string
}

interface BaseRewardParams{
    gasPrice: number,
    gasLimit: number
    wallet: Wallet,
    giftContractAddress: string
}

export interface ClaimRewardParams  extends BaseRewardParams{ }


export interface WithdrawRewardParams extends BaseRewardParams{ }

interface BaseRewardRespone{
    transactionHash: string
}

export interface ClaimRewardRespone extends BaseRewardRespone{
    amount: number
}

export interface CreateGiftRespone extends BaseRewardRespone{
    contractAddress: string
}

export interface WithdrawGiftRespone extends BaseRewardRespone{
    amount: number
}

export interface GetInsertedSlotParams{
    giftContractAddress: string,
    recipientAddress: string
}

export interface GiftConfigResponse{
    baseMultiplier: number
    endTimestamp: number
    meanRewardPerSlot: number
    randomPercent: number
    remainingReward: number
    remainingSlots: number
    rewardToken: string
    totalReward: number
    totalSlots: number
}

export interface InsertedSlotRepsonse{
    isClaimed: boolean,
    isInserted: boolean,
    reward: number,
    slotNumber: number
}

export interface RawData{
    from: string,
    to: string,
    data: string,
    value?: string
}

export interface SubmitRewardParams{
    recipcients: string[], 
    giftContractAddress: string,
    privateKey: string
}