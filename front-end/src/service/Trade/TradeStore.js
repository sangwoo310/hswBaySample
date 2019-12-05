import { observable, action } from 'mobx'
import request from '../../utils/request'
import { API_TRADES, API_PRODUCTS, REQUEST_STATE } from '../../constants/Values'

export default (servantStore, monsterStore, itemStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      searchSuggests: [],
      searchResults: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      requestParams: {
        page: 1,
        perPage: 10,
        order: {
          name: 'id',
          sorting: 'desc', // or desc
        },
      },
      async searchProducts(query) {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(
            `${API_TRADES}?page=${this.requestParams.page}&perPage=${this.requestParams.perPage}&sort=${
              this.requestParams.order.name
            } ${this.requestParams.order.sorting}&q=${query}`
          )

          this.state = REQUEST_STATE.DONE
          this.searchResults = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async searchProductsSuggest(query) {
        this.state = REQUEST_STATE.LOADING
        try {
          const res = await request.get(`${API_PRODUCTS}?q=${query}`)

          this.state = REQUEST_STATE.DONE
          this.searchSuggests = res.data
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
      async fetchServants() {
        await servantStore.fetchServants()
      },
      async fetchMonsters() {
        await monsterStore.fetchMonsters()
      },
      async fetchItems() {
        await itemStore.fetchItems()
      },
      setPageParams(params) {
        this.requestParams = params
      },
      resetProductsSuggest() {
        this.searchSuggests = []
      },
    },
    {
      searchProducts: action,
      searchProductsSuggest: action,
      setPageParams: action,
      resetProductsSuggest: action,
      fetchServants: action,
      fetchMonsters: action,
      fetchItems: action,
    }
  )
