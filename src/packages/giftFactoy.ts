import { TokenInfo, Wallet } from "@wallet/core";
import { AxiosInstance } from "axios";
import { Contract, ethers, Wallet as EtherWallets } from "ethers";
import { getGiftReward, getInsertedSlotReward } from "../api";
import { CONTRACT_NAME, ERC20ABI, GIFT_ABI } from '../constants'
import { ClaimRewardParams, ClaimRewardRespone, CreateGiftRespone, CreateGiftsParams, GetInsertedSlotParams, GiftConfigResponse, GiftFactoryEngine, InsertedSlotRepsonse, RawData, SetFee, SubmitRewardParams, WithdrawGiftRespone, WithdrawRewardParams } from "../types";
import { convertBalanceToWei } from "../utils";
import { GasSponsor } from "./gasSponsor";
import { GiftCore } from "./giftCore";

export class GiftFactory extends GiftCore{
  static instance: GiftFactory
  private chatApiInstance?: AxiosInstance
  sponsorGasContract?: GasSponsor

  constructor(params: GiftFactoryEngine){
    if(GiftFactory.instance){
      return GiftFactory.instance
    }

    super(CONTRACT_NAME.COIN98_GIFT_FACTORY_CONTRACT_ADDRESS, params?.privateKey, params.isDev)

    this.sponsorGasContract =  new GasSponsor(params?.privateKey ,params.isDev)
    this.chatApiInstance = params.chatApiInstance
    
    GiftFactory.instance = this

    return this
  }
  
  async createGifts(params: CreateGiftsParams): Promise<CreateGiftRespone>{
    const {wallet, rewardToken, totalReward, totalSlots, randomPercent, endTimestamp , baseMultiplier = 1, gasLimit, gasPrice} = params
    try {
      //@ts-expect-error
      const decimal = rewardToken.decimal || rewardToken.decimals || rewardToken?.info?.decimals || rewardToken?.info?.decimal
      const inputConfig = {
        rewardToken: rewardToken.address as string,
        totalReward: BigInt(convertBalanceToWei(totalReward.toString(),decimal)),
        totalSlots: BigInt(totalSlots),
        randomPercent: BigInt(Number(randomPercent) * 100),
        baseMultiplier: BigInt(baseMultiplier),
        //expand time 5m
        endTimestamp:  Math.floor(Date.now() / 1000) + Number(endTimestamp),
      }

      const signer = this.createSigner(wallet)
      if(!rewardToken.address){
        const responseGift = await this.sponsorGasContract?.createGifts({
          signer,
          giftContractAddress: this.contractAddress,
          inputConfig: {
            ...inputConfig,
            rewardToken: ethers.constants.AddressZero,
          },
          feeToken: ethers.constants.AddressZero,
          gasPrice,
          gasLimit
        })

        return responseGift as CreateGiftRespone
      }

      // await this.approveToken(rewardToken as TokenInfo, signer, totalReward.toString())

      const responseGift = await this.sponsorGasContract?.createGifts({
        signer,
        giftContractAddress: this.contractAddress,
        inputConfig,
        feeToken: ethers.constants.AddressZero,
        gasLimit,
        gasPrice
      })

      return responseGift as CreateGiftRespone
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  getRawDataCreateGift(params: CreateGiftsParams): RawData{
    const {wallet, rewardToken, totalReward, totalSlots, randomPercent, endTimestamp , baseMultiplier = 1} = params

    try {
      //@ts-expect-error
      const decimal = rewardToken.decimal || rewardToken.decimals || rewardToken?.info?.decimals || rewardToken?.info?.decimal

      const inputConfig = {
        rewardToken: rewardToken.address as string,
        totalReward: BigInt(convertBalanceToWei(totalReward.toString(), decimal)),
        totalSlots: BigInt(totalSlots),
        randomPercent: BigInt(randomPercent),
        baseMultiplier: BigInt(baseMultiplier),
        endTimestamp: Math.floor(Date.now() / 1000) + Number(endTimestamp),
      }

      const signer = this.createSigner(wallet)


      if(!rewardToken.address){
        const responseGiftRawData = this.sponsorGasContract?.getRawDataCreateGift({
          signer,
          giftContractAddress: this.contractAddress,
          inputConfig: {
            ...inputConfig,
            rewardToken: ethers.constants.AddressZero,
          },
          feeToken: ethers.constants.AddressZero,
        })

        return responseGiftRawData as RawData
      }

      // this.approveToken(rewardToken as TokenInfo, wallet, totalReward.toString())

      const responseGiftRawData = this.sponsorGasContract?.getRawDataCreateGift({
        signer,
        giftContractAddress: this.contractAddress,
        inputConfig,
        feeToken: ethers.constants.AddressZero,
      })

      return responseGiftRawData as RawData
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async claimGift(params: ClaimRewardParams): Promise<ClaimRewardRespone>{
    const { wallet, giftContractAddress, nodeId } = params

    const remainingReward = await getInsertedSlotReward({giftContractAddress, nodeId ,recipientAddress: wallet?.address, chatApiInstance: this.chatApiInstance })
    const response = await this.sponsorGasContract?.claimReward(params)

    return {...response, amount: remainingReward || 0} as ClaimRewardRespone
  }

  getRawDataClaimGift(params: ClaimRewardParams): RawData{
    const response =  this.sponsorGasContract?.getRawDataClaimGift(params)

    return response as RawData
  }

  async withdrawRemainingReward(params: WithdrawRewardParams): Promise<WithdrawGiftRespone>{
    const remainingReward = await getGiftReward(params.giftContractAddress, this.chatApiInstance as AxiosInstance)

    const response = await this.sponsorGasContract?.withdrawRemainingReward(params)

    return {...response, amount: remainingReward || 0} as WithdrawGiftRespone
  }

  getRawDataWithdrawReward(params: ClaimRewardParams): RawData{
    const response =  this.sponsorGasContract?.getRawDataWithdrawReward(params)

    return response as RawData
  }

  async submitRewardRecipients(params: SubmitRewardParams): Promise<string>{
    const { giftContractAddress, recipcients, privateKey, nodeIds }  = params
    try {
      const amdin = new EtherWallets(privateKey, this.provider)
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], amdin )

      // const nodeIdsBytes32 = nodeIds?.map((nodeId => ethers.utils.formatBytes32String(nodeId)))
      const transaction = await giftContract.connect(amdin as ethers.Wallet).submitRewardRecipients(recipcients, nodeIds,
        {
        gasLimit: 6500000
      }
      )

      const { transactionHash } = await transaction.wait()

      return transactionHash
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async submitRewardRecipientsV2(params: SubmitRewardParams): Promise<string>{
    const { giftContractAddress, recipcients, privateKey, nodeIds }  = params
    try {
      const amdin = new EtherWallets(privateKey, this.provider)
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], amdin )

      // const nodeIdsBytes32 = nodeIds?.map((nodeId => ethers.utils.formatBytes32String(nodeId)))
      const { hash } = await giftContract.connect(amdin as ethers.Wallet).submitRewardRecipients(recipcients, nodeIds,
        {
        gasLimit: 6500000
      }
      )

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
    const { tokenAddress = ethers.constants.AddressZero, isActivated = true, percentAmount = 0, feeRecipient = this.admin?.address } = params
    try {
      const unlockSetFee = await this.unlockFunction('setFee');
      
      if(unlockSetFee){
        const nonce = await this.getNonceAccount(this.admin?.address as string)
        const response = await this.contract.connect(this.admin as ethers.Wallet).setFee(tokenAddress, {
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
        const nonce = await this.getNonceAccount(this.admin?.address as string)

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
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], this.admin)
      const giftConfig = await giftContract.connect(this?.admin as ethers.Wallet).getGiftConfig()

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
    const { giftContractAddress, recipientAddress, nodeId } = params
    try {
      const giftContract = new ethers.Contract(giftContractAddress , GIFT_ABI['COIN98_GIFT_CONTRACT_ADDRESS'], this.admin)
      const slotConfig = await giftContract.connect(this.admin as ethers.Wallet).getInsertedSlot(recipientAddress, nodeId)

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
      const nonce = await this.getNonceAccount(this.admin?.address as string)
      
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

  async allowance(token:TokenInfo, wallet: Wallet){
    const signer = this.createSigner(wallet)
    const tokenContract = new Contract(token.address as string, ERC20ABI, signer)
    const amount = await tokenContract.allowance(signer.address, this.contractAddress)

    return amount
  }

  async approveToken(token:TokenInfo, wallet: Wallet, amount: string){
      const signer = this.createSigner(wallet)
      const tokenContract = new Contract(token.address as string, ERC20ABI, signer)
      const nonce = await this.getNonceAccount(signer.address)
      const response = await tokenContract.approve(this.contractAddress,String(convertBalanceToWei(amount, token.decimal)),{
        nonce
      })
      const {transactionHash} = await response.wait()
      
      return transactionHash
  }
}