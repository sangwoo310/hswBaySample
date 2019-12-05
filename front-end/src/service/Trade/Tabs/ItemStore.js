import { observable, action } from 'mobx'
import request from '../../../utils/request'
import { API_TRADES, API_PRODUCTS, REQUEST_STATE } from '../../../constants/Values'

export default (eosioStore, authenticationStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      isOnBidding: false,
      isOnBuyItNow: false,
      items: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      targetItem: { minPrice: 0, maxPrice: 0, currentPrice: 0 },
      requestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'bidEndTime',
          sorting: 'asc', // or desc
        },
      },
      async fetchItems() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_TRADES}?type=uti&page=${this.requestParams.page}&perPage=${this.requestParams.perPage}&sort=${
              this.requestParams.order.name
            } ${this.requestParams.order.sorting}`
          )

          this.state = REQUEST_STATE.DONE
          this.items = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },

      async fetchItem(id) {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(`${API_TRADES}/${id}`)

          this.state = REQUEST_STATE.DONE

          this.targetItem = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async bidItem(seller, trade_id, bid_price, bid_type) {
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
      async buyItNowItem(seller, trade_id, bid_price, bid_type) {
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
          throw err
        }
      },
      setPageParams(params) {
        this.requestParams = params
      },
    },
    {
      fetchItems: action,
      fetchItem: action,
      bidItem: action,
      buyItNowItem: action,
      setPageParams: action,
    }
  )
