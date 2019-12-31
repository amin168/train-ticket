import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import './List.css'

const ListItem = memo(function ListItem(props) {
  const {
    dTime, // 出发时间
    aTime, // 到达时间
    dStation, // 出发车站
    aStation, // 到达车站
    trainNumber, // 车次
    date, // 出发日期
    time, // 运行时间
    priceMsg, // 价格的字符串表示
    dayAfter // 是否跨越日期的标识
  } = props

  const url = useMemo(() => {
    return new URI('ticket.html')
      .setSearch('aStation', aStation)
      .setSearch('dStation', dStation)
      .setSearch('trainNumber', trainNumber)
      .setSearch('date', date)
      .toString()
  }, [aStation, dStation, trainNumber, date])

  return (
    <li className="list-item">
      <a href={url}>
        <span className="item-time">
          <em>{dTime}</em>
          <br />
          <em className="em-light">
            {aTime}
            <i className="time-after">{dayAfter}</i>
          </em>
        </span>
        <span className="item-stations">
          <em>
            <i className="train-station train-start">始</i>
            {dStation}
          </em>
          <br />
          <em className="em-light">
            <i className="train-station train-end">终</i>
            {aStation}
          </em>
        </span>
        <span className="item-train">
          <em>{trainNumber}</em>
          <br />
          <em className="em-light">{time}</em>
        </span>
        <span className="item-ticket">
          <em>{priceMsg}</em>
          <br />
          <em className="em-light-orange">可抢票</em>
        </span>
      </a>
    </li>
  )
})

ListItem.propTypes = {
  dTime: PropTypes.string.isRequired,
  aTime: PropTypes.string.isRequired,
  dStation: PropTypes.string.isRequired,
  aStation: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  priceMsg: PropTypes.string.isRequired,
  dayAfter: PropTypes.string.isRequired
}

const List = memo(function List(props) {
  const { list } = props

  return (
    <ul className="list">
      {list.map(item => (
        <ListItem {...item} key={item.trainNumber} />
      ))}
    </ul>
  )
})

List.propTypes = {
  list: PropTypes.array.isRequired
}

export default List
