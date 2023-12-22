import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { LocalStorageKey } from '@/constants/localStorage';
import { ENVIRONMENT_CONFIG_MAP } from '@/constants/networks';

import {
  type FuryaAddress,
  type EvmAddress,
  WalletConnectionType,
  WalletType,
  wallets,
  FURYA_CHAIN_INFO,
} from '@/constants/wallets';

import { useLocalStorage } from '@/hooks/useLocalStorage';

import {
  useConnect as useConnectWagmi,
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  usePublicClient as usePublicClientWagmi,
  useWalletClient as useWalletClientWagmi,
} from 'wagmi';
import {
  useSuggestChainAndConnect as useConnectGraz,
  useAccount as useAccountGraz,
  useDisconnect as useDisconnectGraz,
  useOfflineSigners as useOfflineSignersGraz,
  WalletType as CosmosWalletType,
} from 'graz';

import { getSelectedNetwork } from '@/state/appSelectors';

import { resolveWagmiConnector } from '@/lib/wagmi';
import { getWalletConnection, parseWalletError } from '@/lib/wallet';
import { log } from '@/lib/telemetry';

import { useStringGetter } from './useStringGetter';

export const useWalletConnection = () => {
  const stringGetter = useStringGetter();

  // EVM wallet connection
  const [evmAddress, saveEvmAddress] = useLocalStorage<EvmAddress | undefined>({
    key: LocalStorageKey.EvmAddress,
    defaultValue: undefined,
  });
  const { address: evmAddressWagmi, isConnected: isConnectedWagmi } = useAccountWagmi();
  const publicClientWagmi = usePublicClientWagmi();
  const { data: signerWagmi } = useWalletClientWagmi();
  const { disconnectAsync: disconnectWagmi } = useDisconnectWagmi();

  useEffect(() => {
    // Cache last connected address
    if (evmAddressWagmi) saveEvmAddress(evmAddressWagmi);
  }, [evmAddressWagmi]);

  // Cosmos wallet connection
  const [furyaAddress, saveFuryaAddress] = useLocalStorage<FuryaAddress | undefined>({
    key: LocalStorageKey.FuryaAddress,
    defaultValue: undefined,
  });
  const { data: furyaAccountGraz, isConnected: isConnectedGraz } = useAccountGraz();
  const { signer: signerGraz } = useOfflineSignersGraz();
  const { disconnectAsync: disconnectGraz } = useDisconnectGraz();

  const furyaAddressGraz = furyaAccountGraz?.bech32Address;

  useEffect(() => {
    // Cache last connected address
    if (furyaAddressGraz) saveFuryaAddress(furyaAddressGraz as FuryaAddress);
  }, [furyaAddressGraz]);

  // Wallet connection

  const [walletType, setWalletType] = useLocalStorage<WalletType | undefined>({
    key: LocalStorageKey.OnboardingSelectedWalletType,
    defaultValue: undefined,
  });

  const [walletConnectionType, setWalletConnectionType] = useLocalStorage<
    WalletConnectionType | undefined
  >({
    key: LocalStorageKey.WalletConnectionType,
    defaultValue: undefined,
  });

  // Wallet connection

  const selectedNetwork = useSelector(getSelectedNetwork);
  const walletConnectConfig = ENVIRONMENT_CONFIG_MAP[selectedNetwork].wallets.walletconnect;
  const wagmiConnector = useMemo(
    () =>
      walletType && walletConnectionType
        ? resolveWagmiConnector({
            walletType,
            walletConnection: {
              type: walletConnectionType,
            },
            walletConnectConfig,
          })
        : undefined,
    [walletConnectConfig, walletType, walletConnectionType]
  );

  const { connectAsync: connectWagmi } = useConnectWagmi({ connector: wagmiConnector })
  const { suggestAndConnect: connectGraz } = useConnectGraz();

  const connectWallet = useCallback(
    async ({ walletType }: { walletType: WalletType }) => {
      const walletConnection = getWalletConnection({ walletType });

      try {
        if (!walletConnection) {
          throw new Error('Onboarding: No wallet connection found.');
        } else if (walletConnection.type === WalletConnectionType.CosmosSigner) {
          const cosmosWalletType = {
            [WalletType.Keplr as string]: CosmosWalletType.KEPLR,
          }[walletType];

          if (!cosmosWalletType) {
            throw new Error(
              `${stringGetter({ key: wallets[walletType].stringKey })} was not found.`
            );
          }

          if (!isConnectedGraz) {
            await connectGraz({
              chainInfo: FURYA_CHAIN_INFO,
              walletType: cosmosWalletType,
            });
          }
        } else {
          if (!isConnectedWagmi) {
            await connectWagmi({
              connector: resolveWagmiConnector({
                walletType,
                walletConnection,
                walletConnectConfig,
              }),
            });
          }
        }
      } catch (error) {
        throw Object.assign(
          new Error([error.message, error.cause?.message].filter(Boolean).join('\n')),
          {
            walletConnectionType: walletConnection?.type,
          }
        );
      }

      return {
        walletType,
        walletConnectionType: walletConnection.type,
      };
    },
    [isConnectedGraz, signerGraz, isConnectedWagmi, signerWagmi]
  );

  const disconnectWallet = useCallback(async () => {
    saveEvmAddress(undefined);
    saveFuryaAddress(undefined);

    if (isConnectedWagmi) await disconnectWagmi();
    if (isConnectedGraz) await disconnectGraz();
  }, [isConnectedGraz, isConnectedWagmi]);

  // Wallet selection

  const [selectedWalletType, setSelectedWalletType] = useState<WalletType | undefined>(walletType);
  const [selectedWalletError, setSelectedWalletError] = useState<string>();

  useEffect(() => {
    (async () => {
      setSelectedWalletError(undefined);

      if (selectedWalletType) {
        try {
          const { walletType, walletConnectionType } = await connectWallet({
            walletType: selectedWalletType,
          });

          setWalletType(walletType);
          setWalletConnectionType(walletConnectionType);
        } catch (error) {
          const { walletErrorType, message } = parseWalletError({
            error,
            stringGetter,
          });

          if (message) {
            log('useWalletConnection/connectWallet', error, { walletErrorType });
            setSelectedWalletError(message);
          }
        }
      } else {
        setWalletType(undefined);
        setWalletConnectionType(undefined);

        await disconnectWallet();
      }
    })();
  }, [selectedWalletType, signerWagmi, signerGraz]);

  const selectWalletType = async (walletType: WalletType | undefined) => {
    if (selectedWalletType) {
      setSelectedWalletType(undefined);
      await new Promise(requestAnimationFrame);
    }

    setSelectedWalletType(walletType);
  };

  return {
    // Wallet connection
    walletType,
    walletConnectionType,

    // Wallet selection
    selectWalletType,
    selectedWalletType,
    selectedWalletError,

    // Wallet connection (EVM)
    evmAddress,
    evmAddressWagmi,
    signerWagmi,
    publicClientWagmi,

    // Wallet connection (Cosmos)
    furyaAddress,
    furyaAddressGraz,
    signerGraz,
  };
};
