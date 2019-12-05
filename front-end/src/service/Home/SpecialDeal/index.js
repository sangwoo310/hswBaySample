import React from 'react'
import { Tabs, Table } from 'antd'
import { Month, Week, Today } from './Tabs'
import { FormattedMessage, injectIntl } from 'react-intl'
import './index.scss'

const TabPane = Tabs.TabPane

const SpecialDeal = injectIntl(({ intl }) => {
  const tabSource = [
    {
      tab: intl.formatMessage({ id: 'Today' }),
      key: 'today',
      content: <Today />,
    },
    {
      tab: intl.formatMessage({ id: 'Week' }),
      key: 'week',
      content: <Week />,
    },
    {
      tab: intl.formatMessage({ id: 'Month' }),
      key: 'month',
      content: <Month />,
    },
  ]

  return (
    <div className="special-deal-container">
      <Tabs className="home-tabs" style={{ height: '100%' }} defaultActiveKey="today" size={'large'}>
        {tabSource.map(i => (
          <TabPane tab={i.tab} key={i.key}>
            {i.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
})

export default SpecialDeal
