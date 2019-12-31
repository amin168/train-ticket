// 出发日期

import './Submit.css'
import React, { memo } from 'react'

export default memo(function Submit() {
  return (
    <div className="submit">
      <button type="submit" className="submit-button">
        搜索
      </button>
    </div>
  )
})
