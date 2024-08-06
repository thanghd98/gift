import { CONTRACT_NAME } from "../constants";
import { ClaimRewardParams, ClaimRewardRespone, CreateGiftRespone, GasSponsorCreateGiftsParams, WithdrawGiftRespone, WithdrawRewardParams } from "../types";
import { GiftCore } from "./giftCore";

export class GasSponsor extends GiftCore {
    constructor(){
        super(CONTRACT_NAME.GAS_SPONSOR_CONTRACT_ADDRESS)
    }

    async createGifts(params: GasSponsorCreateGiftsParams): Promise<CreateGiftRespone>{
        const { inputConfig, feeToken, giftContractAddress, signer} = params
        
        try {
            const nonce = await this.getNonceAccount(signer.address)
            const response = await this.contract.connect(signer).createGift(giftContractAddress, inputConfig, feeToken,{
                gasLimit: 650000,
                nonce: nonce
            });

            const { transactionHash ,events } = await response.wait()

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

            const { transactionHash , events } = await response.wait()

            const transferEvent = events?.find((e: { event: string }) => e.event === "Transfer")
            const amount = Number(transferEvent?.args['amount'])

            return {transactionHash, amount}
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
                nonce
            })

            const { transactionHash , events } = await response.wait()
            const transferEvent = events?.find((e: { event: string }) => e.event === "Transfer")
            const amount = Number(transferEvent?.args['amount'])

            return {transactionHash, amount}

        } catch (error) {
            throw new Error(error as unknown as string)
        }
    }
  
}