import React, { useCallback, useEffect, useMemo, lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { h0 } from '../common/fp'

import Header from '../common/Header'
import Nav from '../common/Nav'
import useNav from '../common/useNav'

import Detail from '../common/Detail'
import Candidate from './Candidate'
import { TrainContext } from './context'

// import Schedule from './Schedule'

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
    setArriveDate,
    setDurationStr,
    setTickets,
    toggleIsScheduleVisible
} from './actions'
import { bindActionCreators } from 'redux'

const Schedule = lazy(() => import('./Schedule'))

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
                dispatch(setArriveDate(arriveDate))
                dispatch(setDurationStr(durationStr))
                dispatch(setTickets(candidates))
            })
        // eslint-disable-next-line
    }, [searchParsed, departDate, trainNumber])

    const { prev, next, isPrevDisabled, isNextDisabled } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )

    const detailCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleIsScheduleVisible
            },
            dispatch
        )
        // eslint-disable-next-line
    }, [])

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
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    trainNumber={trainNumber}
                    durationStr={durationStr}
                    {...detailCbs}
                />
            </div>
            <TrainContext.Provider
                value={{
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate
                }}
            >
                <Candidate tickets={tickets} />
            </TrainContext.Provider>

            {isScheduleVisible && (
                <div
                    className="mask"
                    onClick={() => dispatch(toggleIsScheduleVisible())}
                >
                    <Suspense fallback={<div>loading...</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            )}
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
