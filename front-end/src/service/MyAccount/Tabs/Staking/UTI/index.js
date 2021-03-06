import React from 'react'
import { Table, Modal } from 'antd'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../../../constants/Values'
import { error, info, success } from '../../../../../common/NFTModal'
import { handleEosErrorModal } from '../../../../Common/EosErrorHelper'

const confirm = Modal.confirm

const enhance = compose(
  setDisplayName({
    displayName: 'UTI',
  }),
  inject('stakingStore'),
  injectIntl,
  withHandlers({
    handleOnDataChange: ({ stakingStore }) => async (pagination, filters, sorter) => {
      await stakingStore.getItems(pagination.current)
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.stakingStore.getItems(1)
    },
  }),
  observer
)

const getColumns = (stakingStore, intl) => {
  return [
    {
      title: '',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: '48px',
      render: (text, record) => <img src={record.imageUrl} alt="" height="48px" />,
    },
    {
      title: intl.formatMessage({ id: 'Product Name' }),
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => <div className="table-product-description-container">{record.name}</div>,
      defaultSortOrder: 'descend',
    },
    {
      title: intl.formatMessage({ id: 'Tier' }),
      dataIndex: 'tier',
      key: 'tier',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{record.equipment.tier}</span>,
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Upgrade' }),
      dataIndex: 'upgrade',
      key: 'upgrade',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>+{record.equipment.upgrade}</span>,
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Grade' }),
      dataIndex: 'grade',
      key: 'grade',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{record.equipment.grade}</span>,
      sorter: false,
    },
    {
      title: '',
      dataIndex: '',
      key: 'action',
      width: 120,
      render: (text, record) => (
        <div
          className="button-base"
          onClick={async () => {
            confirm({
              title: intl.formatMessage({ id: 'NFT Export' }),
              content: intl.formatMessage({ id: 'Do you really want to convert to NFT?' }),
              icon: false,
              onOk: async () => {
                const result = await stakingStore.exportNft(record, 'UTI')
                handleEosErrorModal(result)
              },
              onCancel() {},
            })
          }}
        >
          {intl.formatMessage({ id: 'NFT Export' })}
        </div>
      ),
    },
  ]
}

export default enhance(({ stakingStore, stakingStore: { items, state }, handleOnDataChange, intl }) => (
  <>
    <div>
      <Table
        loading={state === REQUEST_STATE.LOADING}
        // pagination={{
        //   total: items.totalElements,
        //   showSizeChanger: false,
        //   pageSize: items.pageSize,
        // }}
        columns={getColumns(stakingStore, intl)}
        dataSource={items.contents}
        onChange={handleOnDataChange}
        size="large"
      />
    </div>
  </>
))
