import React from 'react'
import { Layout, Row, Col, Avatar, Icon } from 'antd'
import './index.scss'
const { Footer } = Layout

const FooterCore = () => (
  <Footer style={{ background: '#172335', height: '200px', margin: 0, padding: 0 }}>
    <div className="footer-root">
      <div className="footer-row-base">
        <img src="./img/unlimited_tower_logo1.png" alt="" width="187px" />
      </div>

      <div className="footer-row-container">
        <a href="https://twitter.com/UnlimitedTower" target="_blank" rel="noopener noreferrer">
          <div className="footer-twitter-img" />
        </a>

        <a href="https://t.me/UnlimitedTower" target="_blank" rel="noopener noreferrer">
          <div className="footer-telegram-img" />
        </a>
        <a href="https://medium.com/unlimitedtower" target="_blank" rel="noopener noreferrer">
          <div className="footer-medium-img" />
        </a>

        <a href="https://github.com/DevToothCrew" target="_blank" rel="noopener noreferrer">
          <div className="footer-github-img" />
        </a>

        <a href="https://www.youtube.com/channel/UCn4VtDfcAjBHeVM7STdV72A" target="_blank" rel="noopener noreferrer">
          <div className="footer-youtube-img" />
        </a>

        <a href="https://open.kakao.com/o/gEclhcdb" target="_blank" rel="noopener noreferrer">
          <div className="footer-mail-img" />
        </a>
      </div>

      <div className="footer-row-container">
        <div>Copyright © 2019 Devtooth. All Rights Reserved. </div>
      </div>
    </div>
  </Footer>
)

export default FooterCore
