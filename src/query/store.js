import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

import { h0 } from '../common/fp'
import { ORDER_DEPART } from './constant'

export default createStore(
    combineReducers(reducers),
    {
        from: null, //出发城市
        to: null, //到达城市
        departDate: h0(Date.now()), //出发日期
        highSpeed: false, //是否选择了高铁通车
        trainList: [],
        orderType: ORDER_DEPART, //页面的排序类型
        onlyTickets: false, //只看有票
        ticketTypes: [], //所有坐系类型的配选项
        checkedTicketTypes: {}, //有那些选中了的坐系类型的配选项
        trainTypes: [], //车次类型
        checkedTrainTypes: {}, //选中的车次类型
        departStations: [], //出发车站
        checkedDepartStations: {}, //选中的出发车站
        arriveStations: [], //到达车站
        checkedArriveStations: {}, //选中的到达车站
        departTimeStart: 0, //出发时间开始
        departTimeEnd: 24, //出发时间结束
        arriveTimeStart: 0, //到达时间开始
        arriveTimeEnd: 24, //到达时间结束
        isFiltersVisible: false, //控制综合筛选图层的显示

        //是否已经解析把url的参数解析完毕（程序一启动就解释）
        searchParsed: false
    },
    applyMiddleware(thunk)
)
