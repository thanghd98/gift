import { Contract, ethers } from "ethers";
import { CONTRACT_NAME, ERC20ABI, GIFT_ABI } from '../constants'
import { ClaimReward, CreateGiftsParams, SetFee } from "../types";
import { GasSponsor } from "./gasSponsor";
import { GiftCore } from "./giftCore";
import { convertBalanceToWei } from '@wallet/utils'

export class GiftFactory extends GiftCore{
  sponsorGasContract: GasSponsor

  constructor(){
    super(CONTRACT_NAME.COIN98_GIFT_FACTORY_CONTRACT_ADDRESS)
    this.sponsorGasContract = new GasSponsor()
  }

  async createGifts(params: CreateGiftsParams): Promise<string>{
      const { rewardToken, totalReward, totalSlots, randomPercent, baseMultiplier = 1} = params
      try {
        const inputConfig = {
          rewardToken: rewardToken.address,
          totalReward: BigInt(convertBalanceToWei(totalReward.toString(), rewardToken.decimal)),
          totalSlots: BigInt(totalSlots as number),
          randomPercent: BigInt(randomPercent as number),
          baseMultiplier: BigInt(baseMultiplier as number)
        }

        await this.setFee({feeRecipient: this.signer.address, tokenAddress: ethers.constants.AddressZero, isActivated: true, percentAmount: 0})

        // const feeConfig = await this.contract.getFee(ethers.constants.AddressZero);
        // const feeAmount = (BigInt(inputConfig.totalReward.toString()) * BigInt(feeConfig.percentAmount)) / BigInt(10000);
        // const totalRewards = BigInt(inputConfig.totalReward.toString());

        const tokenContract = new Contract(rewardToken.address, ERC20ABI, this.signer)
        const response = await tokenContract.approve(this.contractAddress,String(convertBalanceToWei(totalReward.toString(), rewardToken.decimal)))
         await response.wait()

        const hash = await this.sponsorGasContract.createGifts({
          giftContractAddress: this.contractAddress,
          inputConfig,
          feeToken: ethers.constants.AddressZero
        })

        return hash
      } catch (error) {
        throw new Error(error as unknown as string)
      }
  }

  async claimGift(params: ClaimReward): Promise<string>{
    const hash = await this.sponsorGasContract.claimReward(params)

    return hash
  }

  async submitRewardRecipient(recipcient: string, giftContractAddress: string): Promise<string>{
    try {
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], this.signer )

      const { hash } = await giftContract.connect(this.signer).submitRewardRecipient(recipcient,{
        gasLimit: 650000
      })

      return hash
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async getCreatedGift(index: string): Promise<string>{
    try {
      const contractAddress = await this.contract.getCreatedGift(index)
  
      return contractAddress
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async setFee( params: SetFee ): Promise<string>{
    const { tokenAddress, isActivated = true, percentAmount = 0, feeRecipient } = params
    try {
      const unlockSetFee = await this.unlockFunction('setFee');
      
      if(unlockSetFee){
        const nonce = await this.provider.getTransactionCount(this.signer.address, 'latest')
        const response = await this.contract.connect(this.signer).setFee(tokenAddress, {
          isActivated,
          percentAmount: BigInt(percentAmount),
          feeRecipient: feeRecipient
        },{
          gasLimit: 210000,
          nonce
        })

        const { transactionHash } = await response.wait()

        return transactionHash
      }
      throw new Error("Contract haven't unlock yet")
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }

  async setAdmin(address: string): Promise<string>{
    try {
      const unlockAdmin = await this.unlockFunction('setAdmin');
      
      if(unlockAdmin){
        const nonce = await this.provider.getTransactionCount(this.signer.address, 'latest')

        const response = await this.contract.setAdmin(address, true,{
          gasLimit: 210000,
          nonce: nonce
        })

        const { transactionHash } = await response.wait()

        return transactionHash
      }
      throw new Error("Contract haven't unlock yet")
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }

  async isAdmin(address: string): Promise<boolean>{
    try {
      const isAdmin = await this.contract.isAdmin(address)
      return isAdmin
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }

  async unlockFunction(functionName: string): Promise<string>{
    try {
      const nonce = await this.provider.getTransactionCount(this.signer.address, 'latest')
      
      const response = await this.contract.unlock(this.contract.interface.getSighash(functionName),{
        gasLimit: 210000,
        nonce
      });
      const { transactionHash } = await response.wait()

      return transactionHash
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }
}