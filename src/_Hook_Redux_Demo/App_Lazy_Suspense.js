// Lazy Suspense demo

import React, { Component, lazy, Suspense } from 'react'

// code spilling 自定义命名
const About = lazy(() => import(/* webpackChunckName:"about" */ './About'))

// ErrorBoundary 错误边界

class App extends Component {
  state = {
    hasError: false
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }

  // componentDidCatch(error, errorInfo) {
  //     this.setState({
  //         hasError: true
  //     })
  // }

  render() {
    if (this.state.hasError) {
      return <div>error</div>
    }

    return (
      <div>
        <Suspense fallback={<div>Loading..</div>}>
          <About />
        </Suspense>
      </div>
    )
  }
}

export default App
