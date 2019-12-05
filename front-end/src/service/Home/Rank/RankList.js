import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { List, Avatar } from 'antd'
import { white } from 'ansi-colors'
import { observer, inject } from 'mobx-react'
import NumberFormat from 'react-number-format'
import { compose, setDisplayName, lifecycle } from 'recompose'

const enhance = compose(
  setDisplayName({
    displayName: 'UTS',
  }),
  inject('rankingStore'),
  injectIntl,
  lifecycle({
    async componentDidMount() {
      await this.props.rankingStore.fetchRankings()
    },
  }),
  observer
)

export default enhance(({ intl, rankingStore: { rankings } }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={rankings.contents.slice(0, 10)}
        renderItem={(item, index) => {
          const rankThumbStyle =
            index === 0 ? 'first-thumb' : index === 1 ? 'second-thumb' : index === 2 ? 'third-thumb' : 'rank-thumb-base'

          const basePoint = rankings.contents[0].balance
          const graphWidth = Math.floor((item.balance * 160) / basePoint)

          return (
            <List.Item style={{ borderBottom: '1px solid white', padding: '4px 0' }}>
              <div className="horizontal-flex-container">
                <div className={rankThumbStyle}>{index + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px', width: '120px' }}>
                  {item.account}
                </div>
                <div className="rank-qty-graph-container">
                  <div>{item.balance.toFixed(4)} EOS</div>
                  <div className="rank-graph-container" style={{ width: `${graphWidth}px` }} />
                </div>
              </div>
            </List.Item>
          )
        }}
      />
    </div>
  )
})
