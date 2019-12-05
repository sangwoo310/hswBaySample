import React from 'react'
import { Table } from 'antd'
import { differenceInMinutes } from 'date-fns'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'Servant',
  }),
  inject('servantStore'),
  injectIntl,
  withRouter,
  withHandlers({
    handleOnDataChange: ({ servantStore }) => async (pagination, filters, sorter) => {
      servantStore.setPageParams({
        page: pagination.current,
        perPage: pagination.pageSize,
        order: {
          name: sorter.field ? sorter.field : 'id',
          sorting: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : 'desc', // or desc
        },
      })

      await servantStore.fetchServants()
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.servantStore.fetchServants()
    },
  }),
  observer
)

const getColumns = intl => {
  return [
    {
      title: '',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: '48px',
      render: (text, record) => <img src={record.nft.gameInfo.imageUrl} alt="" height="48px" />,
    },
    {
      title: intl.formatMessage({ id: 'Product Name' }),
      dataIndex: 'nft.gameInfo.name',
      key: 'name',
      render: (text, record) => <div className="table-product-description-container">{record.nft.gameInfo.name}</div>,
      sortDirections: ['descend', 'ascend'],
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Type' }),
      dataIndex: 'nft.servantType',
      key: 'type',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{record.nft.servantType}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Level' }),
      dataIndex: 'nft.servantLevel',
      key: 'level',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{record.nft.servantLevel}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Deadline' }),
      dataIndex: 'bidEndTime',
      key: 'deadline',
      defaultSortOrder: 'ascend',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const diffMins = differenceInMinutes(new Date(record.bidEndTime), new Date())
        return (
          <span className="table-deadline-container">
            {parseInt(diffMins / 60) < 10 ? `0${parseInt(diffMins / 60)}` : parseInt(diffMins / 60)}:
            {diffMins % 60 < 10 ? `0${diffMins % 60}` : diffMins % 60}
          </span>
        )
      },
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Price(EOS)' }),
      dataIndex: 'currentPrice',
      key: 'price',
      width: '270px',
      sortDirections: ['descend', 'ascend'],
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
      sorter: true,
    },
  ]
}

export default enhance(({ servantStore: { servants, state }, intl, history, handleOnDataChange }) => (
  <div>
    <Table
      loading={state === REQUEST_STATE.LOADING}
      pagination={{
        total: servants.totalElements,
        showSizeChanger: true,
        pageSize: servants.pageSize,
      }}
      columns={getColumns(intl)}
      dataSource={servants.contents}
      onChange={handleOnDataChange}
      onRowClick={row => history.push(`/trade/servant/${row.id}`)}
      size="large"
    />
  </div>
))
