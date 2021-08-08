import React, { ReactElement, useState } from 'react'
import { Paper, Container, TextField, Typography, Button } from '@material-ui/core'

export default function Settings(): ReactElement {
  const [refreshVisibility, toggleRefreshVisibility] = useState(false)
  const [host, setHost] = useState('')
  const [debugHost, setDebugHost] = useState('')

  const handleNewHostConnection = () => {
    if (host) {
      sessionStorage.setItem('api_host', host)
    }

    if (debugHost) {
      sessionStorage.setItem('debug_api_host', debugHost)
    }

    if (host || debugHost) {
      toggleRefreshVisibility(!refreshVisibility)
      window.location.reload()
    }
  }

  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settings Node API
        </Typography>
        <Paper>
          <TextField
            label="Node Name"
            style={{ margin: 0 }}
            placeholder="Any non-empty string（ex: node01、node02 ...）"
            helperText="Enter node name"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              // setHost(e.target.value)
              // toggleRefreshVisibility(true)
            }}
            variant="filled"
          />
        </Paper>
        <Paper style={{ marginTop: '20px' }}>
          <TextField
            label="API Endpoint"
            style={{ margin: 0 }}
            placeholder="ex: 127.0.0.0.1:1633"
            helperText="Enter node host override / port"
            fullWidth
            defaultValue={
              sessionStorage.getItem('api_host') ? sessionStorage.getItem('api_host') : process.env.REACT_APP_ANT_HOST
            }
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setHost(e.target.value)
              toggleRefreshVisibility(true)
            }}
            variant="filled"
          />
        </Paper>
        <Paper style={{ marginTop: '20px' }}>
          <TextField
            label="Debug API Endpoint"
            style={{ margin: 0 }}
            placeholder="ex: 127.0.0.0.1:1635"
            helperText="Enter node debug host override / port"
            fullWidth
            defaultValue={
              sessionStorage.getItem('debug_api_host')
                ? sessionStorage.getItem('debug_api_host')
                : process.env.REACT_APP_ANT_DEBUG_HOST
            }
            onChange={e => {
              setDebugHost(e.target.value)
              toggleRefreshVisibility(true)
            }}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
        </Paper>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" color="primary" onClick={() => handleNewHostConnection()}>
            set
          </Button>
          <div style={{ width: '30px' }} />
          <Button variant="outlined" color="primary" onClick={() => handleNewHostConnection()}>
            add
          </Button>
        </div>
      </Container>
    </div>
  )
}
