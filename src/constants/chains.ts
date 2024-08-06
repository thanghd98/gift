const isDev = process.env.NODE_ENV === 'development'

export const RPC_URL = isDev ? "https://rpc-testnet.viction.xyz" : "https://rpc-testnet.viction.xyz" 
export const CHAIN_ID = isDev ? 89 : 89