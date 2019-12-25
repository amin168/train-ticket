import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { h0 } from '../common/fp'

import './App.css'

import Header from '../common/Header'
import Nav from '../common/Nav'
import useNav from '../common/useNav'

import List from './List'
import Bottom from './Bottom'

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    prevDate,
    nextDate,
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible
} from './actions'

function App(props) {
    const {
        from,
        to,
        departDate,
        highSpeed,
        trainList,
        searchParsed,
        orderType,
        isFiltersVisible,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        dispatch
    } = props

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)

        const { from, to, date, highSpeed } = queries

        dispatch(setFrom(from))
        dispatch(setTo(to))
        // valueOf 返回unix时间戳
        dispatch(setDepartDate(h0(dayjs(date).valueOf())))
        dispatch(setHighSpeed(highSpeed === 'true'))

        dispatch(setSearchParsed(true))

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!searchParsed) {
            return
        }

        const url = new URI('/rest/query')
            .setSearch('from', from)
            .setSearch('to', to)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)
            .setSearch(
                'checkedTicketTypes',
                Object.keys(checkedTicketTypes).join() //因为checkedTicketTypes是对象，这里将key转化为字符串
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString()

        fetch(url)
            .then(res => res.json())
            .then(result => {
                const {
                    dataMap: {
                        directTrainInfo: {
                            trains, //车次列表
                            filter: {
                                ticketType,
                                trainType,
                                depStation,
                                arrStation
                            } //筛选条件
                        }
                    }
                } = result

                dispatch(setTrainList(trains))
                dispatch(setTicketTypes(ticketType))
                dispatch(setTrainTypes(trainType))
                dispatch(setDepartStations(depStation))
                dispatch(setArriveStations(arrStation))
            })

        // eslint-disable-next-line
    }, [
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd
    ])

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )

    const buttomCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleOrderType,
                toggleHighSpeed,
                toggleOnlyTickets,
                toggleIsFiltersVisible
            },
            dispatch
        )
    }, [])

    if (!searchParsed) {
        return <div>loading...</div>
    }

    return (
        <div>
            <div className="header-wrapper">
                <Header onBack={onBack} title={`${from} ⇀ ${to}`} />
            </div>
            <Nav
                date={departDate}
                isNextDisabled={isNextDisabled}
                isPrevDisabled={isPrevDisabled}
                next={next}
                prev={prev}
            />
            <List list={trainList} />
            <Bottom
                highSpeed={highSpeed}
                orderType={orderType}
                isFiltersVisible={isFiltersVisible}
                onlyTickets={onlyTickets}
                {...buttomCbs}
            />
        </div>
    )
}

export default connect(
    function mapStateToProps(state) {
        return state
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch }
    }
)(App)
