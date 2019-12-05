import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import App from './App'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import RootStore from './stores'
import { IntlProvider, addLocaleData } from 'react-intl'
import initLocale, { getUserLocale } from 'react-intl-locale'
import en from 'react-intl/locale-data/en'
import ko from 'react-intl/locale-data/ko'
import locale from './lang'
import './index.scss'
import { getJsonFromUrl } from './utils/Utils'
import { supportLanguage } from './constants/Values'

initLocale('en-US', supportLanguage.slice().map(lang => lang.locale))
addLocaleData([...en, ...ko])

const lang = getJsonFromUrl().lang

let i18nLang

if (lang) {
  i18nLang = lang.split('-')[0]
  localStorage.setItem('locale', lang)
} else {
  const savedLocale = localStorage.getItem('locale')

  if (savedLocale) {
    i18nLang = savedLocale.split('-')[0]
  } else {
    const userLocale = getUserLocale()
    i18nLang = userLocale.split('-')[0]
  }
}

// document.addEventListener('scatterLoaded', scatterExtension => {
//   // desktop우선
//   if (!RootStore.eosioStore.isExistScatter()) {
//     const scatter = window.scatter
//     window.scatter = null
//     RootStore.eosioStore.setScatter(scatter, 'extention')
//     RootStore.authenticationStore.checkLogin()
//   }
// })

ScatterJS.plugins(new ScatterEOS())

ScatterJS.scatter
  .connect('NFTbay', { initTimeout: 5000 })
  .then(connected => {
    if (!connected && !RootStore.eosioStore.isExistScatter()) {
      // todo - msg
      //alert('Scatter does not exist.')
      return false
    }

    if (connected) {
      const scatter = ScatterJS.scatter
      // ScatterJS.scatter = null
      RootStore.eosioStore.setScatter(scatter, 'desktop')
      RootStore.authenticationStore.checkLogin()
      console.log('scatter is loaded...')
    }
  })
  .catch(e => {
    if (!RootStore.eosioStore.isExistScatter) {
      //alert('Scatter does not exist.')
    }
  })

ReactDOM.render(
  <Provider {...RootStore}>
    <IntlProvider key={i18nLang} locale={i18nLang} messages={locale[i18nLang]}>
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
)
