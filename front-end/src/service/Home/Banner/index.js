import React from 'react'
import { Carousel } from 'antd'
import { observer, inject } from 'mobx-react'
import { format } from 'date-fns'
import { compose, setDisplayName, withHandlers, lifecycle } from 'recompose'
import preventDefault from 'preventdefault'
import ParticleAnimation from 'react-particle-animation'
import './index.scss'
import { SCATTER_RESULT } from '../../../constants/Values'

const enhance = compose(
  setDisplayName({
    displayName: 'MainBanner',
  }),
  inject('authenticationStore', 'eosioStore', 'mainBannerStore'),
  lifecycle({
    async componentDidMount() {
      await this.props.mainBannerStore.fetchNoticeBanner()
    },
  }),
  observer
)

const Banner = enhance(({ mainBannerStore: { notice } }) => (
  <Carousel autoplay>
    <div className="banner-image-first">
      <img src="/img/banner/banner2.png" alt="" width="1920px" height="450px" />
    </div>
    <div className="banner-image-first">
      <img src="/img/banner/banner1.png" alt="" width="1920px" height="450px" />
    </div>
  </Carousel>
))

export default Banner
