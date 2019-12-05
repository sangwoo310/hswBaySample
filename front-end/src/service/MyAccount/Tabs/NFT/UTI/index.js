import React from 'react'
import NumberFormat from 'react-number-format'
import { Table, Modal, List, Form, Row, Col, Input, InputNumber } from 'antd'
import { observer, inject } from 'mobx-react'
import { compose, setDisplayName, withHandlers, lifecycle, withState } from 'recompose'
import { injectIntl, FormattedMessage } from 'react-intl'
import { REQUEST_STATE, NFT_STATE, UTI_KEY, MIN_TRADE_PRICE, TRADE_STEP } from '../../../../../constants/Values'
import { handleEosErrorModal } from '../../../../Common/EosErrorHelper'

const confirm = Modal.confirm

const enhance = compose(
  setDisplayName({
    displayName: 'UTI',
  }),
  inject('nftStore'),
  injectIntl,
  Form.create({ name: 'register_acution' }),
  withState('isRegAuctionVisible', 'setIsRegAuctionVisible', false),
  withState('isClaimVisible', 'setIsClaimVisible', false),
  withState('regAuctionLoading', 'setRegAuctionLoading', false),
  withState('claimLoading', 'setClaimLoading', false),
  withState('auctionNft', 'setAuctionNft', []),
  withState('nft', 'setNft', null),
  withState('startPrice', 'setStartPrice', MIN_TRADE_PRICE),
  withState('buyoutPrice', 'setBuyoutPrice', 1),
  withHandlers({
    handleOnDataChange: ({ nftStore }) => async (pagination, filters, sorter) => {
      const result = await nftStore.getNftItems(pagination.current)
      handleEosErrorModal(result)
    },
    handleOnRegAuction: ({
      nftStore,
      setRegAuctionLoading,
      setIsRegAuctionVisible,
      nft,
      startPrice,
      buyoutPrice,
    }) => async () => {
      if (startPrice < MIN_TRADE_PRICE) {
        return Modal.error({
          title: 'Error',
          content: `start price must be grater than ${MIN_TRADE_PRICE} EOS`,
        })
      }
      if (buyoutPrice < MIN_TRADE_PRICE) {
        return Modal.error({
          title: 'Error',
          content: `buyout price must be grater than ${MIN_TRADE_PRICE} EOS`,
        })
      }

      if (startPrice >= buyoutPrice) {
        return Modal.error({
          title: 'Error',
          content: 'start price must be less than buyout price',
        })
      }

      setRegAuctionLoading(true)
      const result = await nftStore.regAuction(nft.idx, startPrice, buyoutPrice, UTI_KEY)
      handleEosErrorModal(result)
      setRegAuctionLoading(false)

      if (result) {
        setIsRegAuctionVisible(false)
      }
    },

    handleOnClaim: ({ nftStore, nft, setClaimLoading, setIsClaimVisible }) => async e => {
      setClaimLoading(true)
      const result = await nftStore.claimNft(nft)

      setClaimLoading(false)
      handleEosErrorModal(result)

      if (result) {
        setIsClaimVisible(false)
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      const result = await this.props.nftStore.getNftItems(1)
      handleEosErrorModal(result)
    },
  }),
  observer
)

const getColumns = (nftStore, intl, setAuctionNft, setIsRegAuctionVisible, setNft, setIsClaimVisible) => {
  return [
    {
      title: '',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: '48px',
      render: (text, record) => <img src={record.equipment.imageUrl} alt="" height="48px" />,
    },
    {
      title: intl.formatMessage({ id: 'Product Name' }),
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => <div className="table-product-description-container">{record.equipment.name}</div>,
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
      title: intl.formatMessage({ id: 'Grade' }),
      dataIndex: 'grade',
      key: 'grade',
      defaultSortOrder: 'descend',
      render: (text, record) => <span>{record.equipment.grade}</span>,
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
      title: '',
      dataIndex: '',
      key: 'action',
      width: 120,
      render: (text, record) => {
        if (record.state.toUpperCase() === NFT_STATE.STATE_IDLE.toUpperCase()) {
          return (
            <>
              <div
                className="reg-auction-button"
                onClick={async () => {
                  const listSource = [
                    { id: 'Product Name', title: 'Product Name', content: record.equipment.name },
                    { id: 'Seller', title: 'Seller', content: record.owner },
                    { id: 'Type', title: 'Type', content: 'Item' },
                    { id: 'Tier', title: 'Tier', content: record.equipment.tier },
                    { id: 'Job', title: 'Job', content: record.equipment.job },
                    { id: 'Grade', title: 'Grade', content: record.equipment.grade },
                  ]

                  setNft(record)
                  setAuctionNft(listSource)
                  setIsRegAuctionVisible(true)
                }}
              >
                {intl.formatMessage({ id: 'Trade' })}
              </div>
              <div
                style={{ marginTop: '4px' }}
                className="datalization-button"
                onClick={async () => {
                  confirm({
                    title: intl.formatMessage({ id: 'Datalization' }),
                    content: intl.formatMessage({ id: 'Do you really want to convert to game data?' }),
                    icon: false,
                    onOk: async () => {
                      const result = await nftStore.backToGame(record, UTI_KEY)
                      handleEosErrorModal(result)
                    },
                    onCancel() {},
                  })
                }}
              >
                {intl.formatMessage({ id: 'Datalization' })}
              </div>
            </>
          )
        } else {
          if (record.state.toUpperCase() === NFT_STATE.STATE_SELLING.toUpperCase()) {
            if (record.trade && record.trade.claim) {
              if (record.trade.seller === record.trade.owner) {
                return (
                  <div
                    style={{ marginTop: '4px' }}
                    className="cancel-button"
                    onClick={async () => {
                      const result = await nftStore.cancelTrade(record.trade.contractTradeId, UTI_KEY)
                      handleEosErrorModal(result)
                    }}
                  >
                    {intl.formatMessage({ id: 'Cancel Trade' })}
                  </div>
                )
              } else {
                return (
                  <div
                    style={{ marginTop: '4px' }}
                    className="claim-button"
                    onClick={async () => {
                      const listSource = [
                        { id: 'Product Name', title: 'Product Name', content: record.equipment.name },
                        { id: 'Buyer', title: 'Buyer', content: record.trade.buyer },
                        { id: 'Seller', title: 'Seller', content: record.trade.seller },
                        { id: 'Price', title: 'Price', content: record.trade.currentPrice },
                      ]

                      setNft(record)
                      setAuctionNft(listSource)
                      setIsClaimVisible(true)
                    }}
                  >
                    {intl.formatMessage({ id: 'Claim' })}
                  </div>
                )
              }
            } else {
              return (
                <div style={{ marginTop: '4px' }} className="selling-button">
                  {intl.formatMessage({ id: 'Selling' })}
                </div>
              )
            }
          } else {
            return (
              <div
                className="claim-button"
                onClick={async () => {
                  const listSource = [
                    { id: 'Product Name', title: 'Product Name', content: record.equipment.name },
                    { id: 'Buyer', title: 'Buyer', content: record.trade.buyer },
                    { id: 'Seller', title: 'Seller', content: record.trade.seller },
                    { id: 'Price', title: 'Price', content: record.trade.currentPrice },
                  ]

                  setNft(record)
                  setAuctionNft(listSource)
                  setIsClaimVisible(true)
                }}
              >
                {intl.formatMessage({ id: 'Claim' })}
              </div>
            )
          }
        }
      },
    },
  ]
}

export default enhance(
  ({
    nftStore,
    nftStore: { nftItems, state },
    form: { getFieldDecorator },
    handleOnDataChange,
    intl,
    isRegAuctionVisible,
    setIsRegAuctionVisible,
    isClaimVisible,
    setIsClaimVisible,
    auctionNft,
    setAuctionNft,
    nft,
    setNft,
    startPrice,
    setStartPrice,
    buyoutPrice,
    setBuyoutPrice,
    regAuctionLoading,
    claimLoading,
    handleOnRegAuction,
    handleOnClaim,
  }) => (
    <>
      <div>
        <Table
          loading={state === REQUEST_STATE.LOADING}
          pagination={{
            total: nftItems.totalElements,
            showSizeChanger: false,
            pageSize: nftItems.pageSize,
          }}
          columns={getColumns(nftStore, intl, setAuctionNft, setIsRegAuctionVisible, setNft, setIsClaimVisible)}
          dataSource={nftItems.contents}
          onChange={handleOnDataChange}
          size="large"
        />
      </div>
      <Modal
        title="Claim"
        width="834px"
        visible={isClaimVisible}
        confirmLoading={claimLoading}
        onOk={handleOnClaim}
        onCancel={() => setIsClaimVisible(false)}
      >
        <div className="vertical-flex-container">
          <div className="horizontal-flex-container">
            <div className="modal-thumbnail-container">
              <img
                src={nft ? nft.equipment.detailImageUrl : ''}
                height="200px"
                alt=""
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              />
            </div>
            <div className="modal-vertical-empty-seperator" />
            <div className="reg-auction-summary-container" style={{ width: '500px' }}>
              <List
                dataSource={auctionNft}
                size="small"
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta title={item.title} />
                    <div>{item.content}</div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Register Auction"
        width="834px"
        visible={isRegAuctionVisible}
        confirmLoading={regAuctionLoading}
        onOk={handleOnRegAuction}
        onCancel={() => setIsRegAuctionVisible(false)}
      >
        <div className="vertical-flex-container">
          <div className="horizontal-flex-container">
            <div className="modal-thumbnail-container">
              <img
                src={nft ? nft.equipment.detailImageUrl : ''}
                height="200px"
                alt=""
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              />
            </div>
            <div className="modal-vertical-empty-seperator" />
            <div className="reg-auction-summary-container" style={{ width: '500px' }}>
              <List
                dataSource={auctionNft}
                size="small"
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta title={item.title} />
                    <div>{item.content}</div>
                  </List.Item>
                )}
              />
            </div>
          </div>

          <div className="modal-auction-bottom-container">
            <Form style={{ width: '100%' }}>
              <Row gutter={24}>
                <Col span={12} key={0}>
                  <Form.Item label={<FormattedMessage id="Starting Price" />}>
                    {getFieldDecorator(`startingPrice`, {
                      initialValue: startPrice.toFixed(4),
                      rules: [
                        {
                          required: true,
                          message: <FormattedMessage id="Input Starting Price" />,
                        },
                      ],
                    })(
                      <InputNumber
                        className="nft-inputnumber"
                        min={0}
                        max={10000}
                        step={TRADE_STEP}
                        onChange={v => setStartPrice(parseFloat(v))}
                      />
                    )}
                    <span> EOS</span>
                  </Form.Item>
                </Col>
                <Col span={12} key={1}>
                  <Form.Item label={<FormattedMessage id="Buyout Price" />}>
                    {getFieldDecorator(`buyoutPrice`, {
                      initialValue: buyoutPrice.toFixed(4),
                      rules: [
                        {
                          required: true,
                          message: <FormattedMessage id="Input Buyout Price" />,
                        },
                      ],
                    })(
                      <InputNumber
                        className="nft-inputnumber"
                        min={0}
                        max={10000}
                        step={TRADE_STEP}
                        onChange={v => setBuyoutPrice(parseFloat(v))}
                      />
                    )}
                    <span> EOS</span>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  )
)
