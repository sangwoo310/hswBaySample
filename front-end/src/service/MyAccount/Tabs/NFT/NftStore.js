import { observable, action } from 'mobx'
import {
  REQUEST_STATE,
  UNLIMITED_SERVANT_TABLE,
  UNLIMITED_ITEM_TABLE,
  UNLIMITED_MONSTER_TABLE,
  NFT_SERVANT_TABLE,
  NFT_MONSTER_TABLE,
  NFT_ITEM_TABLE,
  API_PRODUCTS,
  API_MY_HISTORIES,
  UTS_KEY,
  UTM_KEY,
  UTI_KEY,
  NFT_STATE,
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

      nftServants: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      nftMonsters: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      nftItems: {
        contents: [],
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },

      async getNftServants(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingServant === true) return
        this.isFetchingServant = true
        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          const result = await getNftTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_NFT_CONTRACT,
            NFT_SERVANT_TABLE,
            -1
          )

          const itemDatas = await Promise.all(
            result.rows
              .filter(i => i.state != NFT_STATE.STATE_DELETE && i.owner === accountName)
              .map(async (item, idx) => {
                const result = await getTableData(
                  eosioStore,
                  item.master,
                  process.env.UNLIMITED_TOWER_CONTRACT,
                  UNLIMITED_SERVANT_TABLE,
                  1,
                  item.t_idx
                )

                let res = {}

                if (result.rows.length > 0) {
                  res = await request.get(`${API_PRODUCTS}/uts/${result.rows[0].servant.id}?type=game`)
                } else {
                  try {
                    res = await request.get(`${API_PRODUCTS}/uts/${item.t_idx}`)
                  } catch (err) {
                    console.error(err)
                  }
                }

                let tradeResult

                if (item.state === 'selling') {
                  tradeResult = await request.get(`${API_MY_HISTORIES}/${accountName}/uts/${item.t_idx}`)
                }

                return {
                  ...item,
                  ...result.rows[0],
                  servant: {
                    ...result.rows[0].servant,
                    ...res.data,
                  },
                  trade: tradeResult ? tradeResult.data : undefined,
                }
              })
          )

          const claimUts = await request.get(`${API_MY_HISTORIES}/${accountName}/uts/claims`)

          const utsList = claimUts.data.map((item, idx) => {
            return {
              owner: item.buyer,
              current_price: item.currentPrice,
              servant: {
                imageUrl: item.nft.gameInfo.imageUrl,
                name: item.nft.gameInfo.name,
                desc: item.nft.gameInfo.desc,
                type: item.nft.servantType,
                level: item.nft.servantLevel,
                grade: item.nft.grade,
                exp: item.nft.exp,
                status: {
                  basic_str: item.nft.basicStr,
                  basic_dex: item.nft.basicDex,
                  basic_int: item.nft.basicInt,
                },
              },
              state: item.state,
              trade: item,
            }
          })

          utsList.forEach(item => {
            const res = itemDatas.filter((itemData, index) => {
              if (itemData.idx === item.trade.idx) {
                itemDatas[index] = item
                return true
              }

              return false
            })

            if (res.length === 0) {
              itemDatas.unshift(item)
            }
          })

          itemDatas.map((item, idx) => (item.key = idx))
          this.nftServants.contents = itemDatas
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        } finally {
          this.isFetchingServant = false
        }
      },

      async getNftMonsters(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingMonster === true) return
        this.isFetchingMonster = true
        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          const result = await getNftTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_NFT_CONTRACT,
            NFT_MONSTER_TABLE,
            -1
          )

          const itemDatas = await Promise.all(
            result.rows
              .filter(i => i.state != NFT_STATE.STATE_DELETE && i.owner === accountName)
              .map(async (item, idx) => {
                const result = await getTableData(
                  eosioStore,
                  item.master,
                  process.env.UNLIMITED_TOWER_CONTRACT,
                  UNLIMITED_MONSTER_TABLE,
                  1,
                  item.t_idx
                )

                let res = {}

                if (result.rows.length > 0) {
                  res = await request.get(`${API_PRODUCTS}/utm/${result.rows[0].monster.id}?type=game`)
                } else {
                  try {
                    res = await request.get(`${API_PRODUCTS}/utm/${item.t_idx}`)
                  } catch (err) {
                    console.error(err)
                  }
                }

                let tradeResult

                if (item.state === 'selling') {
                  tradeResult = await request.get(`${API_MY_HISTORIES}/${accountName}/utm/${item.t_idx}`)
                }

                return {
                  ...item,
                  ...result.rows[0],
                  monster: {
                    ...result.rows[0].monster,
                    ...res.data,
                  },
                  trade: tradeResult ? tradeResult.data : undefined,
                }
              })
          )

          const claimUtm = await request.get(`${API_MY_HISTORIES}/${accountName}/utm/claims`)

          const utmList = claimUtm.data.map((item, idx) => {
            return {
              owner: item.buyer,
              current_price: item.currentPrice,
              monster: {
                imageUrl: item.nft.gameInfo.imageUrl,
                name: item.nft.gameInfo.name,
                desc: item.nft.gameInfo.desc,
                level: item.nft.servantLevel,
                grade: item.nft.grade,
                upgrade: item.nft.upgrade,
                type: item.nft.type,
                exp: item.nft.exp,
                status: {
                  basic_str: item.nft.basicStr,
                  basic_dex: item.nft.basicDex,
                  basic_int: item.nft.basicInt,
                },
              },
              state: item.state,
              trade: item,
            }
          })

          utmList.forEach(item => {
            const res = itemDatas.filter((itemData, index) => {
              if (itemData.idx === item.trade.idx) {
                itemDatas[index] = item
                return true
              }

              return false
            })

            if (res.length === 0) {
              itemDatas.unshift(item)
            }
          })

          itemDatas.map((item, idx) => (item.key = idx))
          this.nftMonsters.contents = itemDatas
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        } finally {
          this.isFetchingMonster = false
        }
      },

      async getNftItems(page) {
        if (!authenticationStore.accountInfo) {
          return
        }

        if (this.isFetchingItem === true) return
        this.isFetchingItem = true
        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          const result = await getNftTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_NFT_CONTRACT,
            NFT_ITEM_TABLE,
            -1
          )

          const itemDatas = await Promise.all(
            result.rows
              .filter(i => i.state != NFT_STATE.STATE_DELETE && i.owner === accountName)
              .map(async (item, idx) => {
                const result = await getTableData(
                  eosioStore,
                  item.master,
                  process.env.UNLIMITED_TOWER_CONTRACT,
                  UNLIMITED_ITEM_TABLE,
                  1,
                  item.t_idx
                )

                let res = {}

                if (result.rows.length > 0) {
                  res = await request.get(`${API_PRODUCTS}/uti/${result.rows[0].equipment.id}?type=game`)
                } else {
                  try {
                    res = await request.get(`${API_PRODUCTS}/uti/${item.t_idx}`)
                  } catch (err) {
                    console.error(err)
                  }
                }

                let tradeResult

                if (item.state === 'selling') {
                  tradeResult = await request.get(`${API_MY_HISTORIES}/${accountName}/uti/${item.t_idx}`)
                }

                return {
                  ...item,
                  ...result.rows[0],
                  equipment: {
                    ...result.rows[0].equipment,
                    ...res.data,
                  },
                  trade: tradeResult ? tradeResult.data : undefined,
                }
              })
          )

          const claimUti = await request.get(`${API_MY_HISTORIES}/${accountName}/uti/claims`)

          const utiList = claimUti.data.map((item, idx) => {
            return {
              owner: item.buyer,
              current_price: item.currentPrice,
              equipment: {
                imageUrl: item.nft.gameInfo.imageUrl,
                name: item.nft.gameInfo.name,
                desc: item.nft.gameInfo.desc,
                tier: item.nft.itemTier,
                grade: item.nft.itemGrade,
                upgrade: item.nft.itemUpgrade,
              },
              state: item.state,
              trade: item,
            }
          })

          utiList.forEach(item => {
            const res = itemDatas.filter((itemData, index) => {
              if (itemData.idx === item.trade.idx) {
                itemDatas[index] = item
                return true
              }

              return false
            })

            if (res.length === 0) {
              itemDatas.unshift(item)
            }
          })

          itemDatas.map((item, idx) => (item.key = idx))
          this.nftItems.contents = itemDatas
          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        } finally {
          this.isFetchingItem = false
        }
      },
      async backToGame(item, type) {
        if (!authenticationStore.accountInfo) {
          return
        }
        const accountName = authenticationStore.accountInfo.account_name
        this.state = REQUEST_STATE.LOADING

        try {
          const action = {
            account: process.env.UNLIMITED_NFT_CONTRACT,
            name: 'backtogame',
            authorization: [
              {
                actor: accountName,
                permission: 'active',
              },
            ],
            data: {
              from: accountName,
              sym: type,
              id: item.idx,
            },
          }

          await eosioStore.sendTransaction(action)

          if (type === UTS_KEY) {
            await this.getNftServants(1)
          } else if (type === UTM_KEY) {
            await this.getNftMonsters(1)
          } else if (type === UTI_KEY) {
            await this.getNftItems(1)
          }

          this.state = REQUEST_STATE.DONE

          return true
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },
      async regAuction(id, minPrice, maxPrice, type) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const action = {
            account: process.env.UNLIMITED_NFT_CONTRACT,
            name: 'regauction',
            authorization: [
              {
                actor: accountName,
                permission: 'active',
              },
            ],
            data: {
              seller: accountName,
              sym: type,
              token_id: id,
              min_price: `${minPrice.toFixed(4)} EOS`,
              max_price: `${maxPrice.toFixed(4)} EOS`,
            },
          }

          await eosioStore.sendTransaction(action)

          if (type === UTS_KEY) {
            await this.getNftServants(1)
          } else if (type === UTM_KEY) {
            await this.getNftMonsters(1)
          } else if (type === UTI_KEY) {
            await this.getNftItems(1)
          }

          this.state = REQUEST_STATE.DONE

          return true
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },
      async claimNft(nft) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const authorization = [
            {
              actor: accountName,
              permission: 'active',
            },
          ]

          const data = {
            actor: accountName === nft.trade.owner ? 'buyer' : 'seller',
            account: accountName,
            trade_id: nft.trade.contractTradeId,
          }

          const action = {
            account: process.env.UNLIMITED_NFT_CONTRACT,
            name: 'claim',
            authorization,
            data,
          }

          await eosioStore.sendTransaction(action)

          if (nft.type === UTS_KEY) {
            await this.getNftServants(1)
          } else if (nft.type === UTM_KEY) {
            await this.getNftMonsters(1)
          } else if (nft.type === UTI_KEY) {
            await this.getNftItems(1)
          }

          this.state = REQUEST_STATE.DONE

          return true
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
          return err
        }
      },

      async cancelTrade(tradeId, type) {
        if (!authenticationStore.accountInfo) {
          return
        }

        const accountName = authenticationStore.accountInfo.account_name

        this.state = REQUEST_STATE.LOADING

        try {
          const action = {
            account: process.env.UNLIMITED_NFT_CONTRACT,
            name: 'cancelauc',
            authorization: [
              {
                actor: accountName,
                permission: 'active',
              },
            ],
            data: {
              seller: accountName,
              trade_id: tradeId,
            },
          }

          await eosioStore.sendTransaction(action)

          if (type === UTS_KEY) {
            await this.getNftServants(1)
          } else if (type === UTM_KEY) {
            await this.getNftMonsters(1)
          } else if (type === UTI_KEY) {
            await this.getNftItems(1)
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
          await this.getNftServants()
        } else if (this.activeKey === UTM_KEY) {
          await this.getNftMonsters()
        } else if (this.activeKey === UTI_KEY) {
          await this.getNftItems()
        }
      },
      setActiveKey(activeKey) {
        this.activeKey = activeKey
      },
    },
    {
      getNftServants: action,
      getNftMonsters: action,
      getNftItems: action,
      backToGame: action,
      regAuction: action,
      claimNft: action,
      cancelTrade: action,
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

const getNftTableData = async (eosioStore, accountName, contract, table, limit) => {
  const query = {
    json: true,
    code: contract,
    scope: contract,
    table: table,
    table_key: 'byowner',
    key_type: 'i64',
    index_position: 3,
    limit: limit,
    reverse: true,
    upper_bound: null,
    lower_bound: accountName,
  }

  return await eosioStore.getTableRows(query)
}
