import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import NumberFormat from 'react-number-format'
import { compose, setDisplayName, lifecycle } from 'recompose'
import { SPECIAL_DEAL_TYPE_WEEK } from '../../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'Today',
  }),
  inject('specialDealStore'),
  lifecycle({
    async componentDidMount() {
      await this.props.specialDealStore.fetchSpecialDeals(SPECIAL_DEAL_TYPE_WEEK)
    },
  }),
  observer
)

export default enhance(({ specialDealStore: { weekSpecialDeals } }) => (
  <div>
    <div className="event-item-container">
      <div className="thumbnail-container">
        <div className="thumbnail-main-container">
          <img
            src={weekSpecialDeals.contents[0] ? weekSpecialDeals.contents[0].nft.gameInfo.imageUrl : 'None'}
            height="124px"
            alt=""
            style={{ paddingTop: '12px', paddingBottom: '12px' }}
          />
        </div>
      </div>
      <div className="deal-title">
        {weekSpecialDeals.contents[0] ? weekSpecialDeals.contents[0].nft.gameInfo.name : 'None'}
      </div>
      <div className="deal-button">
        <NumberFormat
          value={weekSpecialDeals.contents[0] ? weekSpecialDeals.contents[0].currentPrice : 0}
          displayType={'text'}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          suffix={' EOS'}
        />
      </div>
    </div>

    <div className="second-third-container">
      <div className="event-item-container">
        <div className="thumbnail-container">
          <div className="thumbnail-main-container">
            <img
              src={weekSpecialDeals.contents[1] ? weekSpecialDeals.contents[1].nft.gameInfo.imageUrl : 'None'}
              height="124px"
              alt=""
              style={{ paddingTop: '12px', paddingBottom: '12px' }}
            />
          </div>
        </div>
        <div className="deal-title">
          {weekSpecialDeals.contents[1] ? weekSpecialDeals.contents[1].nft.gameInfo.name : 'None'}
        </div>
        <div className="deal-button">
          <NumberFormat
            value={weekSpecialDeals.contents[1] ? weekSpecialDeals.contents[1].currentPrice : 0}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={4}
            fixedDecimalScale={true}
            suffix={' EOS'}
          />
        </div>
      </div>
      <div className="event-item-container">
        <div className="thumbnail-container">
          <div className="thumbnail-main-container">
            <img
              src={weekSpecialDeals.contents[2] ? weekSpecialDeals.contents[2].nft.gameInfo.imageUrl : 'None'}
              height="124px"
              alt=""
              style={{ paddingTop: '12px', paddingBottom: '12px' }}
            />
          </div>
        </div>
        <div className="deal-title">
          {weekSpecialDeals.contents[2] ? weekSpecialDeals.contents[2].nft.gameInfo.name : 'None'}
        </div>
        <div className="deal-button">
          <NumberFormat
            value={weekSpecialDeals.contents[2] ? weekSpecialDeals.contents[2].currentPrice : 0}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={4}
            fixedDecimalScale={true}
            suffix={' EOS'}
          />
        </div>
      </div>
    </div>
  </div>
))
