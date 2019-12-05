export const REQUEST_STATE = {
  LOADING: 'LOADING',
  DONE: 'DONE',
  ERROR: 'ERROR',
}

export const HISTORY_STATE = {
  SELLING: 'SELLING',
  BIDDING: 'BIDDING',
}

const protocol = 'https'

const host = 'rpc.eosys.io'
const port = 443
const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
// const host = 'jungle2.cryptolions.io'
// const chainId = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'

export const NETWORK = {
  blockchain: 'eos',
  protocol: protocol,
  host: host,
  port: port,
  chainId: chainId,
}

export const requiredFields = {
  accounts: [NETWORK],
}

export const CONFIG = {
  broadcast: true,
  sign: true,
  chainId: chainId,
}

export const supportLanguage = [{ locale: 'ko-KR', displayName: '한국어' }, { locale: 'en-US', displayName: 'ENGLISH' }]

export const SCATTER_RESULT = {
  SUCCESS: 0,
  LOCKED: 423,
  AUTH_ERROR: 402,
}

export const UNLIMITED_SERVANT_TABLE = 'tservant'
export const UNLIMITED_MONSTER_TABLE = 'tmonster'
export const UNLIMITED_ITEM_TABLE = 'tequipments'
export const UNLIMITED_GOLD_TABLE = 'accounts'

export const NFT_SERVANT_TABLE = 'utstokens'
export const NFT_MONSTER_TABLE = 'utmtokens'
export const NFT_ITEM_TABLE = 'utitokens'

export const SPECIAL_DEAL_TYPE_TODAY = 'today'
export const SPECIAL_DEAL_TYPE_WEEK = 'week'
export const SPECIAL_DEAL_TYPE_MONTH = 'month'

export const NOTICE_TYPE_ALL = 'all'
export const NOTICE_TYPE_ANNOUNCEMENT = 'announcement'
export const NOTICE_TYPE_EVENT = 'event'

const UNLIMITED_TOWER_SERVICE_ID = 1
export const API_BASE = '/api/v1'
export const API_SERVICES = `${API_BASE}/services`
export const API_TRADES = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/trades`
export const API_SPECIAL_DEAL = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/trades/special`
export const API_NEW_PRODUCT = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/trades/new`
export const API_DEADLINE_PRODUCT = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/trades/deadline`
export const API_PRODUCTS = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/products`
export const API_NOTICES = `${API_BASE}/notices`
export const API_RANKING = `${API_BASE}/services/${UNLIMITED_TOWER_SERVICE_ID}/rankings`
export const API_MY_HISTORIES = `${API_BASE}/trades`

export const BID_TYPE = {
  BID: 'bid',
  BUY_IT_NOW: 'buyitnow',
}

export const NFT_STATE = {
  STATE_SELLING: 'selling',
  STATE_IDLE: 'idle',
  STATE_DELETE: 'delete',
}

export const GAME_CONTRACT_STATE = {
  IN_GAME: 1,
  IN_NFT: 4,
}

export const UTS_KEY = 'UTS'
export const UTM_KEY = 'UTM'
export const UTI_KEY = 'UTI'
export const MY_ACCOUNT_KEY = 'My Account'
export const NFT_KEY = 'NFT'
export const STAKING_KEY = 'Staking'
export const HISTORY_KEY = 'History'
export const MIN_TRADE_PRICE = 0.0001
export const MIN_TRADE_FEE = 0.0001
export const TRADE_STEP = 0.0001
export const EXPORT_NFT_FEE = 0.05
