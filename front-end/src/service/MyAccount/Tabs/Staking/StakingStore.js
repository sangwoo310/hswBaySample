import { observable, action, transaction } from 'mobx'
import {
  REQUEST_STATE,
  UNLIMITED_SERVANT_TABLE,
  UNLIMITED_ITEM_TABLE,
  UNLIMITED_MONSTER_TABLE,
  NFT_SERVANT_TABLE,
  NFT_MONSTER_TABLE,
  NFT_ITEM_TABLE,
  API_PRODUCTS,
  UTS_KEY,
  UTM_KEY,
  UTI_KEY,
  GAME_CONTRACT_STATE,
  EXPORT_NFT_FEE,
} from '../../../../constants/Values'
import request from '../../../../utils/request'

export default (eosioStore, authenticationStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      activeKey: UTS_KEY,
      isFetchingServant: false,
      isFetchingMonster: false,
      isFetchingItem: false,

      servants: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      monsters: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      items: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },

      async getServants(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingServant == true) return
        this.isFetchingServant = true

        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          let result = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_SERVANT_TABLE,
            -1
          )

          result.rows = result.rows.filter(i => i.servant.state === GAME_CONTRACT_STATE.IN_GAME)

          this.servants.contents = await Promise.all(
            result.rows.map(async (item, idx) => {
              try {
                const res = await request.get(`${API_PRODUCTS}/uts/${item.servant.id}?type=game`)
                return {
                  ...item,
                  ...res.data,
                }
              } catch (err) {
                console.error(err)
              }

              return item
            })
          )

          this.servants.contents.map((item, idx) => (item.key = idx))
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        } finally {
          this.isFetchingServant = false
        }
      },

      async getMonsters(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingMonster === true) return
        this.isFetchingMonster = true
        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          const result = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_MONSTER_TABLE,
            -1
          )

          result.rows = result.rows.filter(i => i.monster.state === GAME_CONTRACT_STATE.IN_GAME)

          this.monsters.contents = await Promise.all(
            result.rows.map(async (item, idx) => {
              try {
                const res = await request.get(`${API_PRODUCTS}/utm/${item.monster.id}?type=game`)

                return {
                  ...item,
                  ...res.data,
                }
              } catch (err) {
                console.log(err)
              }

              return item
            })
          )

          this.monsters.contents.map((item, idx) => (item.key = idx))
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        } finally {
          this.isFetchingMonster = false
        }
      },

      async getItems(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingItem === true) return
        this.isFetchingItem = true
        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const result = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_ITEM_TABLE,
            -1
          )

          result.rows = result.rows.filter(i => i.equipment.state === GAME_CONTRACT_STATE.IN_GAME)

          this.items.contents = await Promise.all(
            result.rows.map(async (item, idx) => {
              try {
                const res = await request.get(`${API_PRODUCTS}/uti/${item.equipment.id}?type=game`)

                return {
                  ...item,
                  ...res.data,
                }
              } catch (err) {
                console.log(err)
              }

              return item
            })
          )

          this.items.contents.map((item, idx) => (item.key = idx))
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        } finally {
          this.isFetchingItem = false
        }
      },

      async exportNft(item, type) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING
        const fee = EXPORT_NFT_FEE
        const transactionOptions = { authorization: [`${accountName}@active`] }
        try {
          const result = await eosioStore.transfer(
            accountName,
            process.env.UNLIMITED_NFT_CONTRACT,
            `${fee.toFixed(4)} EOS`,
            `issue:${accountName}:${type}:${item.index}`,
            transactionOptions
          )

          if (type === UTS_KEY) {
            await this.getServants()
          } else if (type === UTM_KEY) {
            await this.getMonsters()
          } else if (type === UTI_KEY) {
            await this.getItems()
          }

          this.state = REQUEST_STATE.DONE
          return true
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },

      async refreshPage() {
        if (this.activeKey === UTS_KEY) {
          await this.getServants()
        } else if (this.activeKey === UTM_KEY) {
          await this.getMonsters()
        } else if (this.activeKey === UTI_KEY) {
          await this.getItems()
        }
      },
      setActiveKey(activeKey) {
        this.activeKey = activeKey
      },
    },
    {
      getServants: action,
      getItems: action,
      getMonsters: action,
      exportNft: action,
      refreshPage: action,
      setActiveKey: action,
    }
  )

const getTableData = async (eosioStore, accountName, contract, table, limit, upperBound) => {
  const query = {
    json: true,
    code: contract,
    scope: accountName,
    table: table,
    limit: limit,
    reverse: true,
    upper_bound: upperBound,
  }

  return await eosioStore.getTableRows(query)
}
