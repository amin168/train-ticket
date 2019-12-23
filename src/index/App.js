import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header'
import DepartDate from './DepartDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'
import Submit from './Submit'

import CitySelector from '../common/CitySelector'

import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity
} from './actions'

function App(props) {
    const {
        from,
        to,
        isCitySelectorVisible,
        cityData,
        isLoadingCityData,
        dispatch
    } = props

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    // const doExchangeFromTo = useCallback(() => {
    //     dispatch(exchangeFromTo())
    // }, [])
    //
    // const doShowCitySelector = useCallback(m => {
    //     dispatch(showCitySelector(m))
    // }, [])

    // bindActionCreators每次都返回新的函数集合，和useCallback是冲突的
    // 因为useCallback每次都返回缓存的函数
    // 所以要用 useMemo 返回缓存的变量
    const cbs = useMemo(() => {
        return bindActionCreators(
            {
                exchangeFromTo,
                showCitySelector
            },
            dispatch
        )
        // eslint-disable-next-line
    }, [])

    const citySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData,
                onSelect: setSelectedCity
            },
            dispatch
        )
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} />
            </div>
            <form className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate />
                <HighSpeed />
                <Submit />
            </form>
            <CitySelector
                {...citySelectorCbs}
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
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
