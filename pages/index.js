import Head from 'next/head'
import React from 'react'
import TaskList from 'components/TaskList'
import TaskListItem from 'components/TaskListItem'
import TaskInput from 'components/TaskInput'
import {withRouter} from 'next/router'
import * as firebase from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
import 'firebase/database'
import {mergeUniqueTaskList} from '../utils'
import SignIn from '../components/SignIn'
import Loader from '../components/Loader'
import ButtonAppBar from '../components/ButtonAppBar'


try {
  firebase.initializeApp(firebaseConfig)
} catch (e) {
  console.log('firebase', firebase.app().name)
}


class Home extends React.Component {
  state = {
    tasksMap: {},
    user: null,
    loaded: false,
    gotData: false,
    clientKey: Math.random()
  }

  componentDidMount () {
    const token = localStorage.getItem('todo-token')
    const loginMethod = localStorage.getItem('login-method')
    if (!token || !loginMethod) {
      this.setState({loaded: true})
    } else {
      switch (loginMethod) {
        case 'google':
          return this.getGoogleUserInfo(token)

        case 'email':
          return this.getEmailUserInfo(token)
        default:
          return this.setState({loaded: true})
      }
    }
  }

  componentWillUnmount () {
    this.updateStorage()
  }

  signOut = () => {
    localStorage.removeItem('todo-token')
    localStorage.removeItem('login-method')
    localStorage.removeItem('tasks')
    this.setState({user: null})
  }

  signIn = (user, signInMethod) => {
    switch (signInMethod) {
      case 'google':
        return this.setState({user}, this.getData)
      case 'email':
        const userInfo = {
          email: user.email,
          id: user.localId
        }
        return this.setState({user: userInfo}, this.getData)
    }
  }

  getEmailUserInfo = token => {
    const googleServiceURL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup'
    const param = '?key=' + firebaseConfig.apiKey
    const data = {idToken: token}
    const URL = googleServiceURL + param
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(result => {
      if (result.status === 200) return result.json()
      else this.signOut()
    }).then(data => {
      const userInfo = data.users[0]
      const user = {...userInfo, id: userInfo.localId}
      this.setState({user}, this.getData)
    }).catch(e => this.signOut())
  }

  getGoogleUserInfo = token => {
    const googleServiceURL = 'https://www.googleapis.com/oauth2/v3/userinfo'
    const headers = {Authorization: `Bearer ${token}`}
    fetch(googleServiceURL, {headers})
    .then(res => {
      if (res.status === 200) return res.json()
      else this.signOut()
    })
    .then(user => {
      user.id = user.sub
      this.setState({user}, this.getData)
    })
    .catch(e => this.signOut())
  }

  getData = () => {
    const {user} = this.state
    const storageTasks = localStorage.getItem('tasks')
    let parsedStorageTasks = []
    if (storageTasks) {
      try {
        parsedStorageTasks = JSON.parse(storageTasks)
      } catch (e) {

      }
    }
    const database = firebase.database().ref('data/' + user.id)
    database.once('value').then(result => {
      const firebaseTask = result.toJSON()
      if (!firebaseTask) {
        firebase.database().ref('data').update({[user.id]: parsedStorageTasks})
        this.setState({task: parsedStorageTasks, gotData: true})
      } else {
        const tasksMap = mergeUniqueTaskList(parsedStorageTasks, firebaseTask)
        this.setState({tasksMap, gotData: true})
        firebase.database().ref('data').update({[user.id]: tasksMap})
      }
    })

    database.on('child_changed', snapshot => {
      const {tasksMap} = this.state
      const task = snapshot.toJSON()
      this.setState({tasksMap: {...tasksMap, [task.id]: task}})
    })

    database.on('child_added', (snapshot) => {
      const {tasksMap} = this.state
      const task = snapshot.toJSON()
      this.setState({tasksMap: {...tasksMap, [task.id]: task}})
    })

  }

  updateTaskStatus = (id, status) => {
    const {tasksMap} = this.state
    tasksMap[id].status = status
    tasksMap[id].lastModified = Date.now()
    this.setState({tasksMap}, () => this.updateData(tasksMap[id]))
  }

  addTask = task => {
    const {tasksMap} = this.state
    tasksMap[task.id] = task
    this.setState({tasksMap}, () => this.updateData(task))

  }

  updateStorage = () => localStorage.setItem('tasks', JSON.stringify(this.state.tasksMap))
  updateData = task => {
    const {user} = this.state
    firebase.database().ref('data/' + user.id).update({[task.id]: task})
  }

  render () {
    const {tasksMap, user, loaded, gotData} = this.state
    const tasks = Object.keys(tasksMap).map(taskId => tasksMap[taskId]).sort((a, b) => b.id - a.id)
    if (loaded && !user) return <SignIn onSignIn={this.signIn} />
    if (!loaded && !user) return null
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
        <main style={{maxWidth: '966px', margin: '90px auto'}}>
          <ButtonAppBar user={user} onSignOut={this.signOut} />
          <TaskInput onAdd={this.addTask} />
          <TaskList>
            {!gotData && <Loader>Loading tasks. Please wait...</Loader>}
            {gotData && tasks.length === 0 && <div style={{background: '#fff', lineHeight: '44px', padding: '0 16px'}}>
              <i>You have no task to do. Create a new task to begin...</i>
            </div>}
            {gotData && tasks.map((task) => {
              return (
                <TaskListItem
                  onChange={status => this.updateTaskStatus(task.id, status)}
                  key={task.id}
                  status={task.status}>
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

export default withRouter(Home)
