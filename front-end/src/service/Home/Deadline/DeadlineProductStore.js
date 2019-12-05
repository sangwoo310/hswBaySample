import { observable, action, computed } from 'mobx'
import request from '../../../utils/request'
import { API_DEADLINE_PRODUCT, REQUEST_STATE } from '../../../constants/Values'

export default () =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      deadlineProducts: {
        contents: [],
        page: 0,
        pageSize: 1,
        totalElements: 0,
        totalPages: 0,
      },
      requestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'bidEndTime',
          sorting: 'asc', // or desc
        },
      },
      async fetchNewProducts() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_DEADLINE_PRODUCT}?page=${this.requestParams.page}&perPage=${this.requestParams.perPage}&sort=${
              this.requestParams.order.name
            } ${this.requestParams.order.sorting}`
          )
          this.state = REQUEST_STATE.DONE
          this.deadlineProducts = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
    },
    {
      fetchNewProducts: action,
    }
  )
