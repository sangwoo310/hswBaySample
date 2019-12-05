import React from 'react'
import { Tabs } from 'antd'
import { All, Announcement, Events } from './Tabs'
import { injectIntl } from 'react-intl'

import Banner from './Banner'
import './index.scss'

const TabPane = Tabs.TabPane

const getTabSource = intl => {
  return [
    // {
    //   tab: intl.formatMessage({ id: 'All' }),
    //   key: 'all',
    //   content: <All />,
    // },
    {
      tab: intl.formatMessage({ id: 'Announcement' }),
      key: 'announcement',
      content: <Announcement />,
    },
    // {
    //   tab: intl.formatMessage({ id: 'Events' }),
    //   key: 'events',
    //   content: <Events />,
    // },
  ]
}

export default injectIntl(({ intl }) => (
  <>
    <Banner />

    <Tabs className="notice-tabs" defaultActiveKey="announcement" size={'large'}>
      {getTabSource(intl).map(i => (
        <TabPane className="tab-content-base" tab={i.tab} key={i.key}>
          {i.content}
        </TabPane>
      ))}
    </Tabs>
  </>
))
