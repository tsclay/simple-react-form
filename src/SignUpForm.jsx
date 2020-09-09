import React, { useState } from 'react'
import { TextField, Box, Button, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useDebounce from './hooks/useDebounce'

const useStyles = makeStyles({
  inputs: {
    width: '100%'
  },
  helperText: {
    background: 'transparent',
    color: 'red',
    width: '100%'
  },
  inputWrappers: {
    width: '100%',
    marginBottom: '1rem'
  },
  submitButton: {
    background: 'rgba(150,56,216,1)',
    color: 'white'
  }
})

const baseStyles = {
  wrapper: {
    width: '500px',
    margin: '0 auto',
    padding: '2rem',
    boxSizing: 'box-border',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    background:
      'linear-gradient(0deg, rgba(238,238,238,0.7) 0%, rgba(150,56,216,0.3) 100%)'
  },
  form: {
    width: '100%'
  }
}

function SignUpForm() {
  const classes = useStyles()
  const [payload, setPayload] = useState({
    campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
    email: ''
  })
  const [emailStatus, setEmailStatus] = useState('')
  const [fortifiedPassword, setFortifiedPassword] = useState(null)

  const handleInputs = (e) => {
    payload[e.target.name] = e.target.value
    setEmailStatus(!payload.email ? '' : emailStatus)
    setPayload({ ...payload })
  }

  const verifyUniqueEmail = async () => {
    const { email } = payload
    if (!email) return
    const response = await fetch('https://api.raisely.com/v3/check-user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
        data: { email }
      })
    })
    const json = await response.json()
    setEmailStatus(json.data.status)
  }

  const verifySecurePassword = () => {
    const { password } = payload
    setFortifiedPassword(
      !password
        ? null
        : !!(
            password.match(
              /(?=(?:.*[a-z]){1,})(?=(?:.*[A-Z]){1,})(?=(?:.*[\d]){1,})(?=(?:.*[!@#$%^&*()<>;:'"/?\\\.])?).*/g
            ) && password.length >= 8
          )
    )
  }

  useDebounce(verifyUniqueEmail, [payload.email], 1000)
  useDebounce(verifySecurePassword, [payload.password], 400)

  const sendUserData = async (e) => {
    e.preventDefault()
    const response = await fetch('https://api.raisely.com/v3/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const json = response.json()
    console.log('here is the response as json: ', json)
  }

  return (
    <div id="signup-form" style={baseStyles.wrapper}>
      <h1>Get Started Today!</h1>
      <form onSubmit={sendUserData} style={baseStyles.form}>
        <Box display="flex" flexDirection="column">
          <TextField
            required
            onChange={handleInputs}
            className={classes.inputWrappers}
            type="text"
            name="firstName"
            id="firstName"
            label="First Name"
            variant="outlined"
          />
          <TextField
            required
            onChange={handleInputs}
            className={classes.inputWrappers}
            type="text"
            name="lastName"
            id="lastName"
            label="Last Name"
            variant="outlined"
          />
          <Box className={classes.inputWrappers}>
            <TextField
              error={emailStatus === 'EXISTS'}
              className={classes.inputs}
              required
              onChange={handleInputs}
              autoComplete="off"
              type="email"
              name="email"
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
            />
            {emailStatus === 'EXISTS' ? (
              <FormHelperText className={classes.helperText}>
                Email already exists. Please enter another email.
              </FormHelperText>
            ) : null}
          </Box>

          <Box className={classes.inputWrappers}>
            <TextField
              error={fortifiedPassword === false}
              required
              onChange={handleInputs}
              className={classes.inputs}
              type="password"
              name="password"
              id="password"
              label="Password"
              variant="outlined"
            />
            {fortifiedPassword === false ? (
              <FormHelperText className={classes.helperText}>
                Password should be 8 characters long and include at least one of
                the following: a–z, A–Z, and 0–9.
              </FormHelperText>
            ) : null}
          </Box>

          <Button
            className={classes.submitButton}
            disabled={
              !payload.firstName ||
              !payload.lastName ||
              !payload.password ||
              emailStatus !== 'OK'
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            {!payload.firstName ||
            !payload.lastName ||
            !payload.password ||
            emailStatus !== 'OK'
              ? 'Waiting...'
              : 'Ready!'}
          </Button>
          <FormHelperText style={{ fontStyle: 'italic' }}>
            Button will become clickable once all fields are filled without
            errors.
          </FormHelperText>
        </Box>
      </form>
    </div>
  )
}

export default SignUpForm
