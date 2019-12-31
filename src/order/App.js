import React, { useCallback, useEffect, useMemo } from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../common/Header'
import Detail from '../common/Detail'
import Account from './Account'
import Choose from './Choose'
import Passengers from './Passengers'
import Ticket from './Ticket'
import Menu from './Menu.jsx'

import './App.css'

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setSeatType,
  setDepartDate,
  setSearchParsed,
  fetchInitial,
  createAdult,
  createChild,
  removePassenger,
  updatePassenger,
  hideMenu,
  showGenderMenu,
  showFollowAdultMenu,
  showTicketTypeMenu
} from './actions'

function App(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchParsed,
    dispatch
  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)

    const { trainNumber, dStation, aStation, type, date } = queries

    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setSeatType(type))
    dispatch(setDepartDate(dayjs(date).valueOf()))
    dispatch(setSearchParsed(true))

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!searchParsed) {
      return
    }

    const url = new URI('/rest/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString()

    // eslint-disable-next-line
    dispatch(fetchInitial(url))

    // eslint-disable-next-line
  }, [searchParsed, departStation, arriveStation, seatType, departDate])

  const passengersCbs = useMemo(() => {
    return bindActionCreators(
      {
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu
      },
      dispatch
    )
    // eslint-disable-next-line
  }, [])

  const menuCbs = useMemo(() => {
    return bindActionCreators(
      {
        hideMenu
      },
      dispatch
    )
    // eslint-disable-next-line
  }, [])

  const chooseCbs = useMemo(() => {
    return bindActionCreators(
      {
        updatePassenger
      },
      dispatch
    )
    // eslint-disable-next-line
  }, [])

  if (!searchParsed) {
    return null
  }

  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title="订单填写" onBack={onBack} />
      </div>
      <div className="detail-wrapper">
        <Detail
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber}
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
        >
          <span style={{ display: 'block' }} className="train-icon"></span>
        </Detail>
      </div>
      <Ticket price={price} type={seatType} />
      <Passengers passengers={passengers} {...passengersCbs} />
      {passengers.length > 0 && (
        <Choose passengers={passengers} {...chooseCbs} />
      )}
      <Account length={passengers.length} price={price} />
      <Menu show={isMenuVisible} {...menu} {...menuCbs} />
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
