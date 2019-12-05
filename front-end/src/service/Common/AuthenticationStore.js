import { observable, action, computed } from 'mobx'
import { SCATTER_RESULT } from '../../constants/Values'

export default eosioStore =>
  observable(
    {
      isAuth: false,
      accountInfo: null,
      get loginAccount() {
        return eosioStore.loginAccount
      },
      get availableEos() {
        return this.accountInfo.core_liquid_balance
      },
      get stakingEos() {
        return (
          (this.accountInfo.self_delegated_bandwidth
            ? parseFloat(this.accountInfo.self_delegated_bandwidth.cpu_weight.split(' ')[0])
            : 0) +
          (this.accountInfo.self_delegated_bandwidth
            ? parseFloat(this.accountInfo.self_delegated_bandwidth.net_weight.split(' ')[0])
            : 0)
        )
      },
      get availableCpu() {
        return this.accountInfo.cpu_limit.available
      },
      get availableRam() {
        return this.accountInfo.ram_quota - this.accountInfo.ram_usage
      },
      get availableBandwidth() {
        return this.accountInfo.net_limit.available
      },
      get totalCpu() {
        return this.accountInfo.cpu_limit.max
      },
      get totalRam() {
        return this.accountInfo.ram_quota
      },
      get totalBandwidth() {
        return this.accountInfo.net_limit.max
      },
      async loginWithScatter() {
        try {
          const result = await eosioStore.loginWithScatter()

          if (result === true) {
            this.checkLogin()
            this.isAuth = true
            return SCATTER_RESULT.SUCCESS
          } else {
            return result
          }
        } catch (e) {
          return e
        }
      },
      async checkLogin() {
        const loginAccount = eosioStore.loginAccount

        if (loginAccount) {
          this.isAuth = true
          await this.fetchAccountInfo()
        }
      },
      async logout() {
        await eosioStore.logout()
        this.accountInfo = null
        this.isAuth = false
      },
      async fetchAccountInfo() {
        const info = await eosioStore.getAccountInfo()

        if (info) {
          // debugger
          this.accountInfo = info
        } else {
          // debugger
        }
      },
    },
    {
      loginAccount: computed,
      availableEos: computed,
      stakingEos: computed,
      availableCpu: computed,
      availableRam: computed,
      availableBandwidth: computed,
      totalCpu: computed,
      totalRam: computed,
      totalBandwidth: computed,
      loginWithScatter: action,
      logout: action,
      fetchAccountInfo: action,
    }
  )
