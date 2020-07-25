import React, {useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import {
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  ButtonGroup
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import SinInIcon from '@material-ui/icons/LockOpen'
import SignUpIcon from '@material-ui/icons/PersonAdd'
import {makeStyles} from '@material-ui/core/styles'
import Divider from './Divider'
import {useRouter} from 'next/router'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../firebaseConfig'
import {ValidateEmail} from '../utils'


try {
  firebase.initializeApp(firebaseConfig)
} catch (e) {
  console.log('firebase', firebase.app().name)
}


function Copyright () {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://chiendezign.info/">
        Chiendezign
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  google: {
    margin: theme.spacing(1, 0)
  },
  error: {
    margin: theme.spacing(1, 0),
    color: '#900'
  }
}))


const googleSignInProvider = new firebase.auth.GoogleAuthProvider()
// const facebookSignInProvider = new firebase.auth.FacebookAuthProvider()

export default function SignIn ({onSignIn}) {
  const classes = useStyles()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])

  const googleSignIn = () => {
    firebase.auth().signInWithPopup(googleSignInProvider).then(result => {
      const token = result.credential.accessToken
      const user = result.additionalUserInfo.profile
      localStorage.setItem('todo-token', token)
      localStorage.setItem('login-method', 'google')
      onSignIn(user, 'google')
      router.push('/')
    }).catch(function (error) {
      // TODO: handle google sign in error
      console.log(error)
    })
  }

  const facebookSignIn = () => alert('This feature is on development.')

  const signUp = () => {
    if (!validateData()) return
    firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
      const user = result.user.toJSON()
      localStorage.setItem('todo-token', user.stsTokenManager.accessToken)
      localStorage.setItem('login-method', 'email')
      const userInfo = {
        localId: user.uuid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
      onSignIn(userInfo, 'email')
      // TODO: handle sign up error
    }).catch(e => setErrors(['signUpFail']))
  }

  const signIn = () => {
    if (!validateData()) return
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
      const user = result.user.toJSON()
      localStorage.setItem('todo-token', user.stsTokenManager.accessToken)
      localStorage.setItem('login-method', 'email')
      const userInfo = {
        localId: user.uuid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
      onSignIn(userInfo, 'email')
      // TODO: handle sign in error
    }).catch(e => setErrors['loginFail'])
  }

  const validateData = () => {
    let valid = true
    const errors = []
    if (!ValidateEmail(email)) {
      errors.push('invalidEmail')
      valid = false
    }

    if (password.length < 8) {
      errors.push('invalidPassword')
      valid = false
    }

    setErrors(errors)

    return valid
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setErrors([])
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => {setPassword(e.target.value); setErrors([])}}
          />
          <div className={classes.error}>
            {errors.includes('invalidEmail') && <div>Invalid email address.</div>}
            {errors.includes('invalidPassword') && <div>Password mus be more than 8 characters.</div>}
            {errors.includes('loginFail') && <div>Wrong username or password.</div>}
            {errors.includes('signUpFail') && <div>Maybe your email is already used.</div>}
          </div>
          <ButtonGroup fullWidth>
            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signIn}
              startIcon={<SinInIcon />}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SignUpIcon />}
              className={classes.submit}
              onClick={signUp}
            >
              Sign Up
            </Button>
          </ButtonGroup>


          <Divider>OR</Divider>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            className={classes.google}
            onClick={googleSignIn}
          >
            Sign in with Google
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={facebookSignIn}
          >
            Sign in with Facebook
          </Button>


        </form>

      </div>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
