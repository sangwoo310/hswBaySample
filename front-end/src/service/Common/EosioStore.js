import { observable, action, computed } from 'mobx'
import { NETWORK, requiredFields } from '../../constants/Values'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'

ScatterJS.plugins(new ScatterEOS())

export default () =>
  observable(
    {
      scatter: null,
      eos: null,
      type: null,
      initEos() {
        const ENDPOINT = NETWORK.protocol + '://' + NETWORK.host + ':' + NETWORK.port
        this.eos = Eos({
          httpEndpoint: ENDPOINT,
          chainId: NETWORK.chainId,
        })
      },
      setScatter(scatter, type) {
        this.scatter = scatter
        this.type = type

        const eosOptions = { expireInSeconds: 60 }
        this.eos = scatter.eos(NETWORK, Eos, eosOptions)
      },
      get loginAccount() {
        if (this.scatter && this.scatter.identity) {
          try {
            return this.scatter.identity.accounts.find(x => x.blockchain === 'eos')
          } catch (err) {
            console.error(err)
          }
        }

        return null
      },
      async loginWithScatter() {
        if (this.scatter) {
          try {
            await this.scatter.getIdentity(requiredFields)
          } catch (err) {
            if (err.code && err.code > 0) {
              return err
            }
            console.error(err)
          }
          return true
        } else {
          // todo ?
          return false
        }
      },
      async logout() {
        if (this.scatter.forgetIdentity) {
          try {
            await this.scatter.forgetIdentity()
          } catch (err) {
            console.error(err)
          }

          this.initEos()
        }
      },
      async testJunglenet(contractName) {
        if (!this.eos) return ''

        return await this.eos.contract(contractName)
      },
      isExistScatter() {
        return this.scatter ? true : false
      },
      async getAccountInfo() {
        if (this.eos && this.loginAccount) {
          const account = this.loginAccount

          return await this.eos.getAccount({ account_name: account.name })
        }
        // debugger
        return null
      },
      async transfer(from, to, quantity, memo, transactionOptions) {
        if (this.type === 'extention') {
          return await this.eos.transfer(from, to, quantity, memo)
        } else {
          const eosOptions = { expireInSeconds: 60 }
          const eos = this.scatter.eos(NETWORK, Eos, eosOptions)

          return await eos.transfer(from, to, quantity, memo, transactionOptions)

          //const tokenDetails = { contract: 'eosio.token', symbol: 'EOS', memo: memo, decimals: 4 }

          //return await this.scatter.requestTransfer(NETWORK, to, quantity, tokenDetails)
        }
      },
      async createTransaction(cb) {
        if (!this.eos) {
          return
        }

        return await this.eos.transaction(cb)
      },
      async createTransactionWithContract(contract, cb) {
        if (!this.eos) {
          return
        }

        return await this.eos.transaction(contract, cb)
      },
      async sendTransaction(action) {
        if (!this.eos) {
          return
        }

        const eosOptions = { expireInSeconds: 60 }
        const eos = this.scatter.eos(NETWORK, Eos, eosOptions)
        return await eos.transaction({
          actions: [action],
        })
      },
      async getAbi(account_name) {
        if (!this.eos) {
          return
        }

        return await this.eos.getAbi(account_name)
      },
      async getInfoEos() {
        if (!this.eos) {
          return
        }

        return this.eos.getInfo({})
      },
      async getContract(contractName) {
        if (!this.eos) {
          return
        }

        return await this.eos.contract(contractName)
      },
      async getTableRows(query) {
        if (!this.eos) {
          return
        }

        return await this.eos.getTableRows(query)
      },
    },
    {
      loginAccount: computed,
      initEos: action,
      setScatter: action,
      loginWithScatter: action,
      logout: action,
      isExistScatter: action,
      getAccountInfo: action,
      transfer: action,
      createTransaction: action,
      createTransactionWithContract: action,
      sendTransaction: action,
      getAbi: action,
      getInfoEos: action,
      getContract: action,
      getTableRows: action,
    }
  )
