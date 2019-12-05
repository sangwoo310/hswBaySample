import React, { Component } from 'react'
import { Table, Tabs } from 'antd'

import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import UTI from './UTI'
import UTM from './UTM'
import UTS from './UTS'
import { UTS_KEY, UTM_KEY, UTI_KEY } from '../../../../constants/Values'

const TabPane = Tabs.TabPane
const enhance = compose(
  setDisplayName({
    displayName: 'NFT',
  }),
  inject('nftStore'),
  injectIntl,
  withHandlers({}),
  lifecycle({
    async componentDidMount() {},
  }),
  observer
)

export default enhance(({ nftStore, intl }) => {
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
    nftStore.setActiveKey(activeKey)
    if (activeKey === UTS_KEY) {
      nftStore.getNftServants()
    } else if (activeKey === UTM_KEY) {
      nftStore.getNftMonsters()
    } else if (activeKey === UTI_KEY) {
      nftStore.getNftItems()
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
