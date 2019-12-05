import React from 'react'
import { Table, Modal } from 'antd'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { injectIntl } from 'react-intl'
import { REQUEST_STATE, UTS_KEY } from '../../../../../constants/Values'
import { error, info, success } from '../../../../../common/NFTModal'
import { handleEosErrorModal } from '../../../../Common/EosErrorHelper'

const confirm = Modal.confirm

const enhance = compose(
  setDisplayName({
    displayName: 'UTS',
  }),
  inject('stakingStore'),
  injectIntl,
  withHandlers({
    handleOnDataChange: ({ stakingStore }) => async (pagination, filters, sorter) => {
      await stakingStore.getServants(pagination.current)
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.stakingStore.getServants(1)
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
      title: intl.formatMessage({ id: 'Level' }),
      dataIndex: 'level',
      key: 'level',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{record.servant.level}</span>,
      sorter: false,
    },
    {
      title: intl.formatMessage({ id: 'Grade' }),
      dataIndex: 'grade',
      key: 'grade',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{record.servant.grade}</span>,
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
                const result = await stakingStore.exportNft(record, UTS_KEY)

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

export default enhance(({ stakingStore, stakingStore: { servants, state }, handleOnDataChange, intl }) => {
  return (
    <>
      <div>
        <Table
          loading={state === REQUEST_STATE.LOADING}
          // pagination={{
          //   total: servants.totalElements,
          //   showSizeChanger: false,
          //   pageSize: servants.pageSize,
          // }}
          columns={getColumns(stakingStore, intl)}
          dataSource={servants.contents}
          onChange={handleOnDataChange}
          size="large"
        />
      </div>
    </>
  )
})
