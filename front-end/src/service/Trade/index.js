import React from 'react'
import { observer, inject } from 'mobx-react'
import { Link, Route, Switch, withRouter } from 'react-router-dom'
import { compose, setDisplayName, withHandlers, withState, lifecycle } from 'recompose'
import { Table, Tabs, Input } from 'antd'
import { Servant, Monster, Item } from './Tabs'
import { injectIntl } from 'react-intl'
import { Throttle } from 'react-throttle'
import ServantDetail from './Tabs/ServantDetail'
import MonsterDetail from './Tabs/MonsterDetail'
import ItemDetail from './Tabs/ItemDetail'
import './index.scss'

const Search = Input.Search
const TabPane = Tabs.TabPane
const enhance = compose(
  setDisplayName({
    displayName: 'Trade',
  }),
  withRouter,
  inject('tradeStore'),
  injectIntl,
  withHandlers({
    handleOnInputChange: ({ tradeStore }) => e => {
      if (e.target.value) {
        tradeStore.searchProductsSuggest(e.target.value)
      } else {
        tradeStore.resetProductsSuggest()
      }
    },
    handleOnSearch: ({ tradeStore, history }) => async query => {
      if (query) {
        history.push(`/trade/search?q=${query}`)
      }
      tradeStore.resetProductsSuggest()
    },
  }),

  observer
)

export default enhance(
  ({ tradeStore, intl, match, history, tradeStore: { searchSuggests }, handleOnInputChange, handleOnSearch }) => {
    const tabSource = [
      {
        tab: intl.formatMessage({ id: 'Servant' }),
        key: 'servant',
        content: <Servant handleOnTabChange={handleOnTabChange} />,
      },
      {
        tab: intl.formatMessage({ id: 'Monster' }),
        key: 'monster',
        content: <Monster />,
      },
      {
        tab: intl.formatMessage({ id: 'Item' }),
        key: 'item',
        content: <Item />,
      },
    ]

    const handleOnTabChange = activeKey => {
      history.push(`/trade/${activeKey}`)

      if (activeKey === 'uts') {
        tradeStore.fetchServants()
      } else if (activeKey === 'utm') {
        tradeStore.fetchMonsters()
      } else if (activeKey === 'uti') {
        tradeStore.fetchItems()
      }
    }

    return (
      <>
        <div className="trade-search-bar-container">
          <Throttle time="500" handler="onChange">
            <Search
              style={{ width: '682px' }}
              size="large"
              placeholder={intl.formatMessage({ id: 'Input search text' })}
              onSearch={handleOnSearch}
              onChange={handleOnInputChange}
            />
          </Throttle>

          {searchSuggests.length > 0 && (
            <div className="search-suggest-box">
              {searchSuggests.map((item, idx) => {
                return (
                  <div className="search-suggest-result" key={idx} onClick={() => handleOnSearch(item)}>
                    {item}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <Tabs
          className="trade-tabs"
          defaultActiveKey={match.params.tab}
          activeKey={match.params.tab}
          size={'large'}
          onChange={handleOnTabChange}
        >
          {tabSource.map(i => (
            <TabPane className="tab-content-base" tab={i.tab} key={i.key}>
              <div className="vertical-flex-container">
                {match.params.id ? (
                  i.key === 'servant' ? (
                    <ServantDetail match={match} />
                  ) : i.key === 'monster' ? (
                    <MonsterDetail match={match} />
                  ) : i.key === 'item' ? (
                    <ItemDetail match={match} />
                  ) : (
                    <div>Invalid Page</div>
                  )
                ) : (
                  <div>{i.content}</div>
                )}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </>
    )
  }
)
