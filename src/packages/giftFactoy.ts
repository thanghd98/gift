import { Contract, ethers } from "ethers";
import { CONTRACT_NAME, ERC20ABI, GIFT_ABI } from '../constants'
import { ClaimRewardParams, ClaimRewardRespone, CreateGiftRespone, CreateGiftsParams, GetInsertedSlotParams, GiftConfigResponse, InsertedSlotRepsonse, SetFee, WithdrawGiftRespone, WithdrawRewardParams } from "../types";
import { convertBalanceToWei } from "../utils";
import { GasSponsor } from "./gasSponsor";
import { GiftCore } from "./giftCore";

export class GiftFactory extends GiftCore{
  sponsorGasContract: GasSponsor

  constructor(){
    super(CONTRACT_NAME.COIN98_GIFT_FACTORY_CONTRACT_ADDRESS)
    this.sponsorGasContract = new GasSponsor()
  }

  async createGifts(params: CreateGiftsParams): Promise<CreateGiftRespone>{
    const {wallet, rewardToken, totalReward, totalSlots, randomPercent, endTimestamp , baseMultiplier = 1} = params
    try {
      const inputConfig = {
        rewardToken: rewardToken.address as string,
        totalReward: BigInt(convertBalanceToWei(totalReward.toString(), rewardToken.decimal as number)),
        totalSlots: BigInt(totalSlots),
        randomPercent: BigInt(randomPercent),
        baseMultiplier: BigInt(baseMultiplier),
        endTimestamp
      }

      const signer = this.createSigner(wallet)
      if(!rewardToken.address){
        const responseGift = await this.sponsorGasContract.createGifts({
          signer,
          giftContractAddress: this.contractAddress,
          inputConfig: {
            ...inputConfig,
            rewardToken: ethers.constants.AddressZero,
          },
          feeToken: ethers.constants.AddressZero
        })

        return responseGift
      }

      // const feeConfig = await this.contract.getFee(ethers.constants.AddressZero);
      // const feeAmount = (BigInt(inputConfig.totalReward.toString()) * BigInt(feeConfig.percentAmount)) / BigInt(10000);
      // const totalRewards = BigInt(inputConfig.totalReward.toString());
      const tokenContract = new Contract(rewardToken.address as string, ERC20ABI, signer)
      const nonce = await this.getNonceAccount(signer.address)
      const response = await tokenContract.approve(this.contractAddress,String(convertBalanceToWei(totalReward.toString(), rewardToken.decimal)),{
        nonce
      })
       await response.wait()

      const responseGift = await this.sponsorGasContract.createGifts({
        signer,
        giftContractAddress: this.contractAddress,
        inputConfig,
        feeToken: ethers.constants.AddressZero
      })

      return responseGift
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async claimGift(params: ClaimRewardParams): Promise<ClaimRewardRespone>{
    const { wallet, giftContractAddress } = params

    const slotInfo = await this.getInsertedSlot({
      giftContractAddress: giftContractAddress,
      recipientAddress: wallet?.address
    })
    const response = await this.sponsorGasContract.claimReward(params)

    return {...response, amount: slotInfo.reward}
  }

  async withdrawRemainingReward(params: WithdrawRewardParams): Promise<WithdrawGiftRespone>{
    const giftInfo = await this.getGiftConfig(params.giftContractAddress)

    const response = await this.sponsorGasContract.withdrawRemainingReward(params)

    return {...response, amount: giftInfo.remainingReward}
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
    const { tokenAddress = ethers.constants.AddressZero, isActivated = true, percentAmount = 0, feeRecipient = this.signer.address } = params
    try {
      const unlockSetFee = await this.unlockFunction('setFee');
      
      if(unlockSetFee){
        const nonce = await this.getNonceAccount(this.signer.address)
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
        const nonce = await this.getNonceAccount(this.signer.address)

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

  async getGiftConfig(giftContractAddress: string): Promise<GiftConfigResponse>{
    try {
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], this.signer)
      const giftConfig = await giftContract.connect(this.signer).getGiftConfig()

      return {
        baseMultiplier: Number(giftConfig.baseMultiplier.toString()),
        endTimestamp:  Number(giftConfig.endTimestamp.toString()),
        meanRewardPerSlot:  Number(giftConfig.meanRewardPerSlot.toString()),
        randomPercent:  Number(giftConfig.randomPercent.toString()),
        remainingReward:  Number(giftConfig.remainingReward.toString()),
        remainingSlots:  Number(giftConfig.remainingSlots.toString()),
        rewardToken: giftConfig.rewardToken,
        totalReward: Number(giftConfig.totalReward.toString()),
        totalSlots: Number(giftConfig.totalSlots.toString()),
      }
    } catch (error) {
      throw new Error(error as unknown as string)      
    }
  }

  async getInsertedSlot(params: GetInsertedSlotParams): Promise<InsertedSlotRepsonse>{
    const { giftContractAddress, recipientAddress } = params
    try {
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], this.signer)
      const slotConfig = await giftContract.connect(this.signer).getInsertedSlot(recipientAddress)

      return {
        isClaimed: slotConfig.isClaimed,
        isInserted: slotConfig.isInserted,
        reward: Number(slotConfig.reward.toString()),
        slotNumber: Number(slotConfig.slotNumber.toString()),
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async unlockFunction(functionName: string): Promise<string>{
    try {
      const nonce = await this.getNonceAccount(this.signer.address)
      
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