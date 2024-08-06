import type { TokenInfo, Wallet } from "@wallet/core"
import type { Wallet as Signer } from "ethers"

export interface CreateGiftsParams {
    wallet: Wallet
    rewardToken: Partial<TokenInfo>,
    totalReward: number,
    totalSlots: number,
    randomPercent: number,
    baseMultiplier?: number
}

export interface GasSponsorCreateGiftsParams {
   signer: Signer
   giftContractAddress: string,
   inputConfig: {
    rewardToken: string,
    totalReward: number | bigint,
    totalSlots: number | bigint,
    randomPercent: number | bigint,
    baseMultiplier?: number | bigint
   },
   feeToken: string,
   nonce?: number | string,
}

export interface ClaimReward {
    wallet: Wallet,
    giftContractAddress: string
}

export interface SetFee {
    tokenAddress?: string,
    isActivated?: boolean,
    percentAmount?: number,
    feeRecipient?: string
}