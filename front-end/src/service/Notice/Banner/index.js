import React from 'react'
import { injectIntl } from 'react-intl'
import './index.scss'

const NoticeBanner = ({ intl }) => (
  <div>
    <div className="notice-container">
      <div className="notice-main-message">{intl.formatMessage({ id: 'Notice' })}</div>
    </div>
  </div>
)

export default injectIntl(NoticeBanner)
