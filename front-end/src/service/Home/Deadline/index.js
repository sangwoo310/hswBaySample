import React from 'react'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { Table } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router-dom'
import { format, differenceInMinutes } from 'date-fns'
import { REQUEST_STATE } from '../../../constants/Values'
import './index.scss'

const enhance = compose(
  setDisplayName({
    displayName: 'DeadlineProducts',
  }),
  inject('deadlineStore'),
  withRouter,
  lifecycle({
    async componentDidMount() {
      await this.props.deadlineStore.fetchNewProducts()
    },
  }),
  observer
)

export default injectIntl(
  enhance(({ deadlineStore: { deadlineProducts, state }, intl, history }) => {
    const columns = [
      {
        title: '',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        width: '48px',
        render: (text, record) => <img src={record.nft.gameInfo.imageUrl} alt="" height="48px" />,
      },
      {
        title: intl.formatMessage({ id: 'Product Name' }),
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => <div className="table-product-description-container">{record.nft.gameInfo.name}</div>,
      },
      {
        title: intl.formatMessage({ id: 'Deadline' }),
        dataIndex: 'deadline',
        key: 'deadline',
        defaultSortOrder: 'descend',
        render: (text, record) => {
          const diffMins = differenceInMinutes(new Date(record.bidEndTime), new Date())
          return (
            <span className="table-deadline-container">
              {parseInt(diffMins / 60) < 10 ? `0${parseInt(diffMins / 60)}` : parseInt(diffMins / 60)}:
              {diffMins % 60 < 10 ? `0${diffMins % 60}` : diffMins % 60}
            </span>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'Price(EOS)' }),
        dataIndex: 'price',
        key: 'price',
        width: '270px',
        defaultSortOrder: 'descend',
        render: (text, record) => (
          <div className="table-price-root-container">
            <div className="table-price-func-container">
              <FormattedMessage id="Buy now" />
              <br />
              <FormattedMessage id="Current Bid" />
            </div>
            <div className="table-price-seperator" />
            <div className="table-price-container">
              <div>
                <NumberFormat
                  value={record.maxPrice}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={4}
                  fixedDecimalScale={true}
                  suffix={' EOS'}
                />
              </div>
              <div className="table-current-bid-container">
                <NumberFormat
                  value={record.currentPrice}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={4}
                  fixedDecimalScale={true}
                  suffix={' EOS'}
                />
              </div>
            </div>
          </div>
        ),
      },
    ]

    return (
      <>
        <div className="deadline-container">
          <div className="deadline-title">{intl.formatMessage({ id: 'Deadline' })}</div>
          <Table
            loading={state === REQUEST_STATE.LOADING}
            pagination={false}
            columns={columns}
            dataSource={deadlineProducts.contents}
            size="default"
            onRowClick={row => {
              if (row.type === 'UTS') {
                history.push(`/trade/servant/${row.id}`)
              } else if (row.type === 'UTM') {
                history.push(`/trade/monster/${row.id}`)
              } else if (row.type === 'UTI') {
                history.push(`/trade/item/${row.id}`)
              }
            }}
          />
        </div>
      </>
    )
  })
)
