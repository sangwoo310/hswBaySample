import React from 'react'
import { injectIntl } from 'react-intl'
import './index.scss'

const MyAccountBanner = ({ intl }) => (
  <div>
    <div className="myaccount-container">
      <div className="myaccount-main-message">{intl.formatMessage({ id: 'My Account' })}</div>
    </div>
  </div>
)

export default injectIntl(MyAccountBanner)
