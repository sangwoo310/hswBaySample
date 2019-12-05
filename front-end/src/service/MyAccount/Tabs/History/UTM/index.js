import React from 'react'
import NumberFormat from 'react-number-format'
import { Table, Modal, List, Form, Row, Col, Input, InputNumber, Select } from 'antd'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle, withState } from 'recompose'
import { injectIntl, FormattedMessage } from 'react-intl'
import { REQUEST_STATE, HISTORY_STATE } from '../../../../../constants/Values'
import { format } from 'date-fns'
import { handleEosErrorModal } from '../../../../Common/EosErrorHelper'

const Option = Select.Option

const enhance = compose(
  setDisplayName({
    displayName: 'utsHistory',
  }),
  inject('historyStore'),
  injectIntl,
  withState('historyState', 'setHistoryState', HISTORY_STATE.BIDDING),
  withHandlers({
    handleOnDataChange: ({ historyStore, historyState }) => async (pagination, filters, sorter) => {
      historyStore.setMonsterPageParams({
        page: pagination.current,
        perPage: pagination.pageSize,
        order: {
          name: sorter.field ? sorter.field : 'id',
          sorting: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : 'desc', // or desc
        },
      })
      await historyStore.fetchUTMHistory(historyState)
    },
    handleOnHistoryStateChange: ({ historyStore, setHistoryState }) => async value => {
      setHistoryState(value)
      const result = await historyStore.fetchUTMHistory(value)
      handleEosErrorModal(result)
    },
  }),
  lifecycle({
    async componentDidMount() {
      // await this.props.historyStore.fetchUTMHistory(HISTORY_STATE.BIDDING)
    },
  }),
  observer
)

const getColumns = (historyStore, intl, historyState) => {
  return [
    {
      title: '',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: '48px',
      render: (text, record) => (
        <img
          src={
            historyState === HISTORY_STATE.BIDDING ? record.trade.nft.gameInfo.imageUrl : record.nft.gameInfo.imageUrl
          }
          alt=""
          height="48px"
        />
      ),
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Product Name' }),
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (
        <div className="table-product-description-container">
          {historyState === HISTORY_STATE.BIDDING ? record.trade.nft.gameInfo.name : record.nft.gameInfo.name}
        </div>
      ),
      defaultSortOrder: 'descend',
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Date' }),
      dataIndex: 'created',
      key: 'created',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{format(new Date(record.created), 'hh:mm DD/MM/YYYY')}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Upgrade' }),
      dataIndex: 'upgrade',
      key: 'upgrade',
      defaultSortOrder: 'descend',
      render: (text, record) => (
        <div className="table-product-description-container">
          {historyState === HISTORY_STATE.BIDDING ? record.trade.nft.monsterUpgrade : record.nft.monsterUpgrade}
        </div>
      ),
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Level' }),
      dataIndex: 'level',
      key: 'level',
      defaultSortOrder: 'descend',
      render: (text, record) => (
        <div className="table-product-description-container">
          {historyState === HISTORY_STATE.BIDDING ? record.trade.nft.monsterLevel : record.nft.monsterLevel}
        </div>
      ),
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Grade' }),
      dataIndex: 'grade',
      key: 'grade',
      defaultSortOrder: 'descend',
      render: (text, record) => (
        <div className="table-product-description-container">
          {historyState === HISTORY_STATE.BIDDING ? record.trade.nft.monsterGrade : record.nft.monsterGrade}
        </div>
      ),
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Price(EOS)' }),
      dataIndex: 'bidEos',
      key: 'price',
      width: '270px',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div className="table-price-root-container">
          <div className="table-price-func-container">
            <FormattedMessage id="Price" />
          </div>
          <div className="table-price-seperator" />
          <div className="table-price-container">
            <div>
              <NumberFormat
                value={historyState === HISTORY_STATE.BIDDING ? record.bidEos : record.currentPrice}
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
    {
      title: intl.formatMessage({ id: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      defaultSortOrder: 'descend',
      render: (text, record) => {
        return record.state === HISTORY_STATE.BIDDING ? (
          <div className="table-history-bidding-state-container">{record.state}</div>
        ) : (
          <div className="table-history-selling-state-container">{record.state}</div>
        )
      },
      sorter: false,
    },
  ]
}

export default enhance(
  ({
    historyStore,
    historyStore: { state, utmListSelling, utmListBidding },
    intl,
    handleOnDataChange,
    handleOnHistoryStateChange,
    historyState,
  }) => {
    return (
      <div className="vertical-flex-container">
        <Select
          defaultValue={HISTORY_STATE.BIDDING}
          style={{ marginLeft: 'auto', width: 120, marginRight: '16px', marginTop: '16px', marginBottom: '16px' }}
          onChange={handleOnHistoryStateChange}
        >
          <Option value={HISTORY_STATE.BIDDING}>{HISTORY_STATE.BIDDING}</Option>
          <Option value={HISTORY_STATE.SELLING}>{HISTORY_STATE.SELLING}</Option>
        </Select>

        {historyState === HISTORY_STATE.BIDDING && (
          <Table
            loading={state === REQUEST_STATE.LOADING}
            pagination={{
              total: utmListBidding.totalElements,
              showSizeChanger: false,
              pageSize: utmListBidding.pageSize,
            }}
            columns={getColumns(historyStore, intl, historyState)}
            dataSource={utmListBidding.contents}
            onChange={handleOnDataChange}
            size="large"
          />
        )}

        {historyState === HISTORY_STATE.SELLING && (
          <Table
            loading={state === REQUEST_STATE.LOADING}
            pagination={{
              total: utmListSelling.totalElements,
              showSizeChanger: false,
              pageSize: utmListSelling.pageSize,
            }}
            columns={getColumns(historyStore, intl, historyState)}
            dataSource={utmListSelling.contents}
            onChange={handleOnDataChange}
            size="large"
          />
        )}
      </div>
    )
  }
)
