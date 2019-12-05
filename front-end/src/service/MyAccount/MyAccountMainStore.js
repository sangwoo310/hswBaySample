import { observable, action } from 'mobx'
import { MY_ACCOUNT_KEY, STAKING_KEY, NFT_KEY, HISTORY_KEY } from '../../constants/Values'

export default (stakingStore, myAccountStore, nftStore, historyStore) =>
  observable(
    {
      activeKey: MY_ACCOUNT_KEY,

      async refreshPage() {
        if (this.activeKey === MY_ACCOUNT_KEY) {
          await myAccountStore.getMyAccountData()
        } else if (this.activeKey === STAKING_KEY) {
          stakingStore.refreshPage()
        } else if (this.activeKey === NFT_KEY) {
          nftStore.refreshPage()
        } else if (this.activeKey === HISTORY_KEY) {
          historyStore.refreshPage()
        }
      },

      async setActiveKey(activeKey) {
        this.activeKey = activeKey
      },
    },
    {
      refreshPage: action,
      setActiveKey: action,
    }
  )
