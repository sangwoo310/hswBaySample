import { observable, action } from 'mobx'
import {
  REQUEST_STATE,
  UNLIMITED_GOLD_TABLE,
  UNLIMITED_SERVANT_TABLE,
  UNLIMITED_ITEM_TABLE,
  UNLIMITED_MONSTER_TABLE,
  GAME_CONTRACT_STATE,
} from '../../../../constants/Values'

export default (eosioStore, authenticationStore) =>
  observable(
    {
      state: REQUEST_STATE.DONE,
      utg: {
        key: '1',
        img: '/img/utg.png',
        name: 'UTG',
        staking: 0,
        available: 0,
      },
      uts: {
        key: '2',
        img: '/img/uts.png',
        name: 'UTS',
        staking: 0,
        available: 0,
      },
      uti: {
        key: '3',
        img: '/img/uti.png',
        name: 'UTI',
        staking: 0,
        available: 0,
      },
      utm: {
        key: '4',
        img: '/img/utm.png',
        name: 'UTM',
        staking: 0,
        available: 0,
      },

      async getMyAccountData() {
        await authenticationStore.fetchAccountInfo(authenticationStore.accountInfo)

        if (!authenticationStore.accountInfo) {
          return
        }

        this.state = REQUEST_STATE.LOADING
        const accountName = authenticationStore.accountInfo.account_name

        try {
          // {"rows":[{"balance":"97000.0000 UTG"}],"more":false}
          this.utg.available = await getUtgCount(eosioStore, accountName)

          let servantResult = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_SERVANT_TABLE,
            -1
          )

          this.uts.staking = servantResult.rows.filter(i => i.servant.state === GAME_CONTRACT_STATE.IN_GAME).length
          this.uts.available = servantResult.rows.filter(i => i.servant.state === GAME_CONTRACT_STATE.IN_NFT).length

          let monsterResult = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_MONSTER_TABLE,
            -1
          )
          this.utm.staking = monsterResult.rows.filter(i => i.monster.state === GAME_CONTRACT_STATE.IN_GAME).length
          this.utm.available = monsterResult.rows.filter(i => i.monster.state === GAME_CONTRACT_STATE.IN_NFT).length

          let equipmentResult = await getTableData(
            eosioStore,
            accountName,
            process.env.UNLIMITED_TOWER_CONTRACT,
            UNLIMITED_ITEM_TABLE,
            -1
          )
          this.uti.staking = equipmentResult.rows.filter(i => i.equipment.state === GAME_CONTRACT_STATE.IN_GAME).length
          this.uti.available = equipmentResult.rows.filter(i => i.equipment.state === GAME_CONTRACT_STATE.IN_NFT).length

          this.state = REQUEST_STATE.DONE
        } catch (err) {
          console.error(err)
          this.state = REQUEST_STATE.ERROR
        }
      },
    },
    {
      getMyAccountData: action,
    }
  )

const getUtgCount = async (eosioStore, accountName) => {
  const utgQuery = {
    json: true,
    code: process.env.UNLIMITED_TOWER_CONTRACT,
    scope: accountName,
    table: UNLIMITED_GOLD_TABLE,
  }

  const unlimitedUtg = await eosioStore.getTableRows(utgQuery)
  // {"rows":[{"balance":"97000.0000 UTG"}],"more":false}
  return unlimitedUtg.rows && unlimitedUtg.rows[0] ? parseFloat(unlimitedUtg.rows[0].balance.split(' ')[0]) : 0
}

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
