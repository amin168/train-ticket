import React from 'react'
import './DateSelector.css'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { h0 } from '../common/fp'

import Header from './Header'

function Day(props) {
  const { day, onSelect } = props

  if (!day)
    //如果day是null
    return <td className="null" />

  const classes = []
  const now = h0()
  if (day < now) {
    // 如果是过去的一天
    classes.push('disabled')
  }

  if ([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend')
  }

  // getDate : 从 Date 对象返回一个月中的某一天 (1 ~ 31)
  const dateString = now === day ? '今天' : new Date(day).getDate()

  return (
    <td className={classnames(classes)} onClick={() => onSelect(day)}>
      {dateString}
    </td>
  )
}

Day.propTypes = {
  day: PropTypes.number,
  onSelect: PropTypes.func.isRequired
}

function Week(props) {
  const { days, onSelect } = props

  return (
    <tr className="date-table-days">
      {days.map((day, index) => {
        return <Day key={index} day={day} onSelect={onSelect} />
      })}
    </tr>
  )
}

Week.propTypes = {
  days: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

function Month(props) {
  // 要渲染三个月

  const {
    // 这个月第一天的零时刻，用每个月的第一天的零时零分零秒来代表这个月
    startingTimeInMonth,
    onSelect
  } = props

  // 获取这个月的所有日期
  const startDay = new Date(startingTimeInMonth)
  const currentDay = new Date(startingTimeInMonth)

  let days = []

  // 直到月份不相等，就跳出循环
  while (currentDay.getMonth() === startDay.getMonth()) {
    days.push(currentDay.getTime()) //放入这一天的零时刻
    currentDay.setDate(currentDay.getDate() + 1)
  }

  // 补齐空白，当前月是星期几就补齐这个数字-1个，星期日的话，就补齐6个

  // 获取到星期几，如果是星期日的会返回0，0代表false
  // 这是前面的补齐操作
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
    .fill(null)
    .concat(days)

  // 后面的数字是星期几就补齐7-这个数字，星期日不需要补齐
  // 先获取最后一天
  const lastDay = new Date(days[days.length - 1])

  days = days.concat(
    new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
  )

  // 最后要把日期，以周为单位分组，经过前后补齐后，days数组长度是7的倍数

  const weeks = []
  for (let row = 0; row < days.length / 7; ++row) {
    const week = days.slice(row * 7, (row + 1) * 7) //计算起点和终点
    // console.log(week)
    weeks.push(week)
  }

  return (
    <table className="date-table">
      <thead>
        <tr>
          <td colSpan="7">
            <h5>
              {startDay.getFullYear()}年{startDay.getMonth() + 1}月
            </h5>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr className="date-table-weeks">
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th className="weekend">周六</th>
          <th className="weekend">周日</th>
        </tr>
        {weeks.map((week, index) => {
          return <Week key={index} days={week} onSelect={onSelect} />
        })}
      </tbody>
    </table>
  )
}

Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default function DateSelector(props) {
  const { show, onSelect, onBack } = props

  const now = new Date() //获取当前月
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  now.setDate(1) //重置为1号

  const monthSequence = [now.getTime()] // 这样就可以获取当前月的零时刻

  // 计算未来两个月的
  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime()) //这里就是下个月的零食可

  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime())

  return (
    <div className={classnames('date-selector', { hidden: !show })}>
      <Header title="日期选择" onBack={onBack} />
      <div className="date-selector-tables">
        {monthSequence.map(month => {
          return (
            <Month
              key={month}
              onSelect={onSelect}
              startingTimeInMonth={month}
            />
          )
        })}
      </div>
    </div>
  )
}

DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
}
