import { createStore, combineReducers, applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        from: '北京',
        to: '上海',
        isCitySelectorVisible: false, // 城市选择浮层开关
        currentSelectingLeftCity: false, // 城市选择后，回填到哪里
        cityData: null, // 代表城市选择浮层的数据
        isLoadingCityData: false,
        isDateSelectorVisible: false, // 日期选择浮层开关
        departDate: Date.now(),
        highSpeed: false // 代表是否选择的高铁通车
    },
    applyMiddleware(thunk)
)
