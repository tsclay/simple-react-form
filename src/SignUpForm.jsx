import React from 'react'
import { TextField, Box, Button } from '@material-ui/core'

const styles = {
  wrapper: {
    width: '70%',
    margin: '0 auto'
  },
  form: {
    width: '100%'
  },
  inputs: {
    marginBottom: '1rem'
  }
}

function SignUpForm() {
  return (
    <div id="signup-form" style={styles.wrapper}>
      <form style={styles.form}>
        <Box display="flex" flexDirection="column">
          <TextField
            style={styles.inputs}
            type="text"
            name="firstName"
            id="firstName"
            label="First Name"
            variant="outlined"
          />
          <TextField
            style={styles.inputs}
            type="text"
            name="lastName"
            id="lastName"
            label="Last Name"
            variant="outlined"
          />
          <TextField
            style={styles.inputs}
            autoComplete="off"
            type="email"
            name="email"
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
          />
          <TextField
            style={styles.inputs}
            type="password"
            name="password"
            id="password"
            label="Password"
            variant="outlined"
          />
          <Button variant="contained" color="primary">
            Signup
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default SignUpForm
