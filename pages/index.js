import Head from 'next/head'
import React from 'react'
import TaskList from 'components/TaskList'
import TaskListItem from 'components/TaskListItem'
import TaskInput from 'components/TaskInput'



export default class Home extends React.Component {
  state = {
    tasks: []
  }


  componentDidMount () {
    const storageTasks = window.localStorage.getItem('tasks')
    if (storageTasks) {
      try {
        this.setState({tasks: JSON.parse(storageTasks)})
      } catch (e) {

      }
    }
  }


  updateTaskStatus = (index, status) => {
    const {tasks} = this.state
    tasks[index].status = status
    tasks[index].lastModified = Date.now()
    this.setState({tasks}, this.updateStorage)
  }

  updateStorage =  () => localStorage.setItem('tasks', JSON.stringify(this.state.tasks))

  render () {
    const {tasks} = this.state
    return (
      <div className='container'>
        <Head>
          <title>Todo Task Web App</title>
          <link rel='icon' href='/favicon.ico' />
          <link
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Roboto+Mono:400,500|Material+Icons'
            rel='stylesheet'
          />
        </Head>
        <main style={{ maxWidth: '966px', margin: 'auto' }}>
          <TaskInput onAdd={(task) => this.setState({tasks: [...tasks, task]}, this.updateStorage)} />
          <TaskList>
            {tasks.map((task, index) => {
              return (
                <TaskListItem onChange={status => this.updateTaskStatus(index, status)} index={index} key={task.lastModified || task.id} status={task.status}>
                  {task.title}
                </TaskListItem>
              )
            })}
          </TaskList>
        </main>
      </div>
    )
  }


}
