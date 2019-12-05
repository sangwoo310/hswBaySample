import { observable, action } from 'mobx'
import request from '../../utils/request'
import { API_NOTICES, REQUEST_STATE } from '../../constants/Values'

export default () =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      notices: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        expandedRowKeys: [],
      },
      announces: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        expandedRowKeys: [],
      },
      events: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        expandedRowKeys: [],
      },
      allRequestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'id',
          sorting: 'desc', // or desc
        },
      },
      announceRequestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'id',
          sorting: 'desc', // or desc
        },
      },
      eventRequestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'id',
          sorting: 'desc', // or desc
        },
      },
      async fetchNotices() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_NOTICES}?page=${this.allRequestParams.page}&perPage=${this.allRequestParams.perPage}&sort=${
              this.allRequestParams.order.name
            } ${this.allRequestParams.order.sorting}&lang=${localStorage.getItem('locale')}`
          )

          this.state = REQUEST_STATE.DONE
          this.notices = { ...this.notices, ...res.data }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async fetchAnnounces() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_NOTICES}?type=announcement&page=${this.announceRequestParams.page}&perPage=${
              this.announceRequestParams.perPage
            }&sort=${this.announceRequestParams.order.name} ${
              this.announceRequestParams.order.sorting
            }&lang=${localStorage.getItem('locale')}`
          )

          this.state = REQUEST_STATE.DONE
          this.announces = { ...this.announces, ...res.data }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async fetchEvents() {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_NOTICES}?type=event&page=${this.eventRequestParams.page}&perPage=${
              this.eventRequestParams.perPage
            }&sort=${this.eventRequestParams.order.name} ${
              this.eventRequestParams.order.sorting
            }&lang=${localStorage.getItem('locale')}`
          )

          this.state = REQUEST_STATE.DONE
          this.events = { ...this.events, ...res.data }
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      toggleExpandByKey(key) {
        const filter = this.notices.expandedRowKeys.filter(item => key === item)

        if (filter.length > 0) {
          this.notices.expandedRowKeys = []
        } else {
          this.notices.expandedRowKeys = [key]
        }
      },
      toggleExpandAnnouncementByKey(key) {
        const filter = this.announces.expandedRowKeys.filter(item => key === item)

        if (filter.length > 0) {
          this.announces.expandedRowKeys = []
        } else {
          this.announces.expandedRowKeys = [key]
        }
      },
      toggleExpandEventByKey(key) {
        const filter = this.events.expandedRowKeys.filter(item => key === item)

        if (filter.length > 0) {
          this.events.expandedRowKeys = []
        } else {
          this.events.expandedRowKeys = [key]
        }
      },
      setPageParams(params) {
        this.allRequestParams = params
      },
      setAnnouncePageParams(params) {
        this.announceRequestParams = params
      },
      setEventPageParams(params) {
        this.eventRequestParams = params
      },
    },
    {
      fetchNotices: action,
      fetchAnnounces: action,
      fetchEvents: action,
      setPageParams: action,
      setAnnouncePageParams: action,
      setEventPageParams: action,
      toggleExpandByKey: action,
      toggleExpandAnnouncementByKey: action,
      toggleExpandEventByKey: action,
    }
  )
