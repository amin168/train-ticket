import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
  combineReducers(reducers),
  {
    trainNumber: null,
    departStation: null,
    arriveStation: null,
    seatType: null,
    departDate: Date.now(),
    arriveDate: Date.now(),
    departTimeStr: null,
    arriveTimeStr: null,
    durationStr: null, // 行程时间
    price: null,
    passengers: [], // 乘客信息
    menu: null, // 弹出菜单
    isMenuVisible: false,
    searchParsed: false
  },
  applyMiddleware(thunk)
)
