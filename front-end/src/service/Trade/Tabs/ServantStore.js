import { observable, action } from 'mobx'
import request from '../../../utils/request'
import { API_TRADES, API_PRODUCTS, REQUEST_STATE } from '../../../constants/Values'
import { handleEosErrorModal } from '../../Common/EosErrorHelper'

export default (eosioStore, authenticationStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      isOnBidding: false,
      isOnBuyItNow: false,
      servants: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      targetServant: { minPrice: 0, maxPrice: 0, currentPrice: 0 },
      requestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'bidEndTime',
          sorting: 'asc', // or desc
        },
      },
      async fetchServants() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_TRADES}?type=uts&page=${this.requestParams.page}&perPage=${this.requestParams.perPage}&sort=${
              this.requestParams.order.name
            } ${this.requestParams.order.sorting}`
          )

          this.state = REQUEST_STATE.DONE
          this.servants = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },

      async fetchServant(id) {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(`${API_TRADES}/${id}`)

          this.state = REQUEST_STATE.DONE

          this.targetServant = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async bidServant(seller, trade_id, bid_price, bid_type) {
        this.isOnBidding = true
        try {
          return await this.bidCore(seller, trade_id, bid_price, bid_type)
        } catch (err) {
          console.error(err)
          return err
        } finally {
          this.isOnBidding = false
        }
      },
      async buyItNowServant(seller, trade_id, bid_price, bid_type) {
        this.isOnBuyItNow = true
        try {
          return await this.bidCore(seller, trade_id, bid_price, bid_type)
        } catch (err) {
          console.error(err)
          return err
        } finally {
          this.isOnBuyItNow = false
        }
      },
      async bidCore(seller, trade_id, bid_price, bid_type) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name
        const transactionOptions = { authorization: [`${accountName}@active`] }

        try {
          const result = await eosioStore.transfer(
            accountName,
            process.env.UNLIMITED_NFT_CONTRACT,
            `${bid_price.toFixed(4)} EOS`,
            `${bid_type}:${seller}:${trade_id}`,
            transactionOptions
          )

          if (result && result.transaction_id) {
            return true
          }

          return result
        } catch (err) {
          console.err(err)
          throw err
        }
      },
      setPageParams(params) {
        this.requestParams = params
      },
    },
    {
      fetchServants: action,
      fetchServant: action,
      bidServant: action,
      buyItNowServant: action,
      setPageParams: action,
    }
  )
