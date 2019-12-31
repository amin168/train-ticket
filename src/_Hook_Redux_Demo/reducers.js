function combineReducers(reducers) {
  return function reducer(state, action) {
    const changed = {}
    // 新旧state可能会有不同，所以要重新设置
    for (let key in reducers) {
      // 设置对应key的新值
      changed[key] = reducers[key](state[key], action)
    }

    return {
      ...state,
      ...changed
    }
  }
}

const reducers = {
  todos(state, action) {
    const { type, payload } = action
    switch (type) {
      case 'set':
        return {
          payload
        }
      case 'add':
        return [...state, payload]
      case 'remove':
        return state.filter(todo => {
          return todo.id !== payload
        })
      case 'toggle':
        return state.map(todo => {
          return todo.id === payload
            ? { ...todo, complete: !todo.complete }
            : todo
        })
    }
    return state
  },
  incrementCount(state, action) {
    const { type } = action

    switch (type) {
      case 'set':
      case 'add':
        return state + 1
    }
    return state
  }
}

export default combineReducers(reducers)
