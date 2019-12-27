import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import dayjs from 'dayjs'

import classnames from 'classnames'
import leftpad from 'left-pad'

import './Schedule.css'

// 显示这趟列车的全部停靠站以及时间，位于买票区间之外的，就是灰色，区间内的就是黑色。
// 所以对于每一行，要知道位于出发站之前，还是到达站之后，或者就是中间经过的车站
// 如果就是出发车站或者到达车站，在时间的显示上，有红色加重；
// 如果是整躺列车的始发站，或终到站，那么在时间和停留时长上也会不同

// 1. 出发车站之前，到达车站之后，这一行整体是灰色的
// 2. 到达时间：如果是整躺列车的始发站，它会显示汉字“始发站”，如果是旅程的终到站那么时间的红色
// 3. 发车时间：如果是旅程的出发车站，文字是红色，如果是整躺列车的终到站，它会显示汉字“终到站”

const ScheduleRow = memo(function Schedule(props) {
    const {
        index, //序号
        station, // 车站名
        arriveTime, // 到达时间
        departTime, // 发车时间
        stay, // 停留时长

        isStartStation, // 是否是始发站
        isEndStation, // 是否是终到站
        isDepartStation, // 是否是出发车站
        isArriveStation, // 是否是到达车站
        beforeDepartStation, // 是否是出发车站之前
        afterArriveStation // 是否在到达车站之后
    } = props

    return (
        <li>
            <div
                className={classnames('icon', {
                    'icon-red': isDepartStation || isArriveStation
                })}
            >
                {isDepartStation
                    ? '出'
                    : isArriveStation
                    ? '到'
                    : leftpad(index, 2, 0)}
            </div>
            <div
                className={classnames('row', {
                    grey: beforeDepartStation || afterArriveStation
                })}
            >
                {/*车站*/}
                <span
                    className={classnames('station', {
                        red: isArriveStation || isDepartStation
                    })}
                >
                    {station}
                </span>

                {/*到达时间*/}
                <span
                    className={classnames('arrtime', {
                        red: isArriveStation
                    })}
                >
                    {isStartStation ? '始发站' : arriveTime}
                </span>
                {/*发车时间*/}
                <span
                    className={classnames('deptime', {
                        red: isDepartStation
                    })}
                >
                    {isEndStation ? '终到站' : departTime}
                </span>
                <span className="stoptime">
                    {isStartStation || isEndStation ? '-' : stay + '分'}
                </span>
            </div>
        </li>
    )
})

ScheduleRow.propTypes = {}

const Schedule = memo(function Schedule(props) {
    const { date, trainNumber, departStation, arriveStation } = props

    const [scheduleList, setScheduleList] = useState([])

    useEffect(() => {
        const url = new URI('/rest/schedule')
            .setSearch('trainNumber', trainNumber)
            .setSearch('departStation', departStation)
            .setSearch('arriveStation', arriveStation)
            .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
            .toString()

        fetch(url)
            .then(res => res.json())
            .then(data => {
                let departRow // 出发车站
                let arriveRow // 到达车站

                for (let i = 0; i < data.length; ++i) {
                    //有没有找到出发车站
                    if (!departRow) {
                        // 如果没有找到，要么当前车站就是出发车站
                        // 要么就是在出发车站之前
                        if (data[i].station === departStation) {
                            // 那么当前车站就是出发车站
                            departRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: true,
                                afterArriveStation: false,
                                isArriveStation: false
                            })
                        } else {
                            // 当前车站不是出发车站，那么就是在出发车站之前
                            Object.assign(data[i], {
                                beforeDepartStation: true,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false
                            })
                        }
                    } else if (!arriveRow) {
                        // 如果找到了出发车站，还没有找到到达车站

                        if (data[i].station === arriveStation) {
                            // 当前车站就是到达车站
                            arriveRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: true
                            })
                        } else {
                            // 当前车站就是出发车站和到达车站之间，中途经过的车站
                            Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false
                            })
                        }
                    } else {
                        // 找到了出发车站和到达车站，那么当前车站就是到达车站之后
                        Object.assign(data[i], {
                            beforeDepartStation: false,
                            isDepartStation: false,
                            afterArriveStation: true,
                            isArriveStation: false
                        })
                    }

                    Object.assign(data[i], {
                        isStartStation: i === 0,
                        isEndStation: i === data.length - 1
                    })
                }

                setScheduleList(data)
            })
    }, [date, trainNumber, departStation, arriveStation])

    return (
        <div className="schedule">
            <div className="dialog">
                <h1>列车时刻表</h1>
                <div className="head">
                    <span className="station">车站</span>
                    <span className="deptime">到达</span>
                    <span className="arrtime">发车</span>
                    <span className="stoptime">停留时间</span>
                </div>
                <ul>
                    {scheduleList.map((schedule, index) => {
                        return (
                            <ScheduleRow
                                key={schedule.station}
                                index={index + 1}
                                {...schedule}
                            />
                        )
                    })}
                </ul>
            </div>
        </div>
    )
})

Schedule.propTypes = {
    date: PropTypes.number.isRequired,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired
}

export default Schedule
