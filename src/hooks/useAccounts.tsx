import { useCallback, useContext, createContext, useEffect, useState, useMemo } from 'react';

import { useDispatch } from 'react-redux';
import { AES, enc } from 'crypto-js';
import { NOBLE_BECH32_PREFIX, LocalWallet, type Subaccount } from '@dydxprotocol/v4-client-js';

import { OnboardingGuard, OnboardingState, type EvmDerivedAddresses } from '@/constants/account';
import { DialogTypes } from '@/constants/dialogs';
import { LocalStorageKey, LOCAL_STORAGE_VERSIONS } from '@/constants/localStorage';
import { FuryaAddress, EvmAddress, PrivateInformation } from '@/constants/wallets';

import { setOnboardingState, setOnboardingGuard } from '@/state/account';
import { forceOpenDialog } from '@/state/dialogs';

import abacusStateManager from '@/lib/abacus';
import { log } from '@/lib/telemetry';

import { useFuryaClient } from './useFuryaClient';
import { useLocalStorage } from './useLocalStorage';
import { useRestrictions } from './useRestrictions';
import { useWalletConnection } from './useWalletConnection';

const AccountsContext = createContext<ReturnType<typeof useAccountsContext> | undefined>(undefined);

AccountsContext.displayName = 'Accounts';

export const AccountsProvider = ({ ...props }) => (
  <AccountsContext.Provider value={useAccountsContext()} {...props} />
);

export const useAccounts = () => useContext(AccountsContext)!;

const useAccountsContext = () => {
  const dispatch = useDispatch();

  // Wallet connection
  const {
    walletType,
    walletConnectionType,
    selectWalletType,
    selectedWalletType,
    selectedWalletError,
    evmAddress,
    signerWagmi,
    publicClientWagmi,
    furyaAddress: connectedFuryaAddress,
    signerGraz,
  } = useWalletConnection();

  // EVM wallet connection
  const [previousEvmAddress, setPreviousEvmAddress] = useState(evmAddress);

  useEffect(() => {
    // Wallet accounts switched
    if (previousEvmAddress && evmAddress && evmAddress !== previousEvmAddress) {
      // Disconnect local wallet
      disconnectLocalFuryaWallet();

      // Forget EVM signature
      forgetEvmSignature(previousEvmAddress);
    }

    if (evmAddress) {
      abacusStateManager.setTransfersSourceAddress(evmAddress);
    }

    setPreviousEvmAddress(evmAddress);
  }, [evmAddress]);

  // EVM → Furya account derivation

  const [evmDerivedAddresses, saveEvmDerivedAddresses] = useLocalStorage({
    key: LocalStorageKey.EvmDerivedAddresses,
    defaultValue: {} as EvmDerivedAddresses,
  });

  useEffect(() => {
    // Clear data stored with deprecated LocalStorageKey
    if (evmDerivedAddresses.version !== LOCAL_STORAGE_VERSIONS[LocalStorageKey.EvmDerivedAddresses])
      saveEvmDerivedAddresses({});
  }, []);

  const saveEvmDerivedAccount = ({
    evmAddress,
    furyaAddress,
  }: {
    evmAddress: EvmAddress;
    furyaAddress?: FuryaAddress;
  }) => {
    saveEvmDerivedAddresses({
      ...evmDerivedAddresses,
      version: LOCAL_STORAGE_VERSIONS[LocalStorageKey.EvmDerivedAddresses],
      [evmAddress]: {
        ...evmDerivedAddresses[evmAddress],
        furyaAddress,
      },
    });
  };

  const saveEvmSignature = useCallback(
    (encryptedSignature: string) => {
      evmDerivedAddresses[evmAddress!].encryptedSignature = encryptedSignature;
      saveEvmDerivedAddresses(evmDerivedAddresses);
    },
    [evmDerivedAddresses, evmAddress]
  );

  const forgetEvmSignature = useCallback(
    (_evmAddress = evmAddress) => {
      if (_evmAddress) {
        delete evmDerivedAddresses[_evmAddress]?.encryptedSignature;
        saveEvmDerivedAddresses(evmDerivedAddresses);
      }
    },
    [evmDerivedAddresses, evmAddress]
  );

  const decryptSignature = (encryptedSignature: string | undefined) => {
    const staticEncryptionKey = import.meta.env.VITE_PK_ENCRYPTION_KEY;

    if (!staticEncryptionKey) throw new Error('No decryption key found');
    if (!encryptedSignature) throw new Error('No signature found');

    const decrypted = AES.decrypt(encryptedSignature, staticEncryptionKey);
    const signature = decrypted.toString(enc.Utf8);
    return signature;
  };

  // FuryaClient Onboarding & Account Helpers
  const { compositeClient, getWalletFromEvmSignature } = useFuryaClient();
  // Furya subaccounts
  const [furyaSubaccounts, setFuryaSubaccounts] = useState<Subaccount[] | undefined>();

  const { getSubaccounts } = useMemo(
    () => ({
      getSubaccounts: async ({ furyaAddress }: { furyaAddress: FuryaAddress }) => {
        try {
          const response = await compositeClient?.indexerClient.account.getSubaccounts(furyaAddress);
          setFuryaSubaccounts(response?.subaccounts);
          return response?.subaccounts ?? [];
        } catch (error) {
          // 404 is expected if the user has no subaccounts
          if (error.status === 404) {
            return [];
          } else {
            throw error;
          }
        }
      },
    }),
    [compositeClient]
  );

  // Furya wallet / onboarding state
  const [localFuryaWallet, setLocalFuryaWallet] = useState<LocalWallet>();
  const [hdKey, setHdKey] = useState<PrivateInformation>();

  const furyaAccounts = useMemo(() => localFuryaWallet?.accounts, [localFuryaWallet]);

  const furyaAddress = useMemo(
    () => localFuryaWallet?.address as FuryaAddress | undefined,
    [localFuryaWallet]
  );

  const setWalletFromEvmSignature = async (signature: string) => {
    const { wallet, mnemonic, privateKey, publicKey } = await getWalletFromEvmSignature({
      signature,
    });
    setLocalFuryaWallet(wallet);
    setHdKey({ mnemonic, privateKey, publicKey });
  };

  useEffect(() => {
    if (evmAddress) {
      saveEvmDerivedAccount({ evmAddress, furyaAddress });
    }
  }, [evmAddress, furyaAddress]);

  useEffect(() => {
    (async () => {
      if (connectedFuryaAddress && signerGraz) {
        dispatch(setOnboardingState(OnboardingState.WalletConnected));
        try {
          setLocalFuryaWallet(await LocalWallet.fromOfflineSigner(signerGraz));
          dispatch(setOnboardingState(OnboardingState.AccountConnected));
        } catch (error) {
          log('useAccounts/setLocalFuryaWallet', error);
        }
      } else if (evmAddress) {
        if (!localFuryaWallet) {
          dispatch(setOnboardingState(OnboardingState.WalletConnected));

          const evmDerivedAccount = evmDerivedAddresses[evmAddress];

          if (evmDerivedAccount?.encryptedSignature) {
            try {
              const signature = decryptSignature(evmDerivedAccount.encryptedSignature);

              await setWalletFromEvmSignature(signature);
              dispatch(setOnboardingState(OnboardingState.AccountConnected));
            } catch (error) {
              log('useAccounts/decryptSignature', error);
              forgetEvmSignature();
            }
          }
        } else {
          dispatch(setOnboardingState(OnboardingState.AccountConnected));
        }
      } else {
        disconnectLocalFuryaWallet();
        dispatch(setOnboardingState(OnboardingState.Disconnected));
      }
    })();
  }, [evmAddress, evmDerivedAddresses, signerWagmi, connectedFuryaAddress, signerGraz]);

  // abacus
  useEffect(() => {
    if (furyaAddress) abacusStateManager.setAccount(localFuryaWallet);
    else abacusStateManager.attemptDisconnectAccount();
  }, [localFuryaWallet]);

  useEffect(() => {
    const setNobleWallet = async () => {
      if (hdKey?.mnemonic) {
        const nobleWallet = await LocalWallet.fromMnemonic(hdKey.mnemonic, NOBLE_BECH32_PREFIX);
        abacusStateManager.setNobleWallet(nobleWallet);
      }
    };
    setNobleWallet();
  }, [hdKey?.mnemonic]);

  // clear subaccounts when no furyaAddress is set
  useEffect(() => {
    (async () => {
      if (!furyaAddress) {
        setFuryaSubaccounts(undefined);
      }
    })();
  }, [furyaAddress]);

  // Onboarding conditions
  const [hasAcknowledgedTerms, saveHasAcknowledgedTerms] = useLocalStorage({
    key: LocalStorageKey.OnboardingHasAcknowledgedTerms,
    defaultValue: false,
  });

  useEffect(() => {
    dispatch(
      setOnboardingGuard({
        guard: OnboardingGuard.hasAcknowledgedTerms,
        value: hasAcknowledgedTerms,
      })
    );
  }, [hasAcknowledgedTerms]);

  useEffect(() => {
    const hasPreviousTransactions = Boolean(furyaSubaccounts?.length);

    dispatch(
      setOnboardingGuard({
        guard: OnboardingGuard.hasPreviousTransactions,
        value: hasPreviousTransactions,
      })
    );
  }, [furyaSubaccounts]);

  // Restrictions
  const { isBadActor, sanctionedAddresses } = useRestrictions();

  useEffect(() => {
    if (
      furyaAddress &&
      (isBadActor ||
        sanctionedAddresses.has(furyaAddress) ||
        (evmAddress && sanctionedAddresses.has(evmAddress)))
    ) {
      dispatch(forceOpenDialog({ type: DialogTypes.RestrictedWallet }));
      disconnect();
    }
  }, [isBadActor, evmAddress, furyaAddress, sanctionedAddresses]);

  // Disconnect wallet / accounts
  const disconnectLocalFuryaWallet = () => {
    setLocalFuryaWallet(undefined);
    setHdKey(undefined);
  };

  const disconnect = async () => {
    // Disconnect local wallet
    disconnectLocalFuryaWallet();

    // Disconnect EVM wallet
    forgetEvmSignature();
    selectWalletType(undefined);
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
    signerWagmi,
    publicClientWagmi,

    // Wallet connection (Cosmos)
    signerGraz,

    // EVM → Furya account derivation
    setWalletFromEvmSignature,
    saveEvmSignature,
    forgetEvmSignature,

    // Furya accounts
    hdKey,
    localFuryaWallet,
    furyaAccounts,
    furyaAddress,

    // Onboarding state
    saveHasAcknowledgedTerms,

    // Disconnect wallet / accounts
    disconnect,

    // furyaClient Account methods
    getSubaccounts,
  };
};
