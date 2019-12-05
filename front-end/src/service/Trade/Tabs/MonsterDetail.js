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
    displayName: 'MonsterDetail',
  }),
  withRouter,
  inject('monsterStore'),
  withState('biddingPrice', 'setBiddingPrice', MIN_TRADE_PRICE),
  withState('buyItNowPrice', 'setBuyItNowPrice', MIN_TRADE_PRICE),
  injectIntl,
  Form.create({ name: 'monster_detail' }),
  withHandlers({
    handleOnBidMonster: ({ monsterStore, match, setBiddingPrice }) => async (
      seller,
      contractTradeId,
      bid_price,
      bid_type
    ) => {
      const result = await monsterStore.bidMonster(seller, contractTradeId, bid_price, bid_type)

      handleEosErrorModal(result)

      if (result === true) {
        await monsterStore.fetchMonster(match.params.id)

        const { targetMonster } = monsterStore

        if (targetMonster) {
          const { minPrice, maxPrice, currentPrice } = targetMonster

          setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
        }
      }
    },
    handleOnBuyItNowMonster: ({ monsterStore, match, setBiddingPrice }) => async (
      seller,
      contractTradeId,
      bid_price,
      bid_type
    ) => {
      const result = await monsterStore.buyItNowMonster(seller, contractTradeId, bid_price, bid_type)

      handleEosErrorModal(result)
      if (result === true) {
        await monsterStore.fetchMonster(match.params.id)

        const { targetMonster } = monsterStore

        console.log(targetMonster)
        if (targetMonster) {
          const { minPrice, maxPrice, currentPrice } = targetMonster

          setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
        }
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.monsterStore.fetchMonster(this.props.match.params.id)

      const { setBiddingPrice } = this.props
      const { targetMonster } = this.props.monsterStore

      if (targetMonster) {
        const { minPrice, maxPrice, currentPrice } = targetMonster

        setBiddingPrice(Math.min(currentPrice + TRADE_STEP, maxPrice))
      }
    },
  }),
  observer
)

export default enhance(
  ({
    monsterStore: { targetMonster, state, isOnBidding, isOnBuyItNow },
    intl,
    biddingPrice,
    setBiddingPrice,
    buyItNowPrice,
    setBuyItNowPrice,
    handleOnBidMonster,
    handleOnBuyItNowMonster,
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
    } = targetMonster

    if (!nft) return null

    const {
      gameInfo: { id: game_info_id, name, desc, created, imageUrl, detailImageUrl, job, jobIconUrl },
      basicStr,
      basicDex,
      basicInt,
      nftTokenId,
    } = nft

    const listSource = [
      { id: 'Product Name', title: 'Product Name', content: getLocale() === 'ko-KR' ? desc : name },
      { id: 'Seller', title: 'Seller', content: master },
      { id: 'Type', title: 'Type', content: type },
      { id: 'Str', title: 'Str', content: basicStr },
      { id: 'Dex', title: 'Dex', content: basicDex },
      { id: 'Int', title: 'Int', content: basicInt },
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
                    <img
                      src={detailImageUrl}
                      height="200px"
                      alt=""
                      style={{ paddingTop: '12px', paddingBottom: '12px' }}
                    />
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
                          handleOnBidMonster(master, contractTradeId, biddingPrice, BID_TYPE.BID)
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
                          handleOnBuyItNowMonster(master, contractTradeId, maxPrice, BID_TYPE.BUY_IT_NOW)
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
