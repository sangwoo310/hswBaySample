import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Select } from 'antd'
import './index.scss'
import RankList from './RankList'

const Option = Select.Option

export default injectIntl(({ intl }) => (
  <div className="rank-container">
    <div className="rank-top-container">
      <div className="rank-title-container">{intl.formatMessage({ id: 'Rank' })}</div>

      <div className="rank-filter-container">
        {/* <Select style={{ width: '128px' }} defaultValue="Volume">
          <Option value="Volume">{intl.formatMessage({ id: 'Volume' })}</Option>
          <Option value="Something">Something</Option>
        </Select> */}
      </div>
    </div>
    <RankList />
  </div>
))
