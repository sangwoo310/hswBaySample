import { observable, action } from 'mobx'
import { REQUEST_STATE, API_MY_HISTORIES, UTS_KEY, UTM_KEY, UTI_KEY, HISTORY_STATE } from '../../../../constants/Values'
import request from '../../../../utils/request'

export default (eosioStore, authenticationStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      activeKey: UTS_KEY,
      utmListBidding: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      utmListSelling: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      utiListBidding: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      utiListSelling: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      utsListBidding: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      utsListSelling: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      requestItemParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'created',
          sorting: 'desc', // or desc
        },
      },
      requestServantParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'created',
          sorting: 'desc', // or desc
        },
      },
      requestMonsterParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'created',
          sorting: 'desc', // or desc
        },
      },

      async fetchUTSHistory(historyState) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const res = await request.get(
            `${API_MY_HISTORIES}/${accountName}?token=uts&page=${this.requestItemParams.page}&perPage=${
              this.requestItemParams.perPage
            }&sort=${this.requestItemParams.order.name} ${this.requestItemParams.order.sorting}&type=${historyState}`
          )

          this.state = REQUEST_STATE.DONE

          const resData = {
            ...res.data,
            contents: res.data.contents.map((v, i) => {
              return { ...v, key: v.id }
            }),
          }

          if (historyState === HISTORY_STATE.BIDDING) {
            this.utsListBidding = resData
          } else {
            this.utsListSelling = resData
          }
        } catch (err) {
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },
      async fetchUTIHistory(historyState) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const res = await request.get(
            `${API_MY_HISTORIES}/${accountName}?token=uti&page=${this.requestItemParams.page}&perPage=${
              this.requestItemParams.perPage
            }&sort=${this.requestItemParams.order.name} ${this.requestItemParams.order.sorting}&type=${historyState}`
          )

          this.state = REQUEST_STATE.DONE

          const resData = {
            ...res.data,
            contents: res.data.contents.map((v, i) => {
              return { ...v, key: v.id }
            }),
          }

          if (historyState === HISTORY_STATE.BIDDING) {
            this.utiListBidding = resData
          } else {
            this.utiListSelling = resData
          }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },
      async fetchUTMHistory(historyState) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const res = await request.get(
            `${API_MY_HISTORIES}/${accountName}?token=utm&page=${this.requestItemParams.page}&perPage=${
              this.requestItemParams.perPage
            }&sort=${this.requestItemParams.order.name} ${this.requestItemParams.order.sorting}&type=${historyState}`
          )

          this.state = REQUEST_STATE.DONE

          const resData = {
            ...res.data,
            contents: res.data.contents.map((v, i) => {
              return { ...v, key: v.id }
            }),
          }

          if (historyState === HISTORY_STATE.BIDDING) {
            this.utmListBidding = resData
          } else {
            this.utmListSelling = resData
          }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },

      setServantPageParams(params) {
        this.requestServantParams = params
      },
      setMonsterPageParams(params) {
        this.requestMonsterParams = params
      },
      setItemPageParams(params) {
        this.requestItemParams = params
      },

      async refreshPage() {
        if (this.activeKey === UTS_KEY) {
          await this.fetchUTSHistory(HISTORY_STATE.BIDDING)
        } else if (this.activeKey === UTM_KEY) {
          await this.fetchUTMHistory(HISTORY_STATE.BIDDING)
        } else if (this.activeKey === UTI_KEY) {
          await this.fetchUTIHistory(HISTORY_STATE.BIDDING)
        }
      },

      setActiveKey(activeKey) {
        this.activeKey = activeKey
      },
    },
    {
      fetchUTIHistory: action,
      fetchUTMHistory: action,
      fetchUTSHistory: action,
      setItemPageParams: action,
      setServantPageParams: action,
      setMonsterPageParams: action,
      refreshPage: action,
      setActiveKey: action,
    }
  )
