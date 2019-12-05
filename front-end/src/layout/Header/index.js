import React from 'react'
import { observer, inject } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import { compose, setDisplayName, withHandlers } from 'recompose'
import { Layout, Menu, Dropdown, Icon } from 'antd'
import MenuLink from '../../common/MenuLink'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getJsonFromUrl, getUrlFromJson } from '../../utils/Utils'
import { supportLanguage } from '../../constants/Values'
import preventDefault from 'preventdefault'
import './index.scss'
import { SCATTER_RESULT } from '../../constants/Values'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'

const { Header } = Layout
const location = window.location.pathname
const params = getJsonFromUrl()

const enhance = compose(
  setDisplayName({
    displayName: 'Header',
  }),
  inject('headerStore', 'authenticationStore', 'eosioStore'),
  withHandlers({
    handleOnSelectedKey: ({ headerStore }) => ({ item, key, selectedKeys }) => {
      headerStore.onSelected(key)
    },
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
    handleOnLogoutClick: ({ authenticationStore }) =>
      preventDefault(async e => {
        await authenticationStore.logout()
      }),
  }),
  observer
)

function getLocale() {
  return localStorage.getItem('locale')
}

const menu = (
  <Menu>
    {supportLanguage.map((lang, idx) => {
      params['lang'] = lang.locale
      return (
        <Menu.Item key={lang.displayName}>
          <a rel="noopener noreferrer" href={location + '?' + getUrlFromJson(params)}>
            {lang.displayName}
          </a>
        </Menu.Item>
      )
    })}
  </Menu>
)

const HeaderCore = injectIntl(
  enhance(
    ({
      authenticationStore,
      headerStore: { selectedKey },
      handleOnSelectedKey,
      handleOnLoginClick,
      handleOnLogoutClick,
      intl,
    }) => (
      <Header style={{ padding: 0, top: 0, position: 'sticky', zIndex: 1111 }}>
        <div className="logo-container">
          <NavLink style={{ color: '#000000', textDecoration: 'none' }} exact to="/">
            <FormattedMessage id="Logo Title" />
          </NavLink>
        </div>
        <Menu
          onSelect={handleOnSelectedKey}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="trade">
            <MenuLink
              isSelected={selectedKey === 'trade'}
              to="/trade/servant"
              text={intl.formatMessage({ id: 'Trade' })}
            />
          </Menu.Item>
          <Menu.Item key="myaccount">
            <MenuLink
              isSelected={selectedKey === 'myaccount'}
              to="/myaccount"
              text={intl.formatMessage({ id: 'My Account' })}
            />
          </Menu.Item>
          <Menu.Item key="notice">
            <MenuLink isSelected={selectedKey === 'notice'} to="/notice" text={intl.formatMessage({ id: 'Notice' })} />
          </Menu.Item>
          <Menu.Item key="lang" style={{ float: 'right', width: '130px' }}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                <span className="gnb-lang" style={{ marginRight: '7px' }}>
                  <FormattedMessage id={getLocale()} />
                </span>
                <Icon type="down" />
              </a>
            </Dropdown>
          </Menu.Item>

          {!authenticationStore.isAuth && (
            <Menu.Item key="signin" style={{ float: 'right', width: '130px' }}>
              <button className="gnb-sign-in-button gnb-sign-in-text" onClick={handleOnLoginClick}>
                <FormattedMessage id="Login" />
              </button>
            </Menu.Item>
          )}
          {authenticationStore.isAuth && (
            <Menu.Item key="signin" style={{ float: 'right', width: '130px' }}>
              <a className="ant-dropdown-link" href="#" onClick={handleOnLogoutClick}>
                <span className="gnb-lang" style={{ marginRight: '7px' }}>
                  <FormattedMessage id="Logout" />
                </span>
              </a>
            </Menu.Item>
          )}

          {/* {authenticationStore.isAuth && (
          <Menu.Item key="order" style={{ float: 'right' }}>
            <MenuLink isSelected={selectedKey === 'order'} to="/order" text="My Order" />
          </Menu.Item>
        )} */}
        </Menu>
      </Header>
    )
  )
)

export default HeaderCore
