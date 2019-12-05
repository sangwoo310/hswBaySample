import React, { Fragment } from 'react'
import { differenceInMinutes } from 'date-fns'
import NumberFormat from 'react-number-format'
import { Row, Col, Table, Input } from 'antd'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Throttle } from 'react-throttle'
import queryString from 'query-string'
import { REQUEST_STATE } from '../../constants/Values'

const Search = Input.Search

const enhance = compose(
  setDisplayName({
    displayName: 'Search Result',
  }),
  inject('tradeStore'),
  injectIntl,
  withRouter,
  withHandlers({
    handleOnInputChange: ({ tradeStore }) => e => {
      if (e.target.value) {
        tradeStore.searchProductsSuggest(e.target.value)
      } else {
        tradeStore.resetProductsSuggest()
      }
    },
    handleOnSearch: ({ tradeStore }) => async query => {
      if (query) {
        await tradeStore.searchProducts(query)
      }
      tradeStore.resetProductsSuggest()
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { tradeStore } = this.props
      const keyword = this.props.location.search
      const values = queryString.parse(keyword)
      await tradeStore.searchProducts(values.q)
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
      title: intl.formatMessage({ id: 'Deadline' }),
      dataIndex: 'bidEndTime',
      key: 'deadline',
      defaultSortOrder: 'ascend',
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const diffMins = differenceInMinutes(new Date(record.bidEndTime), new Date())
        return (
          <span className="table-deadline-container">
            {parseInt(diffMins / 60)}:{diffMins % 60}
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

const SearchResult = enhance(
  ({
    match,
    history,
    intl,
    handleOnInputChange,
    handleOnSearch,
    tradeStore: {
      state,
      searchSuggests,
      searchResults: { contents, page, pageSize, totalElements, totalPages },
    },
  }) => {
    return (
      <>
        <div className="trade-search-bar-container">
          <Throttle time="500" handler="onChange">
            <Search
              style={{ width: '682px' }}
              size="large"
              placeholder={intl.formatMessage({ id: 'Input search text' })}
              onSearch={handleOnSearch}
              onChange={handleOnInputChange}
            />
          </Throttle>

          {searchSuggests.length > 0 && (
            <div className="search-suggest-box">
              {searchSuggests.map((item, idx) => {
                return (
                  <div className="search-suggest-result" key={idx} onClick={() => handleOnSearch(item)}>
                    {item}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="search-result-title">{intl.formatMessage({ id: 'Search Results' })}</div>
        <div className="search-result-root">
          <Table
            loading={state === REQUEST_STATE.LOADING}
            pagination={{
              total: totalElements,
              showSizeChanger: true,
              pageSize: pageSize,
            }}
            columns={getColumns(intl)}
            dataSource={contents}
            onRowClick={row => {
              if (row.type == 'UTS') {
                history.push(`/trade/servant/${row.id}`)
              } else if (row.type == 'UTM') {
                history.push(`/trade/monster/${row.id}`)
              } else if (row.type === 'UTI') {
                history.push(`/trade/item/${row.id}`)
              }
            }}
            size="large"
          />
        </div>
      </>
    )
  }
)

export default SearchResult
