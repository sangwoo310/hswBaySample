import { withSplitting } from '../common/hoc/withSplitting'
import './index.scss'

// export { default as Home } from './Home'
// export { default as Notice } from './Notice'
// export { default as Trade } from './Trade'
// export { default as SearchResult } from './Trade/SearchResult'
// export { default as MyAccount } from './MyAccount'

export { default as Home } from './Home'
export const Notice = withSplitting(() => import('./Notice'))
export const Trade = withSplitting(() => import('./Trade'))
export const SearchResult = withSplitting(() => import('./Trade/SearchResult'))
export const MyAccount = withSplitting(() => import('./MyAccount'))
