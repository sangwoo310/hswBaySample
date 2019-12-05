import { observable, action, computed } from 'mobx'
import request from '../../../utils/request'
import { API_NOTICES } from '../../../constants/Values'

export default () =>
  observable(
    {
      notice: {
        contents: [],
        page: 0,
        pageSize: 1,
        totalElements: 0,
        totalPages: 0,
      },
      // todo - fetch today, week, month
      async fetchNoticeBanner() {
        const res = await request.get(`${API_NOTICES}?page=1&perPage=1&lang=${localStorage.getItem('locale')}`)
        this.notice = res.data
      },
    },
    {
      fetchNoticeBanner: action,
    }
  )
