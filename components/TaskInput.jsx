import { useState } from 'react'
import Button from '@material-ui/core/Button'

export default ({ onAdd }) => {
  const [taskTitle, updateTaskTitle] = useState('')
  const addTask = () => {
    if (onAdd && taskTitle) {
      onAdd({
        id: Date.now(),
        title: taskTitle,
        status: 'todo'
      })
    }
    updateTaskTitle('')
  }
  return (
    <>
      <form className="container" onSubmit={(e) => {
        e.preventDefault()
        addTask()
      }} >
        <input className="task-input" type="text" value={taskTitle} onChange={(e) => updateTaskTitle(e.currentTarget.value)} />
      </form>
      <style jsx>{`
      .container {
        display: flex;
        margin: 16px 0px;
      }
      .task-input {
        appearance: none;
        padding: 8px 4px;
        display: block;
        flex: 1;
        border: 1px solid #dedede;
        border-radius: 2px;
      }
      `}</style>
    </>
  )
}