import React from 'react'
import { injectIntl } from 'react-intl'
import './index.scss'

const TradeBanner = ({ intl }) => (
  <div>
    <div className="product-container">
      <div className="product-main-message">{intl.formatMessage({ id: 'Trade' })}</div>
    </div>
  </div>
)

export default injectIntl(TradeBanner)
