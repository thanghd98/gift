import { Contract, ethers } from "ethers";
import { CONTRACT_NAME, ERC20ABI } from '../constants'
import { CreateGiftsParams } from "../types";
import { GasSponsor } from "./gasSponsor";
import { GiftCore } from "./giftCore";


export class GiftFactory extends GiftCore{
  sponsorGasContract: GasSponsor

  constructor(){
    super(CONTRACT_NAME.COIN98_GIFT_FACTORY_CONTRACT_ADDRESS)
    this.sponsorGasContract = new GasSponsor()
  }

  async createGifts(params: CreateGiftsParams): Promise<string>{
      const { rewardToken, totalReward, totalSlots, randomPercent, baseMultiplier = 1} = params
      const nonce = await this.signer.getTransactionCount()
      try {
        const inputConfig = {
          rewardToken,
          totalReward: BigInt(ethers.utils.parseEther(totalReward.toString()).toString()),
          totalSlots: BigInt(ethers.utils.parseEther(totalSlots.toString()).toString()),
          randomPercent: BigInt(randomPercent as number * 100),
          baseMultiplier: BigInt(baseMultiplier as number)
        }

        // await this.setFee(ethers.constants.AddressZero)

        // const feeConfig = await this.contract.getFee(ethers.constants.AddressZero);
        // const feeAmount = (BigInt(inputConfig.totalReward.toString()) * BigInt(feeConfig.percentAmount)) / BigInt(10000);
        // const totalRewards = BigInt(inputConfig.totalReward.toString());

        const tokenContract = new Contract(rewardToken, ERC20ABI, this.signer)
        const approve = await tokenContract.approve(this.contractAddress, ethers.utils.parseEther(totalReward.toString()),{
          nonce: nonce 
        })
        console.log("🚀 ~ GiftFactory ~ approve ~ approve:", approve)

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

  async getCreatedGift(index: string): Promise<string>{
    const contractAddress = await this.contract.getCreatedGift(index)

    return contractAddress
  }

  async setFee(feeToken: string, isActivated: boolean = true, percentAmount: number = 0, feeRecipient: string = this.signer.address){
    try {
      const unlockSetFee = await this.unlockFunction('setFee');
      
      if(unlockSetFee){
        const nonce = await this.signer.getTransactionCount()
        console.log("🚀 ~ GiftFactory ~ setFee ~ nonce:", nonce)
        const hashFee = await this.contract.connect(this.signer).setFee(feeToken, {
          isActivated,
          percentAmount: BigInt(percentAmount),
          feeRecipient: feeRecipient
        },{
          gasLimit: 210000,
          nonce: nonce + 1
        })

        return hashFee
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
        const nonce = await this.signer.getTransactionCount()
        const hashAdmin = await this.contract.setAdmin(address, true,{
          gasLimit: 210000,
          nonce: nonce + 1
        })

        return hashAdmin
      }
      throw new Error("Contract haven't unlock yet")
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }

  async isAdmin(address: string): Promise<boolean>{
    const isAdmin = await this.contract.isAdmin(address)
    return isAdmin
  }

  async unlockFunction(functionName: string): Promise<string>{
    try {
      const nonce = await this.signer.getTransactionCount()
      const {hash} = await this.contract.unlock(this.contract.interface.getSighash(functionName),{
        nonce
      });
  
      return hash
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }
}