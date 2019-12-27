import { createStore, combineReducers, applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        departDate: Date.now(), // 出发日期
        arriveDate: Date.now(), // 到达日期
        departTimeStr: null, //  出发时间
        arriveTimeStr: null, // 到达时间
        departStation: null, // 出发车站
        arriveStation: null, // 到达车站
        trainNumber: null, // 车次
        durationStr: null, // 运行时间
        tickets: [], // 座次和售票渠道
        isScheduleVisible: false,
        searchParsed: false
    },
    applyMiddleware(thunk)
)
