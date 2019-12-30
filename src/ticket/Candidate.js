import React, { memo, useMemo, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import dayjs from 'dayjs'
import { TrainContext } from './context'
import './Candidate.css'

const Channel = memo(function Channel(props) {
    const { name, desc, type } = props

    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate
    } = useContext(TrainContext)

    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString()
    }, [type, trainNumber, departStation, arriveStation, departDate])

    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    )
})

Channel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

const Seat = memo(function Seat(props) {
    const {
        type,
        priceMsg,
        ticketsLeft,
        channels,
        expanded,
        onToggle,
        idx
    } = props

    return (
        <li>
            <div className="bar" onClick={() => onToggle(idx)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>￥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预定' : '收起'}</span>
                <span className="num">{ticketsLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0 }}
            >
                {channels.map(channel => {
                    return (
                        <Channel key={channel.name} {...channel} type={type} />
                    )
                })}
            </div>
        </li>
    )
})

Seat.propTypes = {
    type: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    ticketsLeft: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired
}

const Candidate = memo(function Candidate(props) {
    const { tickets } = props

    const [expandedIndex, setExpandedIndex] = useState(-1)

    const onToggle = useCallback(
        idx => {
            setExpandedIndex(idx === expandedIndex ? -1 : idx)
        },
        [expandedIndex]
    )

    return (
        <div className="candidate">
            <ul>
                {tickets.map((ticket, idx) => {
                    return (
                        <Seat
                            idx={idx}
                            key={ticket.type}
                            {...ticket}
                            onToggle={onToggle}
                            expanded={expandedIndex === idx}
                        />
                    )
                })}
            </ul>
        </div>
    )
})

Candidate.propTypes = {
    tickets: PropTypes.array.isRequired
    // trainNumber: PropTypes.number.isRequired,
    // departStation: PropTypes.string.isRequired,
    // arriveStation: PropTypes.string.isRequired,
    // departDate: PropTypes.string.isRequired
}

export default Candidate
