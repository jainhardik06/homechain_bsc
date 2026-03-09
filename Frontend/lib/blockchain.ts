import { defineChain } from 'viem';

/**
 * HomeChain Private Network Configuration
 * This is your Raspberry Pi's local Anvil/Hardhat instance
 * exposed via Ngrok tunnel for secure HTTPS access from anywhere
 * 
 * IMPORTANT: Update the RPC URL in the environment variables:
 * NEXT_PUBLIC_RPC_URL=https://overcivil-delsie-unvilified.ngrok-free.dev
 */

// Get RPC URL from environment, fallback to localhost for development
const getRpcUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'
  }
  // Client-side - always use environment variable
  return (
    process.env.NEXT_PUBLIC_RPC_URL ||
    'https://overcivil-delsie-unvilified.ngrok-free.dev'
  )
}

export const homeChain = defineChain({
  id: 31337,
  name: 'HomeChain Private',
  network: 'homechain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [getRpcUrl()],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local Anvil',
      url: 'http://localhost:3000',
    },
  },
  testnet: true,
});

/**
 * Network info for MetaMask setup
 * This is what gets added when users click "Connect Wallet"
 * 
 * IMPORTANT: The RPC URL here must match your Ngrok URL
 */
export const homeChainMetaMaskConfig = {
  chainId: '0x7a69', // 31337 in hex
  chainName: 'Webasthetic Home Chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  // Use environment variable or fallback to Ngrok URL
  rpcUrls: [
    process.env.NEXT_PUBLIC_RPC_URL ||
      'https://overcivil-delsie-unvilified.ngrok-free.dev',
  ],
  blockExplorerUrls: [],
};

/**
 * Contract function signatures for type safety
 */
export const CONTRACT_FUNCTIONS = {
  OPERATE_DEVICE: 'operateDevice',
  CREATE_ROOM: 'createRoom',
  DEFINE_DEVICE: 'defineDevice',
  GRANT_ACCESS: 'grantAccess',
  REVOKE_ACCESS: 'revokeAccess',
  GET_DEVICE_STATUS: 'getDeviceStatus',
  GET_ROOM_COUNT: 'roomCount',
} as const;
