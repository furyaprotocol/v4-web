import { type MenuItem } from '@/constants/menus';
import {
  AVAILABLE_ENVIRONMENTS,
  type FuryaNetwork,
  ENVIRONMENT_CONFIG_MAP,
} from '@/constants/networks';

export const useNetworks = (): MenuItem<FuryaNetwork>[] =>
  (AVAILABLE_ENVIRONMENTS.environments as FuryaNetwork[]).map((furyaNetwork) => ({
    key: furyaNetwork,
    label: ENVIRONMENT_CONFIG_MAP[furyaNetwork].name,
    value: furyaNetwork,
  }));
