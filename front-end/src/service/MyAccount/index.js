import React from 'react'
import { Table, Tabs } from 'antd'
import { MyAccount, Staking, NFT, History } from './Tabs'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { observer, inject } from 'mobx-react'
import preventDefault from 'preventdefault'
import Banner from './Banner'
import { injectIntl } from 'react-intl'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import {
  REQUEST_STATE,
  SCATTER_RESULT,
  MY_ACCOUNT_KEY,
  STAKING_KEY,
  NFT_KEY,
  HISTORY_KEY,
} from '../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'My Account',
  }),
  inject('myAccountMainStore', 'authenticationStore', 'eosioStore'),
  injectIntl,
  withHandlers({
    handleOnLoginClick: ({ authenticationStore, eosioStore }) =>
      preventDefault(async e => {
        const result = await authenticationStore.loginWithScatter()

        if (result) {
          if (result.code === SCATTER_RESULT.LOCKED || result.code === SCATTER_RESULT.AUTH_ERROR) {
            alert(result.message)
          }
        } else {
          ScatterJS.plugins(new ScatterEOS())

          ScatterJS.scatter
            .connect('NFTbay', { initTimeout: 5000 })
            .then(async connected => {
              if (!connected) {
                // todo - msg
                alert('Scatter does not exist.')
                return false
              }

              if (connected) {
                const scatter = ScatterJS.scatter
                // ScatterJS.scatter = null
                eosioStore.setScatter(scatter, 'desktop')
                authenticationStore.checkLogin()
                console.log('scatter is loaded...')

                const result = await authenticationStore.loginWithScatter()

                if (result) {
                  if (result.code === SCATTER_RESULT.LOCKED || result.code === SCATTER_RESULT.AUTH_ERROR) {
                    alert(result.message)
                  }
                }
              }
            })
            .catch(e => {
              if (!eosioStore.isExistScatter) {
                alert('Scatter does not exist.')
              }
            })
        }
      }),
  }),

  observer
)

const TabPane = Tabs.TabPane

const getTabSources = intl => {
  return [
    {
      tab: intl.formatMessage({ id: MY_ACCOUNT_KEY }),
      key: MY_ACCOUNT_KEY,
      content: <MyAccount />,
    },
    {
      tab: intl.formatMessage({ id: STAKING_KEY }),
      key: STAKING_KEY,
      content: <Staking />,
    },
    {
      tab: intl.formatMessage({ id: NFT_KEY }),
      key: NFT_KEY,
      content: <NFT />,
    },
    {
      tab: intl.formatMessage({ id: HISTORY_KEY }),
      key: HISTORY_KEY,
      content: <History />,
    },
  ]
}

export default enhance(({ authenticationStore, myAccountMainStore, intl, handleOnLoginClick }) => {
  const handleOnTabChange = async activeKey => {
    myAccountMainStore.setActiveKey(activeKey)
    await myAccountMainStore.refreshPage()
  }

  return (
    <>
      <Banner />
      <Tabs className="myaccount-tabs" defaultActiveKey={MY_ACCOUNT_KEY} size={'large'} onChange={handleOnTabChange}>
        {getTabSources(intl).map(i => (
          <TabPane className="tab-content-base" tab={i.tab} key={i.key}>
            {authenticationStore.isAuth ? (
              i.content
            ) : (
              <div className="login-box-container">
                <h2 className="login-box-message-container">Please Login First</h2>
                <div className="login-box-btn-container">
                  <div className="login-box-btn" onClick={handleOnLoginClick}>
                    Login
                  </div>
                </div>
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </>
  )
})
