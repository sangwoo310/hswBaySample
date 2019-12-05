import HeaderStore from '../layout/Header/HeaderStore'
import AuthenticationStore from '../service/Common/AuthenticationStore'
import EosioStore from '../service/Common/EosioStore'
import NewProductStore from '../service/Home/Product/NewProductStore'
import DeadlineProductStore from '../service/Home/Deadline/DeadlineProductStore'
import SpecialDealStore from '../service/Home/SpecialDeal/SpecialDealStore'
import NoticeStore from '../service/Notice/NoticeStore'
import ServantStore from '../service/Trade/Tabs/ServantStore'
import MonsterStore from '../service/Trade/Tabs/MonsterStore'
import ItemStore from '../service/Trade/Tabs/ItemStore'
import TradeStore from '../service/Trade/TradeStore'
import RankingStore from '../service/Home/Rank/RankingStore'

import MainBannerStore from '../service/Home/Banner/MainBannerStore'

import MyAccountMainStore from '../service/MyAccount/MyAccountMainStore'
import MyAccountStore from '../service/MyAccount/Tabs/MyAccount/MyAccountStore'
import NftStore from '../service/MyAccount/Tabs/NFT/NftStore'
import StakingStore from '../service/MyAccount/Tabs/Staking/StakingStore'
import HistoryStore from '../service/MyAccount/Tabs/History/HistoryStore'

const eosioStore = EosioStore()
const authenticationStore = AuthenticationStore(eosioStore)
const headerStore = HeaderStore()
const newProductStore = NewProductStore()
const deadlineStore = DeadlineProductStore()
const specialDealStore = SpecialDealStore()
const noticeStore = NoticeStore()
const servantStore = ServantStore(eosioStore, authenticationStore)
const monsterStore = MonsterStore(eosioStore, authenticationStore)
const itemStore = ItemStore(eosioStore, authenticationStore)
const tradeStore = TradeStore(servantStore, monsterStore, itemStore)
const rankingStore = RankingStore()

const mainBannerStore = MainBannerStore()
const myAccountStore = MyAccountStore(eosioStore, authenticationStore)
const nftStore = NftStore(eosioStore, authenticationStore)
const stakingStore = StakingStore(eosioStore, authenticationStore)
const historyStore = HistoryStore(eosioStore, authenticationStore)
const myAccountMainStore = MyAccountMainStore(stakingStore, myAccountStore, nftStore, historyStore)

export default {
  headerStore,
  authenticationStore,
  eosioStore,
  newProductStore,
  specialDealStore,
  noticeStore,
  deadlineStore,
  servantStore,
  monsterStore,
  itemStore,
  tradeStore,
  mainBannerStore,
  nftStore,
  nftStore,
  stakingStore,
  historyStore,
  myAccountStore,
  rankingStore,
  myAccountMainStore,
}
