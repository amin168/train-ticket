import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { h0 } from '../common/fp'

import Header from '../common/Header'
import Nav from '../common/Nav'
import useNav from '../common/useNav'

import Detail from '../common/Detail'
import Candidate from './Candidate'
import Schedule from './Schedule'

import './App.css'

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    prevDate,
    nextDate,
    setDepartTimeStr,
    setArriveTimeStr,
    setDurationStr,
    setTickets
} from './actions'

function App(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,
        dispatch
    } = props

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)
        const { aStation, dStation, date, trainNumber } = queries

        dispatch(setDepartStation(dStation))
        dispatch(setArriveStation(aStation))
        dispatch(setDepartDate(h0(dayjs(date).valueOf()))) // date是字符串，要转成时间戳
        dispatch(setTrainNumber(trainNumber))

        dispatch(setSearchParsed(true))

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        document.title = trainNumber
    }, [trainNumber])

    useEffect(() => {
        if (!searchParsed) return

        const url = new URI('/rest/ticket')
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString()

        fetch(url)
            .then(res => res.json())
            .then(result => {
                const { detail, candidates } = result

                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr
                } = detail

                dispatch(setDepartTimeStr(departTimeStr))
                dispatch(setArriveTimeStr(arriveTimeStr))
                dispatch(setDurationStr(durationStr))
                dispatch(setTickets(candidates))
            })
    }, [searchParsed])

    const { prev, next, isPrevDisabled, isNextDisabled } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )

    if (!searchParsed) return null

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header onBack={onBack} title={trainNumber} />
            </div>
            <div className="nav-wrapper">
                <Nav
                    date={departDate}
                    prev={prev}
                    next={next}
                    isPrevDisabled={isPrevDisabled}
                    isNextDisabled={isNextDisabled}
                />
            </div>
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
