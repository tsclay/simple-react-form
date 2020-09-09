import React, { useState } from 'react'
import { TextField, Box, Button, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useDebounce from './hooks/useDebounce'

const useStyles = makeStyles({
  inputs: {
    width: '100%'
  },
  errorText: {
    background: 'transparent',
    color: 'red',
    width: '100%'
  },
  successText: {
    background: 'transparent',
    color: 'green',
    width: '100%'
  },
  inputWrappers: {
    width: '100%',
    marginBottom: '1rem'
  },
  submitButton: {
    background: 'rgba(150,56,216,1)',
    color: 'white'
  },
  basicButton: {
    display: 'block',
    background: 'rgba(150,56,216,1)',
    color: 'white',
    margin: '0 auto'
  }
})

const baseStyles = {
  wrapper: {
    minHeight: '20.25rem',
    width: '500px',
    margin: '0 auto',
    padding: '2rem 2rem 2rem 2rem',
    boxSizing: 'box-border',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    background:
      'linear-gradient(0deg, rgba(238,238,238,0.7) 0%, rgba(150,56,216,0.3) 100%)'
  },
  form: {
    width: '100%'
  },
  afterReg: {
    width: '100%',
    marginTop: '6rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '20rem'
  }
}

const passwordRegEx = /(?=(?:.*[a-z]){1,})(?=(?:.*[A-Z]){1,})(?=(?:.*[\d]){1,}).*/g

const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUpForm() {
  const classes = useStyles()
  const [payload, setPayload] = useState({
    campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
    email: ''
  })
  const [emailStatus, setEmailStatus] = useState('')
  const [fortifiedPassword, setFortifiedPassword] = useState(null)
  const [hasRegistered, setHasRegistered] = useState(0)

  const handleInputs = (e) => {
    payload[e.target.name] = e.target.value
    setEmailStatus(!payload.email ? '' : emailStatus)
    setPayload({ ...payload })
  }

  const verifyUniqueEmail = async () => {
    const { email } = payload
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

  const isValidEmail = () => {
    const { email } = payload
    if (!email) return
    if (emailRegEx.test(email)) {
      verifyUniqueEmail()
    } else {
      setEmailStatus('NOT VALID')
    }
  }

  const verifySecurePassword = () => {
    const { password } = payload
    setFortifiedPassword(
      !password ? null : !!password.match(passwordRegEx) && password.length >= 8
    )
  }

  useDebounce(isValidEmail, [payload.email], 1000)
  useDebounce(verifySecurePassword, [payload.password], 400)

  const sendUserData = async (e) => {
    e.preventDefault()
    const { campaignUuid, email, firstName, lastName, password } = payload
    const response = await fetch('https://api.raisely.com/v3/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaignUuid,
        data: { email, firstName, lastName, password }
      })
    })
    const json = await response.json()
    console.log('here is the response as json: ', json)
    setHasRegistered(json.hasOwnProperty('errors') ? 400 : 200)
  }

  return (
    <div id="signup-form" style={baseStyles.wrapper}>
      {hasRegistered === 0 ? (
        <>
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
                  error={
                    emailStatus === 'EXISTS' || emailStatus === 'NOT VALID'
                  }
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
                  <FormHelperText className={classes.errorText}>
                    Email already exists. Please enter another email.
                  </FormHelperText>
                ) : null}
                {emailStatus === 'NOT VALID' ? (
                  <FormHelperText className={classes.errorText}>
                    Please enter a valid email address.
                  </FormHelperText>
                ) : null}
                {emailStatus === 'OK' ? (
                  <FormHelperText className={classes.successText}>
                    Email is available!
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
                  <FormHelperText className={classes.errorText}>
                    Password should be 8 characters long and include at least
                    one of the following: a–z, A–Z, and 0–9.
                  </FormHelperText>
                ) : null}
                {fortifiedPassword === true ? (
                  <FormHelperText className={classes.successText}>
                    Password is strong!
                  </FormHelperText>
                ) : null}
              </Box>
              <Button
                className={classes.submitButton}
                disabled={
                  !payload.firstName ||
                  !payload.lastName ||
                  !payload.password ||
                  emailStatus !== 'OK' ||
                  fortifiedPassword !== true
                }
                type="submit"
                variant="contained"
                color="primary"
              >
                {!payload.firstName ||
                !payload.lastName ||
                !payload.password ||
                emailStatus !== 'OK' ||
                fortifiedPassword !== true
                  ? 'Waiting...'
                  : 'Ready!'}
              </Button>
              <FormHelperText
                style={{ fontStyle: 'italic', fontWeight: 'bold' }}
              >
                Button will become clickable once all fields are filled and no
                errors are present.
              </FormHelperText>
            </Box>
          </form>
        </>
      ) : (
        <>
          <div style={baseStyles.afterReg}>
            {hasRegistered === 400 ? (
              <div>
                <h2 style={{ textAlign: 'center' }}>
                  <span role="img" aria-label="thinking emoji">
                    🤔
                  </span>
                  <span> This email is already registered... </span>
                  <span role="img" aria-label="thinking emoji">
                    🤔
                  </span>
                </h2>
                <h2 style={{ textAlign: 'center' }}>Try logging in!</h2>
              </div>
            ) : (
              <>
                <h2>
                  <span role="img" aria-label="thinking emoji">
                    ✅
                  </span>
                  <span> Successfully registered! </span>
                  <span role="img" aria-label="thinking emoji">
                    ✅
                  </span>
                </h2>
              </>
            )}
            <Button
              className={classes.basicButton}
              type="button"
              variant="contained"
              color="primary"
              onClick={() => {
                setHasRegistered(0)
                setFortifiedPassword(null)
                setEmailStatus(null)
              }}
            >
              Return
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default SignUpForm
