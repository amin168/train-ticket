// Alt-Shift-Ctrl-P

import React, { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import { createSet, createAdd, createRemove, createToggle } from './action'

let idSeq = Date.now()

function Control(props) {
  const { dispatch } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) return

    dispatch(
      createAdd({
        id: ++idSeq,
        text: newText,
        complete: false
      })
    )

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
}

function TodoItem(props) {
  const {
    todo: { id, text, complete },
    dispatch
  } = props

  const onChange = () => {
    dispatch(createToggle(id))
  }

  const onRemove = () => {
    dispatch(createRemove(id))
  }

  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  )
}

function Todos(props) {
  const { todos, dispatch } = props

  return (
    <ul>
      {todos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
      })}
    </ul>
  )
}

const LS_KEY = 'TODO_KEYS'

function TodoList() {
  const [todos, setTodos] = useState([])

  // 由于这三个函数需要传递到子组件中，所以需要用useCallback
  const addTodo = useCallback(todo => {
    setTodos(todos => [...todos, todo])
  }, [])

  const removeTodo = useCallback(id => {
    setTodos(todos =>
      todos.filter(todo => {
        return todo.id !== id
      })
    )
  }, [])

  const toggleTodo = useCallback(id => {
    setTodos(todos =>
      todos.map(todo => {
        return todo.id === id ? { ...todo, complete: !todo.complete } : todo
      })
    )
  }, [])

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
    dispatch(createSet(todos))
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todo-list">
      <Control dispatch={dispatch} />
      <Todos dispatch={dispatch} dispatch={dispatch} todos={todos} />
    </div>
  )
}

export default TodoList
