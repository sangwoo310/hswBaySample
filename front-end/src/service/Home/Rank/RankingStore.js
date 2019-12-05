import { observable, action, computed } from 'mobx'
import request from '../../../utils/request'
import { REQUEST_STATE, API_RANKING } from '../../../constants/Values'

export default () =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      rankings: {
        contents: [],
        page: 1,
        pageSize: 3,
        totalElements: 0,
        totalPages: 0,
      },
      async fetchRankings() {
        this.state = REQUEST_STATE.LOADING

        try {
          const res = await request.get(API_RANKING)

          this.rankings = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
    },
    {
      fetchRankings: action,
    }
  )
