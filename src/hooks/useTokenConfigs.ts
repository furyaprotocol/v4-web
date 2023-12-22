import { ENVIRONMENT_CONFIG_MAP } from '@/constants/networks';
import { FuryaChainAsset } from '@/constants/wallets';

import { useSelectedNetwork } from '@/hooks';

export const useTokenConfigs = (): {
  tokensConfigs: {
    [FuryaChainAsset.USDC]: {
      denom: string;
      name: string;
      decimals: number;
      gasDenom?: string;
    },
    [FuryaChainAsset.CHAINTOKEN]: {
      denom: string;
      name: string;
      decimals: number;
      gasDenom?: string;
    },
  };
  usdcDenom: string;
  usdcDecimals: number;
  usdcLabel: string;
  chainTokenDenom: string;
  chainTokenDecimals: number;
  chainTokenLabel: string;
} => {
  const { selectedNetwork } = useSelectedNetwork();
  const tokensConfigs = ENVIRONMENT_CONFIG_MAP[selectedNetwork].tokens;

  return { 
    tokensConfigs,
    usdcDenom: tokensConfigs[FuryaChainAsset.USDC].denom, 
    usdcDecimals: tokensConfigs[FuryaChainAsset.USDC].decimals, 
    usdcLabel: tokensConfigs[FuryaChainAsset.USDC].name,
    chainTokenDenom: tokensConfigs[FuryaChainAsset.CHAINTOKEN].denom,
    chainTokenDecimals: tokensConfigs[FuryaChainAsset.CHAINTOKEN].decimals, 
    chainTokenLabel: tokensConfigs[FuryaChainAsset.CHAINTOKEN].name,
  };
};
