import React from 'react'
import { Table } from 'antd'
import { differenceInMinutes } from 'date-fns'
import NumberFormat from 'react-number-format'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'Monster',
  }),
  inject('monsterStore'),
  injectIntl,
  withRouter,
  withHandlers({
    handleOnDataChange: ({ monsterStore }) => async (pagination, filters, sorter) => {
      monsterStore.setPageParams({
        page: pagination.current,
        perPage: pagination.pageSize,
        order: {
          name: sorter.field ? sorter.field : 'id',
          sorting: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : 'desc', // or desc
        },
      })

      await monsterStore.fetchMonsters()
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.monsterStore.fetchMonsters()
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
      title: intl.formatMessage({ id: 'Upgrade' }),
      dataIndex: 'nft.monsterUpgrade',
      key: 'upgrade',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{record.nft.monsterUpgrade}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Level' }),
      dataIndex: 'nft.monsterLevel',
      key: 'level',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{record.nft.monsterLevel}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Grade' }),
      dataIndex: 'nft.monsterGrade',
      key: 'grade',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{record.nft.monsterGrade}</span>,
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

export default enhance(({ monsterStore: { monsters, state }, intl, history, handleOnDataChange }) => {
  return (
    <>
      <div>
        <Table
          loading={state === REQUEST_STATE.LOADING}
          pagination={{
            total: monsters.totalElements,
            showSizeChanger: true,
            pageSize: monsters.pageSize,
          }}
          columns={getColumns(intl)}
          dataSource={monsters.contents}
          onChange={handleOnDataChange}
          onRowClick={row => history.push(`/trade/monster/${row.id}`)}
          size="large"
        />
      </div>
    </>
  )
})
