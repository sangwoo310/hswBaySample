import React from 'react'
import { Table } from 'antd'
import './index.scss'
import NumberFormat from 'react-number-format'
import { observer, inject } from 'mobx-react'
import { autorun } from 'mobx'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'MyAccountInfo',
  }),
  inject('authenticationStore', 'myAccountStore', 'nftStore'),
  injectIntl,
  withHandlers({
    handleOnDataChange: ({}) => async (pagination, filters, sorter) => {
      // servantStore.setPageParams({
      //   page: pagination.current,
      //   perPage: pagination.pageSize,
      //   order: {
      //     name: sorter.field ? sorter.field : 'id',
      //     sorting: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : 'desc', // or desc
      //   },
      // })
      // await servantStore.fetchServants()
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.myAccountStore.getMyAccountData()
    },
  }),
  observer
)

const getColumn = intl => {
  return [
    {
      title: '',
      dataIndex: 'img',
      key: 'img',
      width: '48px',
      render: (text, record) => <img src={record.img} alt="" height="48px" />,
    },
    {
      title: intl.formatMessage({ id: 'Name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <div className="table-product-description-container">{record.name}</div>,
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a.name.length < b.name.length) {
          return -1
        }
        if (a.name.length > b.name.length) {
          return 1
        }
        return 0
      },
    },
    {
      title: intl.formatMessage({ id: 'Staking' }),
      dataIndex: 'staking',
      key: 'staking',
      defaultSortOrder: 'descend',
      render: (text, record) => <div>{record.staking}</div>,
      sorter: (a, b) => a.staking - b.staking,
    },
    {
      title: intl.formatMessage({ id: 'Available' }),
      dataIndex: 'available',
      key: 'available',
      defaultSortOrder: 'descend',
      render: (text, record) => <div>{record.available}</div>,
      sorter: (a, b) => a.available - b.available,
    },
  ]
}

export default enhance(
  ({ authenticationStore, authenticationStore: { accountInfo }, myAccountStore: { utg, uts, uti, utm }, intl }) => (
    <div>
      <div className="token-summary my-account">
        <div className="account-name">{accountInfo && accountInfo.account_name}</div>
        <div style={{ width: '386px', float: 'right', paddingTop: '16px' }}>
          <div className="staking">{intl.formatMessage({ id: 'Staking' })}</div>
          <div className="staking-font">
            <NumberFormat
              value={accountInfo && authenticationStore.stakingEos ? authenticationStore.stakingEos : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={4}
              fixedDecimalScale={true}
              suffix={' EOS'}
            />
          </div>
          <div className="staking">{intl.formatMessage({ id: 'My Wallet' })}</div>
          <div className="staking-font">
            <NumberFormat
              value={accountInfo && authenticationStore.availableEos ? authenticationStore.availableEos : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={4}
              fixedDecimalScale={true}
              suffix={' EOS'}
            />
          </div>
        </div>
        <div className="line" />
        <div className="resource">
          <div className="resource-title">{intl.formatMessage({ id: 'CPU' })}</div>
          <div className="resource-value">
            <NumberFormat
              value={accountInfo && authenticationStore.availableCpu ? authenticationStore.availableCpu / 1000 : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' ms'}
            />{' '}
            /{' '}
            <NumberFormat
              value={accountInfo && authenticationStore.totalCpu ? authenticationStore.totalCpu / 1000 : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' ms'}
            />
          </div>
          <div className="resource-title">{intl.formatMessage({ id: 'Memory' })}</div>
          <div className="resource-value">
            <NumberFormat
              value={accountInfo && authenticationStore.availableRam ? authenticationStore.availableRam / 1000 : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' KB'}
            />{' '}
            /{' '}
            <NumberFormat
              value={accountInfo && authenticationStore.totalRam ? authenticationStore.totalRam / 1000 : 0}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' KB'}
            />
          </div>
          <div className="resource-title">{intl.formatMessage({ id: 'Bandwidth' })}</div>
          <div className="resource-value">
            <NumberFormat
              value={
                accountInfo && authenticationStore.availableBandwidth
                  ? authenticationStore.availableBandwidth / 1000
                  : 0
              }
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' KB'}
            />{' '}
            /{' '}
            <NumberFormat
              value={
                accountInfo && authenticationStore.availableBandwidth
                  ? authenticationStore.availableBandwidth / 1000
                  : 0
              }
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={' KB'}
            />
          </div>
        </div>
      </div>
      <Table
        pagination={false}
        columns={getColumn(intl)}
        dataSource={[
          {
            ...utg,
            staking: utg.staking,
            available: utg.available,
          },
          {
            ...uts,
            staking: uts.staking,
            available: uts.available,
          },
          {
            ...utm,
            staking: utm.staking,
            available: utm.available,
          },
          {
            ...uti,
            staking: uti.staking,
            available: uti.available,
          },
        ]}
        size="large"
      />
    </div>
  )
)
