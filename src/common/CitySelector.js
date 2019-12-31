import './CitySelector.css'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CityItem = memo(function CityItem(props) {
  const { name, onSelect } = props
  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  )
})

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const CitySection = memo(function CitySection(props) {
  const { title, cities, onSelect } = props

  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={title}>
        {title}
      </li>
      {Boolean(cities) &&
        cities.map(city => {
          return (
            <CityItem key={city.name} name={city.name} onSelect={onSelect} />
          )
        })}
    </ul>
  )
})

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

const AlphaIndex = memo(function AlphaIndex(props) {
  const { alpha, onClick } = props

  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>
      {alpha}
    </i>
  )
})

AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

// 生成A-Z
const alphabet = Array.from(new Array(26), (ele, index) => {
  return String.fromCharCode(65 + index)
})

const CityList = memo(function CityList(props) {
  const { sections, onSelect, toAlpha } = props

  return (
    <div className="city-list">
      <div className="city-cate">
        {sections.map(section => {
          return (
            <CitySection
              key={section.title}
              title={section.title}
              cities={section.citys}
              onSelect={onSelect}
            />
          )
        })}
      </div>
      <div className="city-index">
        {alphabet.map(alpha => {
          return <AlphaIndex key={alpha} alpha={alpha} onClick={toAlpha} />
        })}
      </div>
    </div>
  )
})

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired
}

const SuggestItem = memo(function SuggestItem(props) {
  const { name, onClick } = props

  return (
    <li className="city-suggest-li" onClick={() => onClick(name)}>
      {name}
    </li>
  )
})

SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

const Suggest = memo(function Suggest(props) {
  const { searchKey, onSelect } = props

  const [result, setResult] = useState([])

  useEffect(() => {
    // 加这个变量是为了解决以下警告
    // can't perform a react state update on an unmounted component hooks
    // https://stackoverflow.com/questions/56442582/react-hooks-cant-perform-a-react-state-update-on-an-unmounted-component
    let isCancelled = false

    fetch('/rest/search?key=' + encodeURIComponent(searchKey))
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {
          const { result, searchKey: sKey } = data

          if (sKey === searchKey) setResult(result)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [searchKey])

  const fallBackResult = useMemo(() => {
    if (!result.length) return [{ display: searchKey }]

    return result
  }, [result, searchKey])

  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {fallBackResult.map(item => {
          return (
            <SuggestItem
              key={item.display}
              name={item.display}
              onClick={onSelect}
            />
          )
        })}
      </ul>
    </div>
  )
})

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default function CitySelector(props) {
  const { onBack, show, cityData, isLoading, fetchCityData, onSelect } = props

  const [searchKey, setSearchKey] = useState('')

  const key = useMemo(() => searchKey.trim(), [searchKey])

  useEffect(() => {
    if (!show || isLoading || cityData) return

    fetchCityData()
    // eslint-disable-next-line
  }, [show, isLoading, cityData])

  const toAlpha = useCallback(alpha => {
    document.querySelector(`[data-cate='${alpha}']`).scrollIntoView()
  }, [])

  const outputCitySection = () => {
    if (isLoading) {
      return <div>Loading...</div>
    }

    if (cityData) {
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      )
    }
  }

  return (
    <div
      className={classnames('city-selector', {
        hidden: !show
      })}
    >
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站或中文或拼音"
            onChange={e => setSearchKey(e.target.value)}
          />
        </div>
        <i
          className={classnames('search-clean', {
            hidden: key.length === 0
          })}
          onClick={() => setSearchKey('')}
        >
          &#xf063;
        </i>
      </div>
      {Boolean(key) && (
        <Suggest searchKey={key} onSelect={key => onSelect(key)} />
      )}
      {outputCitySection()}
    </div>
  )
}

CitySelector.propTypes = {
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
}
