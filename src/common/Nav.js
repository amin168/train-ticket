// 日期导航控件

import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import './Nav.css'

// 只使用props的数据输入，所以可以用memo达到重渲染
const Nav = memo(function Nav(props) {
    const {
        date, //当前unix的时间戳表示
        prev, //前一天的点击响应
        next, //后一天的点击响应
        isPrevDisabled,
        isNextDisabled
    } = props

    const currentString = useMemo(() => {
        const d = dayjs(date)
        return d.format('M月D日') + d.locale('zh-cn').format('ddd')
    }, [date])

    return (
        <div className="nav">
            <span
                onClick={prev}
                className={classnames('nav-prev', {
                    'nav-disabled': isPrevDisabled
                })}
            >
                前一天
            </span>
            <span className="nav-current">{currentString}</span>
            <span
                onClick={next}
                className={classnames('nav-next', {
                    'nav-disabled': isNextDisabled
                })}
            >
                后一天
            </span>
        </div>
    )
})

Nav.propTypes = {
    date: PropTypes.number.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    isPrevDisabled: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired
}

export default Nav
