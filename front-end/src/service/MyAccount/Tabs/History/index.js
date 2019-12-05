import React, { Component } from 'react'
import { format } from 'date-fns'
import { Table, Tabs } from 'antd'

import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import UTI from './UTI'
import UTM from './UTM'
import UTS from './UTS'
import { HISTORY_STATE, UTS_KEY, UTM_KEY, UTI_KEY } from '../../../../constants/Values'

const TabPane = Tabs.TabPane
const enhance = compose(
  setDisplayName({
    displayName: 'History',
  }),
  inject('historyStore'),
  injectIntl,
  withHandlers({}),
  lifecycle({
    async componentDidMount() {},
  }),
  observer
)

export default enhance(({ historyStore, intl }) => {
  const tabSource = [
    {
      tab: intl.formatMessage({ id: UTS_KEY }),
      key: UTS_KEY,
      content: <UTS />,
    },
    {
      tab: intl.formatMessage({ id: UTM_KEY }),
      key: UTM_KEY,
      content: <UTM />,
    },
    {
      tab: intl.formatMessage({ id: UTI_KEY }),
      key: UTI_KEY,
      content: <UTI />,
    },
  ]

  const handleOnTabChange = activeKey => {
    historyStore.setActiveKey(activeKey)
    if (activeKey === UTS_KEY) {
      historyStore.fetchUTSHistory(HISTORY_STATE.BIDDING)
    } else if (activeKey === UTM_KEY) {
      historyStore.fetchUTMHistory(HISTORY_STATE.BIDDING)
    } else if (activeKey === UTI_KEY) {
      historyStore.fetchUTIHistory(HISTORY_STATE.BIDDING)
    }
  }

  return (
    <div>
      <Tabs className="myaccount-sub-tabs" defaultActiveKey={UTS_KEY} size={'large'} onChange={handleOnTabChange}>
        {tabSource.map(i => (
          <TabPane className="tab-content-base" tab={i.tab} key={i.key}>
            {i.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
})
