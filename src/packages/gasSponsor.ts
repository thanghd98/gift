import { ethers } from "ethers";
import { CONTRACT_NAME } from "../constants";
import { ClaimRewardParams, ClaimRewardRespone, CreateGiftRespone, GasSponsorCreateGiftsParams, WithdrawGiftRespone, WithdrawRewardParams } from "../types";
import { GiftCore } from "./giftCore";

export class GasSponsor extends GiftCore {
    constructor(privateKey?: string, isDev?: boolean){
        super(CONTRACT_NAME.GAS_SPONSOR_CONTRACT_ADDRESS, privateKey, isDev)
        
    }

    async createGifts(params: GasSponsorCreateGiftsParams): Promise<CreateGiftRespone>{
        const { inputConfig, feeToken, giftContractAddress, signer} = params
        const isNative =  inputConfig.rewardToken === ethers.constants.AddressZero
        
        try {
            const nonce = await this.getNonceAccount(signer.address)
            const response = await this.contract.connect(signer).createGift(giftContractAddress, inputConfig, feeToken,{
                gasLimit: 650000,
                nonce: nonce,
                value: isNative ?  BigInt(inputConfig.totalReward) :  BigInt(0)
            });

            const { transactionHash , events } = await response.wait()

            if(isNative){
                return {
                    contractAddress: events[0]?.address,
                    transactionHash
                }
            }

            const transferEvent = events?.find((e: { event: string }) => e.event === "Transfer")
            const contractAddress = transferEvent?.args['to']

            return {
                contractAddress,
                transactionHash
            }
        } catch (error) {
          throw new Error(error as unknown as string)
        }
    }


    async claimReward(params: ClaimRewardParams): Promise<ClaimRewardRespone>{
        const{ wallet, giftContractAddress } = params
        try {
            const nonce = await this.getNonceAccount(wallet.address)

            const owner = this.createSigner(wallet)
            const response = await this.contract.connect(owner).claimReward(giftContractAddress,{
                gasLimit: 650000,
                nonce
            })

            const { transactionHash  } = await response.wait()

            return {transactionHash, amount: 0}
        } catch (error) {
            throw new Error(error as unknown as string)   
        }
    }

    async withdrawRemainingReward(params: WithdrawRewardParams): Promise<WithdrawGiftRespone>{
        const { wallet, giftContractAddress } = params
        try {
            const nonce = await this.getNonceAccount(wallet.address)
            const owner = this.createSigner(wallet)

            const response = await this.contract.connect(owner).withdrawRemainingReward(giftContractAddress,{
                gasLimit: 650000,
                nonce,
            })

            const { transactionHash } = await response.wait()

            return {transactionHash, amount: 0}

        } catch (error) {
            throw new Error(error as unknown as string)
        }
    }
  
}