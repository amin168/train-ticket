// Alt-Shift-Ctrl-P

import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import './App.css'
import { createAdd, createRemove, createToggle } from './action'
import reducer from './reducers'

let idSeq = Date.now()

function bindActionCreators(actionCreators, dispatch) {
  const ret = {}

  for (let key in actionCreators) {
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }

  return ret
}

const Control = memo(function Control(props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) return

    addTodo({ id: ++idSeq, text: newText, complete: false })

    inputRef.current.value = ''
  }

  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </div>
  )
})

const TodoItem = memo(function TodoItem(props) {
  const {
    todo: { id, text, complete },
    removeTodo,
    toggleTodo
  } = props

  const onChange = () => {
    toggleTodo(id)
  }

  const onRemove = () => {
    removeTodo(id)
  }

  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  )
})

const Todos = memo(function Todos(props) {
  const { todos, removeTodo, toggleTodo } = props

  return (
    <ul>
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
          />
        )
      })}
    </ul>
  )
})

const LS_KEY = 'TODO_KEYS'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  // 它的作用是，接收当前的数据和一个action，反正通过action，更新之后的数据
  // function reducer(state, action) {
  //     const { type, payload } = action
  //     const { todos, incrementCount } = state
  //
  //     switch (type) {
  //         case 'set':
  //             return {
  //                 ...state,
  //                 todos: payload,
  //                 incrementCount: incrementCount + 1
  //             }
  //     }
  //
  //     return state
  // }

  // disptach是作为属性传入到子组件当中的，所有要用 useCallback
  const dispatch = useCallback(
    action => {
      const state = {
        todos,
        incrementCount
      }

      const setters = {
        todos: setTodos,
        incrementCount: setIncrementCount
      }

      const newState = reducer(state, action)

      // 新旧state可能会有不同，所以要重新设置
      for (let key in newState) {
        // 设置对应key的新值
        setters[key](newState[key])
      }

      // action.reduce(function(lastTodos, action) {
      //     return [...lastTodos, action.payload]
      // }, todos)
    },
    [todos, incrementCount]
  )

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY)) || '[]'
    setTodos(todos)
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todo-list">
      <Control
        {...bindActionCreators(
          {
            addTodo: createAdd
          },
          dispatch
        )}
      />
      <Todos
        {...bindActionCreators(
          {
            removeTodo: createRemove,
            toggleTodo: createToggle
          },
          dispatch
        )}
        todos={todos}
      />
    </div>
  )
}

export default TodoList
