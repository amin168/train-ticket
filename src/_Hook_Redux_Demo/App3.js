// Alt-Shift-Ctrl-P

import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import './App.css'
import { createAdd, createRemove, createToggle } from './action'

let idSeq = Date.now()

// {...bindActionCreators(
//     {
//         addTodo: createAdd
//     },
//     dispatch
// )}

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

  // disptach是作为属性传入到子组件当中的，所有要用 useCallback，第二个参数为[]，因为没有对任何参数进行依赖
  const dispatch = useCallback(action => {
    const { type, payload } = action
    switch (type) {
      case 'set':
        setTodos(payload)
        break
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'remove':
        setTodos(todos =>
          todos.filter(todo => {
            return todo.id !== payload
          })
        )
        break
      case 'toggle':
        setTodos(todos =>
          todos.map(todo => {
            return todo.id === payload
              ? { ...todo, complete: !todo.complete }
              : todo
          })
        )
        break
      default:
    }
  }, [])

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
