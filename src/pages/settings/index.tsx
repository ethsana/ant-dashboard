import React, { ReactElement, useState, useContext } from 'react'
import { Paper, Container, TextField, Typography, Button, Tooltip, Select, MenuItem } from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { Context as ApplicationContext } from '../../providers/Application'
import { updateNodeApi, removeNodeApi } from '../../utils'

export default function Settings(): ReactElement {
  const [refreshVisibility, toggleRefreshVisibility] = useState(false)
  const { nodeApi, nodeApiList, refresh } = useContext(ApplicationContext)
  const [nodeName, setNodeName] = useState(nodeApi.nodeName)
  const [host, setHost] = useState(nodeApi.apiHost)
  const [debugHost, setDebugHost] = useState(nodeApi.debugApiHost)

  const handleNewHostConnection = (isAdd: boolean) => {
    if (host || debugHost || nodeName) {
      updateNodeApi({
        key: isAdd ? '' : nodeApi.key,
        nodeName,
        apiHost: host,
        debugApiHost: debugHost,
      })
      // toggleRefreshVisibility(!refreshVisibility)
      window.location.reload()
    }
  }

  const handleRemoveNodeApi = () => {
    removeNodeApi(nodeApi.key)
    window.location.reload()
  }

  return (
    <div>
      <Container>
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom>
            Settings Node API
          </Typography>
          {nodeApiList.length > 1 && (
            <Select
              value={nodeApi.key}
              onChange={event => {
                localStorage.acitve_node_api_key = event.target.value
                refresh()
                window.location.reload()
              }}
            >
              {nodeApiList.map(({ key, nodeName }) => {
                return (
                  <MenuItem key={key} value={key}>
                    {nodeName}
                  </MenuItem>
                )
              })}
            </Select>
          )}
        </div>

        <Paper>
          <TextField
            label="Node Name"
            style={{ margin: 0 }}
            placeholder="Any non-empty string（ex: node01、node02 ...）"
            helperText="Enter node name"
            fullWidth
            defaultValue={nodeName}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setNodeName(e.target.value)
              toggleRefreshVisibility(true)
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
            defaultValue={host}
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
            defaultValue={debugHost}
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

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" color="primary" onClick={() => handleNewHostConnection(false)}>
              set
            </Button>
            <div style={{ width: '30px' }} />
            <Button variant="outlined" color="primary" onClick={() => handleNewHostConnection(true)}>
              add
            </Button>
          </div>
          <div>
            {Boolean(nodeApi.key) && (
              <Tooltip title="Delete">
                <Button aria-label="delete" onClick={handleRemoveNodeApi}>
                  <DeleteOutlinedIcon />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
