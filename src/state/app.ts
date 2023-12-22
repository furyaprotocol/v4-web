import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AbacusApiState } from '@/constants/abacus';
import { LocalStorageKey } from '@/constants/localStorage';
import { DEFAULT_APP_ENVIRONMENT, type FuryaNetwork } from '@/constants/networks';

import { getLocalStorage } from '@/lib/localStorage';
import { validateAgainstAvailableEnvironments } from '@/lib/network';

export interface AppState {
  apiState: AbacusApiState | undefined;
  pageLoaded: boolean;
  selectedNetwork: FuryaNetwork;
}

const initialState: AppState = {
  apiState: undefined,
  pageLoaded: false,
  selectedNetwork: getLocalStorage({
    key: LocalStorageKey.SelectedNetwork,
    defaultValue: DEFAULT_APP_ENVIRONMENT,
    validateFn: validateAgainstAvailableEnvironments,
  }),
};

export const appSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    initializeLocalization: (state: AppState) => ({
      ...state,
      pageLoaded: true,
    }),
    initializeWebsocket: (state: AppState) => state,
    setApiState: (state: AppState, action: PayloadAction<AbacusApiState>) => ({
      ...state,
      apiState: action.payload,
    }),
    setSelectedNetwork: (state: AppState, action: PayloadAction<FuryaNetwork>) => ({
      ...state,
      selectedNetwork: action.payload,
    }),
  },
});

export const { initializeLocalization, initializeWebsocket, setApiState, setSelectedNetwork } =
  appSlice.actions;
