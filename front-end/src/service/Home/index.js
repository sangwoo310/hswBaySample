import React from 'react'
import Banner from './Banner'
import SpecialDeal from './SpecialDeal'
import NewProduct from './Product/NewProduct'
import { FormattedMessage, injectIntl } from 'react-intl'
import './index.scss'
import Deadline from './Deadline'
import Rank from './Rank'

const Home = injectIntl(({ intl }) => {
  return (
    <div>
      <Banner />
      <div className="menu-shadow-container">
        <div className="home-content-menu-container">
          <div className="special-deal-menu">{intl.formatMessage({ id: 'Event' })} </div>
          <div className="new-product-menu">{intl.formatMessage({ id: 'New Product' })}</div>
        </div>
      </div>
      <div className="home-content-subcontent-container">
        <div className="home-left-container">
          <SpecialDeal />
          <Rank />
        </div>
        <div>
          <NewProduct />
          <Deadline />
        </div>
      </div>
    </div>
  )
})

export default Home
