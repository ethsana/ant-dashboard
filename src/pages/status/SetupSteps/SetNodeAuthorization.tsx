import React, { useContext } from 'react'
import { TextField, Button, Typography } from '@material-ui/core/'
import { Context as ApplicationContext, ApplicationInterface } from '../../../providers/Application'
import { updateNodeApi } from '../.././../utils'
import { useState } from 'react'

const SetNodeAuthorization = () => {
  const { nodeApi } = useContext<ApplicationInterface>(ApplicationContext)
  const [authCode, setAuth] = useState('')

  const handleAuthorise = () => {
    if (nodeApi.authorizationCode !== authCode) {
      updateNodeApi({
        ...nodeApi,
        authorizationCode: authCode,
      })
      window.location.reload()
    }
  }

  return (
    <>
      {!nodeApi.authorizationCode && (
        <Typography component="div" variant="body2" gutterBottom>
          {`If you have configured dashboard-authorization in sana.yaml(ant version >0.1.0), 
        please fill in the corresponding value to secure the node, if not, it is not necessary.`}
        </Typography>
      )}
      <div style={{ display: 'flex', marginTop: '25px', marginBottom: '25px' }}>
        <TextField
          defaultValue={nodeApi.authorizationCode}
          label="Node Dashboard-Authorization"
          variant="outlined"
          size="small"
          placeholder="Enter the node dashboard-authorization"
          style={{ marginRight: '15px', minWidth: '320px' }}
          onChange={e => {
            setAuth(e?.target?.value?.trim())
          }}
        />
        <Button size="small" variant="outlined" onClick={() => handleAuthorise()}>
          Set
        </Button>
        <div style={{ width: '10px' }} />
      </div>
    </>
  )
}

export default SetNodeAuthorization
