import Abacus, { kollections } from '@dydxprotocol/v4-abacus';
import { OrderSide } from '@dydxprotocol/v4-client-js';
import { PositionSide, TradeTypes } from './trade';
import { STRING_KEYS } from './localization';

export type Nullable<T> = T | null | undefined;

// ------ V4 Protocols ------ //
export const AbacusAppConfig = Abacus.exchange.furya.abacus.state.manager.AppConfigs;
export const IOImplementations = Abacus.exchange.furya.abacus.utils.IOImplementations;
export const UIImplementations = Abacus.exchange.furya.abacus.utils.UIImplementations;
export type AbacusFURYAChainTransactionsProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.FURYAChainTransactionsProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusRestProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.RestProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusWebsocketProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.WebSocketProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusStateNotificationProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.StateNotificationProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusLocalizerProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.LocalizerProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusFormatterProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.FormatterProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusThreadingProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.ThreadingProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusFileSystemProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.FileSystemProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusTrackingProtocol = Omit<
  Abacus.exchange.furya.abacus.protocols.TrackingProtocol,
  '__doNotUseOrImplementIt'
>;

export type FileLocation = Abacus.exchange.furya.abacus.protocols.FileLocation;
export type ThreadingType = Abacus.exchange.furya.abacus.protocols.ThreadingType;
export const CoroutineTimer = Abacus.exchange.furya.abacus.utils.CoroutineTimer;

// ------ Networking ------ //
export const QueryType = Abacus.exchange.furya.abacus.protocols.QueryType;
const queryTypes = [...QueryType.values()] as const;
export type QueryTypes = (typeof queryTypes)[number];

export const TransactionType = Abacus.exchange.furya.abacus.protocols.TransactionType;
const transactionTypes = [...TransactionType.values()] as const;
export type TransactionTypes = (typeof transactionTypes)[number];

// ------ State ------
export type AbacusApiState = Abacus.exchange.furya.abacus.state.manager.ApiState;
export const AbacusApiStatus = Abacus.exchange.furya.abacus.state.manager.ApiStatus;
const abacusApiStatuses = [...AbacusApiStatus.values()];
export type AbacusApiStatuses = (typeof abacusApiStatuses)[number];
export const Changes = Abacus.exchange.furya.abacus.state.changes.Changes;
export type PerpetualStateChanges = Abacus.exchange.furya.abacus.state.changes.StateChanges;
export const AsyncAbacusStateManager =
  Abacus.exchange.furya.abacus.state.manager.AsyncAbacusStateManager;

// ------ Parsing Errors ------ //
export type ParsingError = Abacus.exchange.furya.abacus.responses.ParsingError;
export type ParsingErrors = kollections.List<ParsingError>;
export const ParsingErrorType = Abacus.exchange.furya.abacus.responses.ParsingErrorType;
const parsingErrorTypes = [...ParsingErrorType.values()] as const;
export type ParsingErrorTypes = (typeof parsingErrorTypes)[number];

// ------ Perpetuals/Markets ------ //
export type PerpetualState = Abacus.exchange.furya.abacus.output.PerpetualState;
export type MarketCandles = Abacus.exchange.furya.abacus.output.MarketCandles;
export type MarketOrderbook = Abacus.exchange.furya.abacus.output.MarketOrderbook;
export type MarketPerpetual = Abacus.exchange.furya.abacus.output.MarketPerpetual;
export type MarketStatus = Abacus.exchange.furya.abacus.output.MarketStatus;
export type MarketTrade = Abacus.exchange.furya.abacus.output.MarketTrade;
export type MarketTrades = kollections.List<Abacus.exchange.furya.abacus.output.MarketTrade>;
export type MarketsSummary = Partial<Abacus.exchange.furya.abacus.output.PerpetualMarketSummary>;
export type OrderbookLine = Abacus.exchange.furya.abacus.output.OrderbookLine;
export type PerpetualMarket = Abacus.exchange.furya.abacus.output.PerpetualMarket;
export type MarketHistoricalFunding = Abacus.exchange.furya.abacus.output.MarketHistoricalFunding;

// ------ Configs ------ //
export type Configs = Abacus.exchange.furya.abacus.output.Configs;
export type FeeDiscount = Abacus.exchange.furya.abacus.output.FeeDiscount;
export type FeeDiscountResources = Abacus.exchange.furya.abacus.output.FeeDiscountResources;
export type FeeTier = Abacus.exchange.furya.abacus.output.FeeTier;
export type FeeTierResources = Abacus.exchange.furya.abacus.output.FeeTierResources;
export type NetworkConfigs = Abacus.exchange.furya.abacus.output.NetworkConfigs;

// ------ Assets ------ //
export type Asset = Abacus.exchange.furya.abacus.output.Asset;
export type AssetResources = Abacus.exchange.furya.abacus.output.AssetResources;

// ------ Inputs ------ //
export type Inputs = Abacus.exchange.furya.abacus.output.input.Input;
export type TradeInputs = Abacus.exchange.furya.abacus.output.input.TradeInput;
export type ClosePositionInputs = Abacus.exchange.furya.abacus.output.input.ClosePositionInput;
export type TradeInputSummary = Abacus.exchange.furya.abacus.output.input.TradeInputSummary;
export type TransferInputs = Abacus.exchange.furya.abacus.output.input.TransferInput;
export type InputError = Abacus.exchange.furya.abacus.output.input.ValidationError;
export type TransferInputTokenResource =
  Abacus.exchange.furya.abacus.output.input.TransferInputTokenResource;
export type TransferInputChainResource =
  Abacus.exchange.furya.abacus.output.input.TransferInputChainResource;
export type SelectionOption = Abacus.exchange.furya.abacus.output.input.SelectionOption;
export const ErrorType = Abacus.exchange.furya.abacus.output.input.ErrorType;
export const InputSelectionOption = Abacus.exchange.furya.abacus.output.input.SelectionOption;

// ------ Wallet ------ //
export type Wallet = Abacus.exchange.furya.abacus.output.Wallet;
export type AccountBalance = Abacus.exchange.furya.abacus.output.AccountBalance;
export type Subaccount = Abacus.exchange.furya.abacus.output.Subaccount;
export type SubaccountPosition = Abacus.exchange.furya.abacus.output.SubaccountPosition;
export type SubaccountOrder = Abacus.exchange.furya.abacus.output.SubaccountOrder;
export type OrderStatus = Abacus.exchange.furya.abacus.output.input.OrderStatus;
export const AbacusOrderStatus = Abacus.exchange.furya.abacus.output.input.OrderStatus;
const abacusOrderStatuses = [...AbacusOrderStatus.values()] as const;
export type AbacusOrderStatuses = (typeof abacusOrderStatuses)[number];
export type SubaccountFills = Abacus.exchange.furya.abacus.output.SubaccountFill[];
export type SubaccountFill = Abacus.exchange.furya.abacus.output.SubaccountFill;
export type SubaccountFundingPayment = Abacus.exchange.furya.abacus.output.SubaccountFundingPayment;
export type SubaccountFundingPayments =
  Abacus.exchange.furya.abacus.output.SubaccountFundingPayment[];
export type SubaccountTransfer = Abacus.exchange.furya.abacus.output.SubaccountTransfer;
export type SubaccountTransfers = Abacus.exchange.furya.abacus.output.SubaccountTransfer[];

// ------ Historical PnL ------ //
export type SubAccountHistoricalPNL = Abacus.exchange.furya.abacus.output.SubaccountHistoricalPNL;
export type SubAccountHistoricalPNLs = Abacus.exchange.furya.abacus.output.SubaccountHistoricalPNL[];
export const HistoricalPnlPeriod = Abacus.exchange.furya.abacus.protocols.HistoricalPnlPeriod;
const historicalPnlPeriod = [...HistoricalPnlPeriod.values()] as const;
export type HistoricalPnlPeriods = (typeof historicalPnlPeriod)[number];

// ------ Transfer Items ------ //
export const TransferInputField = Abacus.exchange.furya.abacus.state.modal.TransferInputField;
const transferInputFields = [...TransferInputField.values()] as const;
export type TransferInputFields = (typeof transferInputFields)[number];

export const TransferType = Abacus.exchange.furya.abacus.output.input.TransferType;
const transferTypes = [...TransferType.values()] as const;
export type TransferTypes = (typeof transferTypes)[number];

// ------ Trade Items ------ //
export const TradeInputField = Abacus.exchange.furya.abacus.state.modal.TradeInputField;
const tradeInputFields = [...TradeInputField.values()] as const;
export type TradeInputFields = (typeof tradeInputFields)[number];

export type TradeState<T> = {
  current?: Nullable<T>;
  postAllOrders?: Nullable<T>;
  postOrder?: Nullable<T>;
};

export const ClosePositionInputField =
  Abacus.exchange.furya.abacus.state.modal.ClosePositionInputField;

const closePositionInputFields = [...ClosePositionInputField.values()] as const;
export type ClosePositionInputFields = (typeof closePositionInputFields)[number];

export type ValidationError = Abacus.exchange.furya.abacus.output.input.ValidationError;
export const TradeInputErrorAction = Abacus.exchange.furya.abacus.output.input.ErrorAction;
export type AbacusOrderTypes = Abacus.exchange.furya.abacus.output.input.OrderType;
export type AbacusOrderSides = Abacus.exchange.furya.abacus.output.input.OrderSide;
export const AbacusOrderType = Abacus.exchange.furya.abacus.output.input.OrderType;
export const AbacusOrderSide = Abacus.exchange.furya.abacus.output.input.OrderSide;

export const AbacusPositionSide = Abacus.exchange.furya.abacus.output.PositionSide;
export type AbacusPositionSides = Abacus.exchange.furya.abacus.output.PositionSide;

export type HumanReadablePlaceOrderPayload =
  Abacus.exchange.furya.abacus.state.manager.HumanReadablePlaceOrderPayload;
export type HumanReadableCancelOrderPayload =
  Abacus.exchange.furya.abacus.state.manager.HumanReadableCancelOrderPayload;
export type HumanReadableWithdrawPayload =
  Abacus.exchange.furya.abacus.state.manager.HumanReadableWithdrawPayload;
export type HumanReadableTransferPayload =
  Abacus.exchange.furya.abacus.state.manager.HumanReadableTransferPayload;

// ------ Helpers ------ //
export const AbacusHelper = Abacus.exchange.furya.abacus.utils.AbacusHelper;

export const RiskLevel = Abacus.exchange.furya.abacus.utils.RiskLevel;
const riskLevels = [...RiskLevel.values()] as const;
export type RiskLevels = (typeof riskLevels)[number];

// ------ Notifications ------ //
export type AbacusNotification = Abacus.exchange.furya.abacus.output.Notification;

// ------ Restrictions ------ //
export type UsageRestriction = Abacus.exchange.furya.abacus.output.UsageRestriction;
export const RestrictionType = Abacus.exchange.furya.abacus.output.Restriction;
const restrictionTypes = [...RestrictionType.values()] as const;
export type RestrictionTypes = (typeof restrictionTypes)[number];

// ------ Enum Conversions ------ //
type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

type ReadonlyKeysOf<T> = {
  [K in keyof T]: IfEquals<{ [_ in K]: T[K] }, { readonly [_ in K]: T[K] }, K, never>;
}[keyof T];

export type KotlinIrEnumValues<T> = Exclude<ReadonlyKeysOf<T>, 'Companion' | '$serializer'>;

export const ORDER_SIDES: Record<KotlinIrEnumValues<typeof AbacusOrderSide>, OrderSide> = {
  [AbacusOrderSide.buy.name]: OrderSide.BUY,
  [AbacusOrderSide.sell.name]: OrderSide.SELL,
  [AbacusOrderSide.buy.rawValue]: OrderSide.BUY,
  [AbacusOrderSide.sell.rawValue]: OrderSide.SELL,
};

export const POSITION_SIDES: Record<KotlinIrEnumValues<typeof AbacusPositionSide>, PositionSide> = {
  [AbacusPositionSide.LONG.name]: PositionSide.Long,
  [AbacusPositionSide.SHORT.name]: PositionSide.Short,
  [AbacusPositionSide.NONE.name]: PositionSide.None,
};

export const HISTORICAL_PNL_PERIODS: Record<
  KotlinIrEnumValues<typeof HistoricalPnlPeriod>,
  HistoricalPnlPeriods
> = {
  [HistoricalPnlPeriod.Period1d.name]: HistoricalPnlPeriod.Period1d,
  [HistoricalPnlPeriod.Period7d.name]: HistoricalPnlPeriod.Period7d,
  [HistoricalPnlPeriod.Period30d.name]: HistoricalPnlPeriod.Period30d,
  [HistoricalPnlPeriod.Period90d.name]: HistoricalPnlPeriod.Period90d,
};

export const ORDER_STATUS_STRINGS: Record<KotlinIrEnumValues<typeof AbacusOrderStatus>, string> = {
  [AbacusOrderStatus.open.name]: STRING_KEYS.OPEN_STATUS,
  [AbacusOrderStatus.open.rawValue]: STRING_KEYS.OPEN_STATUS,

  [AbacusOrderStatus.partiallyFilled.name]: STRING_KEYS.PARTIALLY_FILLED,
  [AbacusOrderStatus.partiallyFilled.rawValue]: STRING_KEYS.PARTIALLY_FILLED,

  [AbacusOrderStatus.filled.name]: STRING_KEYS.ORDER_FILLED,
  [AbacusOrderStatus.filled.rawValue]: STRING_KEYS.ORDER_FILLED,

  [AbacusOrderStatus.cancelled.name]: STRING_KEYS.CANCELED,
  [AbacusOrderStatus.cancelled.rawValue]: STRING_KEYS.CANCELED,

  [AbacusOrderStatus.canceling.name]: STRING_KEYS.CANCELING,
  [AbacusOrderStatus.canceling.rawValue]: STRING_KEYS.CANCELING,

  [AbacusOrderStatus.pending.name]: STRING_KEYS.PENDING,
  [AbacusOrderStatus.pending.rawValue]: STRING_KEYS.PENDING,

  [AbacusOrderStatus.untriggered.name]: STRING_KEYS.UNTRIGGERED,
  [AbacusOrderStatus.untriggered.rawValue]: STRING_KEYS.UNTRIGGERED,
};

export const TRADE_TYPES: Record<
  KotlinIrEnumValues<typeof AbacusOrderType>,
  Nullable<TradeTypes>
> = {
  [AbacusOrderType.limit.name]: TradeTypes.LIMIT,
  [AbacusOrderType.limit.rawValue]: TradeTypes.LIMIT,

  [AbacusOrderType.market.name]: TradeTypes.MARKET,
  [AbacusOrderType.market.rawValue]: TradeTypes.MARKET,

  [AbacusOrderType.stopLimit.name]: TradeTypes.STOP_LIMIT,
  [AbacusOrderType.stopLimit.rawValue]: TradeTypes.STOP_LIMIT,

  [AbacusOrderType.stopMarket.name]: TradeTypes.STOP_MARKET,
  [AbacusOrderType.stopMarket.rawValue]: TradeTypes.STOP_MARKET,

  [AbacusOrderType.takeProfitLimit.name]: TradeTypes.TAKE_PROFIT,
  [AbacusOrderType.takeProfitLimit.rawValue]: TradeTypes.TAKE_PROFIT,

  [AbacusOrderType.takeProfitMarket.name]: TradeTypes.TAKE_PROFIT_MARKET,
  [AbacusOrderType.takeProfitMarket.rawValue]: TradeTypes.TAKE_PROFIT_MARKET,

  [AbacusOrderType.liquidated.name]: null,
  [AbacusOrderType.liquidation.name]: null,

  [AbacusOrderType.liquidation.name]: null,
  [AbacusOrderType.liquidation.rawValue]: null,

  [AbacusOrderType.trailingStop.name]: null,
  [AbacusOrderType.trailingStop.rawValue]: null,
};

// Custom types involving Abacus

export type NetworkConfig = Partial<{
  indexerUrl: Nullable<string>;
  websocketUrl: Nullable<string>;
  validatorUrl: Nullable<string>;
  chainId: Nullable<string>;
  faucetUrl: Nullable<string>;
  USDC_DENOM: Nullable<string>;
  USDC_DECIMALS: Nullable<number>;
  USDC_GAS_DENOM: Nullable<string>;
  CHAINTOKEN_DENOM: Nullable<string>;
  CHAINTOKEN_DECIMALS: Nullable<number>;
}>;

export type ConnectNetworkEvent = CustomEvent<Partial<NetworkConfig>>;
