// createContext demo

import React, { Component, createContext } from 'react'

const BatteryContext = createContext()
const OnlineContext = createContext()

class Leaf extends Component {
    render() {
        return (
            <BatteryContext.Consumer>
                {battery => (
                    <OnlineContext.Consumer>
                        {online => (
                            <h1>
                                Battery:{battery}, Online:{String(online)}
                            </h1>
                        )}
                    </OnlineContext.Consumer>
                )}
            </BatteryContext.Consumer>
        )
    }
}

class Middle extends Component {
    render() {
        return <Leaf />
    }
}

class App extends Component {
    state = {
        battery: 60,
        online: false
    }

    render() {
        const { battery, online } = this.state

        // 只需把Context嵌套就可以，顺序不重要

        return (
            <BatteryContext.Provider value={battery}>
                <OnlineContext.Provider value={online}>
                    <button
                        type="button"
                        onClick={() => this.setState({ battery: battery + 1 })}
                    >
                        Press
                    </button>
                    <button
                        type="button"
                        onClick={() => this.setState({ online: !online })}
                    >
                        Switch
                    </button>
                    <Middle />
                </OnlineContext.Provider>
            </BatteryContext.Provider>
        )
    }
}

export default App
