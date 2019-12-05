import React from 'react'
import { Table } from 'antd'
import { observer, inject } from 'mobx-react'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router-dom'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../constants/Values'
import './index.scss'

const enhance = compose(
  setDisplayName({
    displayName: 'NewProduct',
  }),
  inject('newProductStore'),
  withRouter,
  withHandlers({
    handleOnFetchNewProducts: ({ newProductStore }) => e => newProductStore.fetchNewProducts(),
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.newProductStore.fetchNewProducts()
    },
  }),
  observer
)

export default injectIntl(
  enhance(({ newProductStore: { newProducts, state }, intl, history }) => {
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
        <div className="new-product-container">
          <Table
            pagination={false}
            loading={state === REQUEST_STATE.LOADING}
            columns={columns}
            dataSource={newProducts.contents}
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
