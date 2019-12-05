import { observable, action, computed } from 'mobx'
import request from '../../../utils/request'
import { REQUEST_STATE, API_SPECIAL_DEAL } from '../../../constants/Values'

export default () =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      todaySpecialDeals: {
        contents: [],
        page: 1,
        pageSize: 3,
        totalElements: 0,
        totalPages: 0,
      },
      weekSpecialDeals: {
        contents: [],
        page: 1,
        pageSize: 3,
        totalElements: 0,
        totalPages: 0,
      },
      monthSpecialDeals: {
        contents: [],
        page: 1,
        pageSize: 3,
        totalElements: 0,
        totalPages: 0,
      },
      async fetchSpecialDeals(type) {
        this.state = REQUEST_STATE.LOADING

        try {
          const res = await request.get(`${API_SPECIAL_DEAL}?type=${type}&page=1&perPage=3&sort=currentPrice desc`)

          if (type === 'today') {
            this.todaySpecialDeals = res.data
          } else if (type === 'week') {
            this.weekSpecialDeals = res.data
          } else if (type === 'month') {
            this.monthSpecialDeals = res.data
          }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
    },
    {
      fetchSpecialDeals: action,
    }
  )
