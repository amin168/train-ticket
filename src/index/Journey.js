import './Journey.css'
import switchImg from './imgs/switch.svg'
import React from 'react'
import PropTypes from 'prop-types'

export default function Journey(props) {
  const { from, to, exchangeFromTo, showCitySelector } = props

  return (
    <div className="journey">
      <div className="journey-station" onClick={() => showCitySelector(true)}>
        <input
          type="text"
          readOnly="readOnly"
          name="from"
          value={from}
          className="journey-input journey-form"
        />
      </div>
      <div className="journey-switch" onClick={() => exchangeFromTo()}>
        <img src={switchImg} width="70" height="40" alt="switch" />
      </div>
      <div className="journey-station" onClick={() => showCitySelector(false)}>
        <input
          type="text"
          readOnly="readOnly"
          name="to"
          value={to}
          className="journey-input journey-to"
        />
      </div>
    </div>
  )
}

Journey.propTypes = {
  exchangeFromTo: PropTypes.func.isRequired,
  showCitySelector: PropTypes.func.isRequired
}
