import React, { useState, useEffect } from 'react'
import { TextField, Box, Button, FormHelperText } from '@material-ui/core'

const styles = {
  wrapper: {
    width: '500px',
    margin: '0 auto'
  },
  form: {
    width: '100%'
  },
  inputs: {
    marginBottom: '1rem'
  }
}

let timer

function SignUpForm() {
  const [payload, setPayload] = useState({
    campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a'
  })

  const handleInputs = (e) => {
    payload[e.target.name] = e.target.value
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
    console.log(json.data.status)
    return json
  }

  useEffect(() => {
    timer = setTimeout(() => {
      verifyUniqueEmail()
    }, 1500)
    return () => {
      clearTimeout(timer)
    }
  }, [payload.email])

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
    <div id="signup-form" style={styles.wrapper}>
      <form onSubmit={sendUserData} style={styles.form}>
        <Box display="flex" flexDirection="column">
          <TextField
            required
            onChange={handleInputs}
            style={styles.inputs}
            type="text"
            name="firstName"
            id="firstName"
            label="First Name"
            variant="outlined"
          />
          <TextField
            required
            onChange={handleInputs}
            style={styles.inputs}
            type="text"
            name="lastName"
            id="lastName"
            label="Last Name"
            variant="outlined"
          />
          <TextField
            required
            onChange={handleInputs}
            style={styles.inputs}
            autoComplete="off"
            type="email"
            name="email"
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
          />
          <TextField
            required
            onChange={handleInputs}
            style={styles.inputs}
            type="password"
            name="password"
            id="password"
            label="Password"
            variant="outlined"
          />
          <Button disabled type="submit" variant="contained" color="primary">
            Signup
          </Button>
          <FormHelperText>
            Button will become clickable once all fields are filled with valid
            credentials.
          </FormHelperText>
        </Box>
      </form>
    </div>
  )
}

export default SignUpForm
