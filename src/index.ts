import { Contract, ethers, providers, Wallet } from "ethers";
import { COIN98_GIFT_FACTORY_ABI, CONTRACT_NAME, GIFT_CONTRACT, PRIVATE_KEY } from './constants'
import { CHAIN_ID, RPC_URL } from "./constants";


export class GiftFactory{
  provider: ethers.providers.JsonRpcProvider
  contract: Contract
  signer: ethers.Wallet

  constructor(){
    this.provider = new providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
    this.signer =new Wallet(PRIVATE_KEY, this.provider)
    this.contract = new Contract(GIFT_CONTRACT(CONTRACT_NAME.COIN98_GIFT_FACTORY_CONTRACT_ADDRESS), COIN98_GIFT_FACTORY_ABI, this.signer)
  }


  async createGifts(){
    
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