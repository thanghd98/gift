import type { TokenInfo, Wallet } from "@wallet/core"
import type { Wallet as Signer } from "ethers"

export interface CreateGiftsParams {
    wallet: Wallet
    rewardToken: Partial<TokenInfo>,
    totalReward: number | bigint,
    totalSlots: number | bigint,
    randomPercent: | bigint,
    endTimestamp: number | bigint,
    baseMultiplier?: | bigint
}


export interface InputConfig extends Omit<CreateGiftsParams, 'wallet' | 'rewardToken' >{
    rewardToken: string
}
export interface GasSponsorCreateGiftsParams {
   signer: Signer
   giftContractAddress: string,
   inputConfig: InputConfig,
   feeToken: string,
   nonce?: number | string,
}

export interface SetFee {
    tokenAddress?: string,
    isActivated?: boolean,
    percentAmount?: number,
    feeRecipient?: string
}

interface BaseRewardParams{
    wallet: Wallet,
    giftContractAddress: string
}

export interface ClaimRewardParams  extends BaseRewardParams{ }


export interface WithdrawRewardParams extends BaseRewardParams{}

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