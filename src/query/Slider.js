import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import leftPad from 'left-pad'
import useWinSize from '../common/useWinSize'
import './Slider.css'

const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged
    } = props

    const winSize = useWinSize()

    const startHandle = useRef()
    const endHandle = useRef()

    const lastStartX = useRef()
    const lastEndX = useRef()

    // 用来保存当前浏览器窗口宽度
    const range = useRef()
    const rangWidth = useRef()

    const [start, setStart] = useState(() => (currentStartHours / 24) * 100)
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100)

    const startPercent = useMemo(() => {
        if (start > 100) return 100

        if (start < 0) return 0

        return start
    }, [start])

    const endPercent = useMemo(() => {
        if (end > 100) return 100

        if (end < 0) return 0

        return end
    }, [end])

    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100)
    }, [startPercent])

    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100)
    }, [endPercent])

    const startText = useMemo(() => {
        return `${leftPad(startHours, 2, '0')}:00`
    }, [startHours])

    const endText = useMemo(() => {
        return `${leftPad(endHours, 2, '0')}:00`
    }, [endHours])

    function onStartTouchBegin(e) {
        const touch = e.targetTouches[0]
        lastStartX.current = touch.pageX
    }

    function onStartTouchMove(e) {
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastStartX.current
        lastStartX.current = touch.pageX

        // 上一次计算后StartX的值 + 这次移动的值
        setStart(start => start + (distance / rangWidth.current) * 100)
    }

    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0]
        lastEndX.current = touch.pageX
    }

    function onEndTouchMove(e) {
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastEndX.current
        lastEndX.current = touch.pageX

        setEnd(end => end + (distance / rangWidth.current) * 100)
    }

    useEffect(() => {
        // eslint-disable-next-line
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        )
        // eslint-disable-next-line
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        )
        // eslint-disable-next-line
        endHandle.current.addEventListener('touchstart', onEndTouchBegin, false)

        // eslint-disable-next-line
        endHandle.current.addEventListener('touchmove', onEndTouchMove, false)

        return () => {
            // eslint-disable-next-line
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            )

            // eslint-disable-next-line
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            )

            // eslint-disable-next-line
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            )

            // eslint-disable-next-line
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            )
        }
    })

    useEffect(() => {
        // eslint-disable-next-line
        rangWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    }, [winSize.width])

    useEffect(() => {
        onStartChanged(startHours)
        // eslint-disable-next-line
    }, [startHours])

    useEffect(() => {
        onEndChanged(endHours)
        // eslint-disable-next-line
    }, [endHours])

    return (
        <div className="option">
            <h3> {title} </h3>
            <div className="range-slider">
                <div className="slider" ref={range}>

                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{
                            left: startPercent + '%'
                        }}
                    >
                        <span>{startText}</span>
                    </i>
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{
                            left: endPercent + '%'
                        }}
                    >
                        <span>{endText}</span>
                    </i>
                </div>
            </div>
        </div>
    )
})

Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired
}

export default Slider
