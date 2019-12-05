import React from 'react'
import { Table } from 'antd'
import { format } from 'date-fns'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import { injectIntl } from 'react-intl'
import { REQUEST_STATE } from '../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'NoticeAnnouncement',
  }),
  inject('noticeStore'),
  injectIntl,
  withHandlers({
    handleOnDataChange: ({ noticeStore }) => async (pagination, filters, sorter) => {
      noticeStore.setAnnouncePageParams({
        page: pagination.current,
        perPage: pagination.pageSize,
        order: {
          name: sorter.field ? sorter.field : 'id',
          sorting: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : 'desc', // or desc
        },
      })

      await noticeStore.fetchAnnounces()
    },
    handleOnExpand: ({ noticeStore }) => (expanded, record) => {
      noticeStore.toggleExpandAnnouncementByKey(record.key)
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.noticeStore.fetchAnnounces()
    },
  }),
  observer
)

const getColumns = intl => {
  return [
    {
      title: intl.formatMessage({ id: 'Classify' }),
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => <div className="table-product-description-container">{record.type}</div>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Title' }),
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <span>{record.title}</span>,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'Date' }),
      dataIndex: 'created',
      key: 'created',
      render: (text, record) => <span>{format(new Date(record.created), 'DD/MM/YYYY')}</span>,
      sorter: true,
    },
  ]
}

export default enhance(({ noticeStore: { announces, state }, handleOnDataChange, handleOnExpand, intl }) => (
  <div className="notice-announcement">
    <Table
      loading={state === REQUEST_STATE.LOADING}
      rowKey="key"
      expandedRowKeys={announces.expandedRowKeys}
      expandedRowRender={record => (
        <div style={{ padding: '8px 0px' }} dangerouslySetInnerHTML={{ __html: record.content }} />
      )}
      pagination={{
        total: announces.totalElements,
        showSizeChanger: true,
        pageSize: announces.pageSize,
      }}
      columns={getColumns(intl)}
      dataSource={announces.contents}
      onChange={handleOnDataChange}
      onExpand={handleOnExpand}
      expandRowByClick={true}
    />
  </div>
))
