import { type FuryaNetwork, ENVIRONMENT_CONFIG_MAP } from '@/constants/networks';

export const validateAgainstAvailableEnvironments = (value: FuryaNetwork) =>
  Object.keys(ENVIRONMENT_CONFIG_MAP).includes(value);
