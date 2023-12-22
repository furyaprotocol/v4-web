export enum LocalStorageKey {
  // Onboarding / Accounts
  EvmAddress = 'furya.EvmAddress',
  FuryaAddress = 'furya.FuryaAddress',
  OnboardingSelectedWalletType = 'furya.OnboardingSelectedWalletType',
  WalletConnectionType = 'furya.WalletConnectionType',
  OnboardingHasAcknowledgedTerms = 'furya.OnboardingHasAcknowledgedTerms',
  EvmDerivedAddresses = 'furya.EvmDerivedAddresses',

  // Notifications
  Notifications = 'furya.Notifications',
  NotificationsLastUpdated = 'furya.NotificationsLastUpdated',
  PushNotificationsEnabled = 'furya.PushNotificationsEnabled',
  PushNotificationsLastUpdated = 'furya.PushNotificationsLastUpdated',
  TransferNotifications = 'furya.TransferNotifications',
  NotificationPreferences = 'furya.NotificationPreferences',

  // UI State
  LastViewedMarket = 'furya.LastViewedMarket',
  SelectedLocale = 'furya.SelectedLocale',
  SelectedNetwork = 'furya.SelectedNetwork',
  SelectedTheme = 'furya.SelectedTheme',
  SelectedTradeLayout = 'furya.SelectedTradeLayout',
  TradingViewChartConfig = 'furya.TradingViewChartConfig',
  HasSeenLaunchIncentives = 'furya.HasSeenLaunchIncentives',
}

export const LOCAL_STORAGE_VERSIONS = {
  [LocalStorageKey.EvmDerivedAddresses]: 'v2',
  [LocalStorageKey.NotificationPreferences]: 'v1',
  [LocalStorageKey.TransferNotifications]: 'v1',
  [LocalStorageKey.Notifications]: 'v1',
  // TODO: version all localStorage keys
};
