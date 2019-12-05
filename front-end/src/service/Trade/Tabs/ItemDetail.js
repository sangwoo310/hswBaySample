import React from 'react'
import { Table, Input, List, Form, Row, Col, Spin, InputNumber, Button } from 'antd'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { compose, setDisplayName, withHandlers, lifecycle, withState } from 'recompose'
import { FormattedMessage, injectIntl } from 'react-intl'
import { REQUEST_STATE, BID_TYPE, MIN_TRADE_PRICE, TRADE_STEP } from '../../../constants/Values'
import { error, info, success } from '../../../common/NFTModal'
import { handleEosErrorModal } from '../../Common/EosErrorHelper'

function getLocale() {
  return localStorage.getItem('locale')
}

const enhance = compose(
  setDisplayName({
    displayName: 'ItemDetail',
  }),
  withRouter,
  inject('itemStore'),
  withState('biddingPrice', 'setBiddingPrice', MIN_TRADE_PRICE),
  withState('buyItNowPrice', 'setBuyItNowPrice', MIN_TRADE_PRICE),
  injectIntl,
  Form.create({ name: 'item_detail' }),
  withHandlers({
    handleOnBidItem: ({ itemStore, match, setBiddingPrice }) => async (
      seller,
      contractTradeId,
      bid_price,
      bid_type
    ) => {
      const result = await itemStore.bidItem(seller, contractTradeId, bid_price, bid_type)

      handleEosErrorModal(result)

      if (result === true) {
        await itemStore.fetchItem(match.params.id)

        const { targetItem } = itemStore
        if (targetItem) {
          const { minPrice, maxPrice, currentPrice } = targetItem

          setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
        }
      }
    },
    handleOnBuyItNowItem: ({ itemStore, match, setBiddingPrice }) => async (
      seller,
      contractTradeId,
      bid_price,
      bid_type
    ) => {
      const result = await itemStore.buyItNowItem(seller, contractTradeId, bid_price, bid_type)

      handleEosErrorModal(result)

      if (result === true) {
        await itemStore.fetchItem(match.params.id)
        const { targetItem } = itemStore
        if (targetItem) {
          const { minPrice, maxPrice, currentPrice } = targetItem

          setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
        }
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.itemStore.fetchItem(this.props.match.params.id)

      const { setBiddingPrice } = this.props
      const { targetItem } = this.props.itemStore

      if (targetItem) {
        const { minPrice, maxPrice, currentPrice } = targetItem

        if (maxPrice && currentPrice) {
          setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
        }
      }
    },
  }),
  observer
)

export default enhance(
  ({
    itemStore: { targetItem, state, isOnBidding, isOnBuyItNow },
    intl,
    biddingPrice,
    setBiddingPrice,
    buyItNowPrice,
    setBuyItNowPrice,
    handleOnBidItem,
    handleOnBuyItNowItem,
    form: { getFieldDecorator },
  }) => {
    const {
      id,
      contractTradeId,
      buyer,
      owner,
      type,
      nft,
      minPrice,
      maxPrice,
      currentPrice,
      state: tradeState,
      bidEndTime,
      master,
    } = targetItem

    if (!nft) return null

    const {
      gameInfo: { id: game_info_id, name, desc, created, imageUrl, job, jobIconUrl },
      itemTier,
      itemUpgrade,
      itemGrade,
      nftTokenId,
    } = nft

    const listSource = [
      { id: 'Product Name', title: 'Product Name', content: getLocale() === 'ko-KR' ? desc : name },
      { id: 'Seller', title: 'Seller', content: master },
      { id: 'Type', title: 'Type', content: type },
      { id: 'Tier', title: 'Tier', content: itemTier },
      { id: 'Upgrade', title: 'Upgrade', content: itemUpgrade },
      { id: 'Grade', title: 'Grade', content: itemGrade },
      { id: 'Selling Fee', title: 'Selling Fee', content: '1%' },
    ]

    return (
      <>
        {state === REQUEST_STATE.LOADING ? (
          <Spin />
        ) : (
          <div className="detail-root-container">
            <div className="vertical-flex-container">
              <div className="trade-detail-container">
                <div className="horizontal-flex-container">
                  <div className="modal-thumbnail-container">
                    <img src={imageUrl} height="200px" alt="" style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                  </div>
                  <div className="modal-vertical-empty-seperator" />
                  <div className="trade-detail-description-container">
                    <List
                      dataSource={listSource}
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
              <div className="modal-auction-bottom-container">
                <Form style={{ width: '100%' }}>
                  <Row gutter={24}>
                    <Col span={12} key={0}>
                      <Form.Item label={<FormattedMessage id="Current Price" />}>
                        <Input
                          disabled
                          value={currentPrice}
                          placeholder={intl.formatMessage({ id: 'Current Price' })}
                          suffix={'EOS'}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12} key={1} />
                  </Row>
                  <Row gutter={24}>
                    <Col span={12} key={0}>
                      <Form.Item label={<FormattedMessage id="Bidding Price" />}>
                        {getFieldDecorator(`biddingPrice`, {
                          initialValue: biddingPrice.toFixed(4),
                          rules: [
                            {
                              required: true,
                              message: <FormattedMessage id="Input Bidding Price" />,
                            },
                          ],
                        })(
                          <InputNumber
                            className="nft-inputnumber"
                            onChange={v => setBiddingPrice(parseFloat(v))}
                            min={minPrice}
                            max={maxPrice}
                            step={TRADE_STEP}
                            disabled={biddingPrice.toFixed(4) === maxPrice.toFixed(4)}
                          />
                        )}
                        <span> EOS</span>
                      </Form.Item>

                      <Button
                        block
                        loading={isOnBidding}
                        style={{ width: '100%', textAlign: 'center' }}
                        onClick={e => {
                          e.preventDefault()
                          handleOnBidItem(master, contractTradeId, biddingPrice, BID_TYPE.BID)
                        }}
                        disabled={biddingPrice.toFixed(4) === maxPrice.toFixed(4)}
                      >
                        <FormattedMessage id={'Bidding'} />
                      </Button>
                    </Col>
                    <Col span={12} key={1}>
                      <Form.Item label={<FormattedMessage id="Buy It Now" />}>
                        {getFieldDecorator(`buyItNowPrice`, {
                          initialValue: maxPrice.toFixed(4),
                          rules: [
                            {
                              required: true,
                              message: <FormattedMessage id="Buy It Now" />,
                            },
                          ],
                        })(
                          <InputNumber
                            className="nft-inputnumber"
                            disabled
                            onChange={v => setBuyItNowPrice(parseFloat(v))}
                            min={minPrice}
                            max={maxPrice}
                            step={TRADE_STEP}
                          />
                        )}
                        <span> EOS</span>
                      </Form.Item>

                      <Button
                        block
                        loading={isOnBuyItNow}
                        style={{ width: '100%', textAlign: 'center' }}
                        onClick={e => {
                          e.preventDefault()
                          handleOnBuyItNowItem(master, contractTradeId, maxPrice, BID_TYPE.BUY_IT_NOW)
                        }}
                      >
                        <FormattedMessage id={'Buy It Now'} />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)
