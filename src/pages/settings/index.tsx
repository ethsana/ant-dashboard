import React, { ReactElement, useState } from 'react'
import { Paper, Container, TextField, Typography, Button, Tooltip, Tabs, Tab, Chip } from '@material-ui/core'
import { DataGrid, GridColDef, GridEditRowsModel } from '@material-ui/data-grid'
import { createTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import DoneIcon from '@material-ui/icons/Done'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { updateNodeApi, removeNodeApi, isUrl, setAcitveNodeApi, NodeApi, uuid2 } from '../../utils'
import useApplication from '../../hooks/useApplication'
import { SaveAlt } from '@material-ui/icons'

const defaultTheme = createTheme()
const useStyles = makeStyles(
  () => {
    const isDark = true

    return {
      root: {
        '& .MuiDataGrid-cell--editing': {
          backgroundColor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: isDark ? '#ff4343' : '#750f0f',
        },
      },
    }
  },
  { defaultTheme },
)

export default function Settings(): ReactElement {
  const [tab, setTab] = useState<number>(0)
  const { nodeApiList, refresh } = useApplication()
  const [showAlert, setShowAlert] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<string>('')

  function err(): void {
    setShowAlert('No available data found')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  function onChange(event: ChangeEventHandler<HTMLInputElement>) {
    const reader = new FileReader()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    reader.onload = onReaderLoad
    try {
      reader.readAsText(event.target.files[0])
    } catch (_) {
      // err()
    }
  }

  function onReaderLoad(event: { target: { result: string } }) {
    try {
      const arr: NodeApi[] = JSON.parse(event.target.result)

      if (arr.constructor === Array) {
        let result: NodeApi[] = []
        arr.forEach(item => {
          try {
            const { nodeName, apiHost, debugApiHost, authorizationCode } = item

            if (isUrl(apiHost || '') && isUrl(debugApiHost || '')) {
              result.push({
                id: uuid2(),
                nodeName: nodeName || '',
                apiHost,
                debugApiHost,
                authorizationCode,
              })
            }
          } catch (e) {
            ///
          }
        })

        const now = Date.now().toString().substring(0, 10)

        result = result.map((item, index): NodeApi => {
          if (!item.nodeName) {
            item.nodeName = `imported${now}${index + 1}`
          }

          return item
        })

        if (result.length > 0) {
          localStorage.node_api = JSON.stringify(nodeApiList.concat(result))
          refresh()
          setShowSuccess(`${result.length} node API(s) have been imported`)
        } else {
          err()
        }

        console.log(result)
      } else {
        err()
      }
    } catch (e) {
      err()
    }
  }

  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settings Node API
        </Typography>
        <Typography variant="subtitle1">The data is stored locally, please do not clear the browser cache.</Typography>
        <div style={{ height: '20px' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, newValue) => {
              setTab(newValue)
            }}
          >
            <Tab label="connected node api" />
            <Tab label="manage node api" />
          </Tabs>
          <label
            htmlFor="file"
            style={{
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <input type="file" id="file" accept=".json" name="file" onChange={onChange} hidden />
            <Tooltip
              placement="left"
              title={
                <React.Fragment>
                  <Typography color="inherit">Import Node API from json file</Typography>
                  <em>eg:</em>
                  <code>
                    <p>[</p>
                    <p>&nbsp;&nbsp;{'{'}</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&quot;nodeName&quot;:&nbsp;&quot;Not required&quot;,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&quot;apiHost&quot;:&nbsp;&quot;http://localhost&quot;,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&quot;debugApiHost&quot;:&nbsp;&quot;http://localhost&quot;</p>
                    <p>&nbsp;&nbsp;{'}'}</p>
                    <p>]</p>
                  </code>
                </React.Fragment>
              }
            >
              <SaveAlt />
            </Tooltip>
          </label>
        </div>
        <div style={{ height: '20px' }} />
        {tab === 0 && <CurrentNode />}
        {tab === 1 && <ManageNode />}
      </Container>
      <Snackbar
        open={Boolean(showAlert)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {
          setShowAlert('')
        }}
      >
        <Alert severity="error">{showAlert}</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(showSuccess)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {
          setShowSuccess('')
        }}
      >
        <Alert severity="success">{showSuccess}</Alert>
      </Snackbar>
    </div>
  )
}

type InputInfo = {
  error: boolean
  helperText: string
}

function CurrentNode() {
  const { nodeApi, exist } = useApplication()
  const [nodeName, setNodeName] = useState(nodeApi.nodeName)
  const [host, setHost] = useState(nodeApi.apiHost)
  const [debugHost, setDebugHost] = useState(nodeApi.debugApiHost)
  const [authorizationCode, setAuthorization] = useState(nodeApi?.authorizationCode)

  const [hostInfo, setHostInfo] = useState<InputInfo>({
    error: false,
    helperText: '',
  })
  const [debugHostInfo, setDebugHostInfo] = useState<InputInfo>({
    error: false,
    helperText: '',
  })

  const handleRemoveNodeApi = () => {
    removeNodeApi(nodeApi.id)
    window.location.reload()
  }
  const [showAlert, setShowAlert] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<string>('')

  const handleNewHostConnection = (isAdd: boolean) => {
    if (isAdd) {
      if (exist('nodeName', nodeName)) {
        setShowAlert('Node name already exists')

        return
      } else if (exist('apiHost', host)) {
        setShowAlert('API endpoint already exists')

        return
      } else if (exist('debugApiHost', debugHost)) {
        setShowAlert('Debug API endpoint already exists')

        return
      }
    } else {
      if (exist('nodeName', nodeName, nodeApi.id)) {
        setShowAlert('Node name already exists')

        return
      } else if (exist('apiHost', host, nodeApi.id)) {
        setShowAlert('API endpoint already exists')

        return
      } else if (exist('debugApiHost', debugHost, nodeApi.id)) {
        setShowAlert('Debug API endpoint already exists')

        return
      }
    }
    updateNodeApi({
      id: isAdd ? '' : nodeApi.id,
      nodeName,
      apiHost: host,
      debugApiHost: debugHost,
      authorizationCode,
    })
    setShowSuccess(isAdd ? 'Add success' : 'Update success')
    window.location.reload()
  }

  const error = hostInfo.error || debugHostInfo.error

  return (
    <>
      <Paper>
        <TextField
          label="Node Name"
          style={{ margin: 0 }}
          placeholder="Any non-empty string（ex: node1、node2 ...）"
          helperText="Enter node name"
          fullWidth
          defaultValue={nodeName}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => {
            setNodeName(e.target.value)
          }}
          variant="filled"
        />
      </Paper>
      <Paper style={{ marginTop: '20px' }}>
        <TextField
          label="Authoriztion"
          style={{ margin: 0 }}
          placeholder="Enter node dashboard-authorization(optional)"
          fullWidth
          defaultValue={authorizationCode}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={({ target: { value } }) => {
            setAuthorization(value.trim())
          }}
          variant="filled"
          helperText={
            'If your sana.yaml is configured with dashboard-authorization, please enter the value here, otherwise you will not be able to connect to the node(ant-linux-amd64>0.1.0)'
          }
        />
      </Paper>
      <Paper style={{ marginTop: '20px' }}>
        <TextField
          label="API Endpoint"
          style={{ margin: 0 }}
          placeholder="ex: 127.0.0.0.1:1633"
          error={hostInfo.error}
          helperText={hostInfo.helperText || 'Enter node host override / port'}
          fullWidth
          defaultValue={host}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => {
            const value = e.target.value.trim()
            setHost(value)

            if (value) {
              if (isUrl(value)) {
                setHostInfo({
                  error: false,
                  helperText: '',
                })
              } else {
                setHostInfo({
                  error: true,
                  helperText: 'Url is invalid',
                })
              }
            } else {
              setHostInfo({
                error: true,
                helperText: 'Please enter node host',
              })
            }
          }}
          variant="filled"
        />
      </Paper>
      <Paper style={{ marginTop: '20px' }}>
        <TextField
          label="Debug API Endpoint"
          style={{ margin: 0 }}
          placeholder="ex: 127.0.0.0.1:1635"
          error={debugHostInfo.error}
          helperText={debugHostInfo.helperText || 'Enter node debug host override / port'}
          fullWidth
          defaultValue={debugHost}
          onChange={e => {
            const value = e.target.value.trim()
            setDebugHost(value)

            if (value) {
              if (isUrl(value)) {
                setDebugHostInfo({
                  error: false,
                  helperText: '',
                })
              } else {
                setDebugHostInfo({
                  error: true,
                  helperText: 'Url is invalid',
                })
              }
            } else {
              setDebugHostInfo({
                error: true,
                helperText: 'Please enter node host',
              })
            }
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
          <Button variant="contained" color="primary" onClick={() => handleNewHostConnection(false)} disabled={error}>
            update
          </Button>
          <div style={{ width: '30px' }} />
          <Button variant="contained" color="primary" onClick={() => handleNewHostConnection(true)} disabled={error}>
            add
          </Button>
        </div>
        <div>
          {Boolean(nodeApi.id) && (
            <Tooltip title="Delete">
              <Button aria-label="delete" onClick={handleRemoveNodeApi}>
                <DeleteOutlinedIcon />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <Snackbar
        open={Boolean(showAlert)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {
          setShowAlert('')
        }}
      >
        <Alert severity="error">{showAlert}</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(showSuccess)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {
          setShowSuccess('')
        }}
      >
        <Alert severity="success">{showSuccess}</Alert>
      </Snackbar>
    </>
  )
}

function ManageNode() {
  const { nodeApi, nodeApiList, refresh, exist } = useApplication()
  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({})
  const classes = useStyles()

  console.log('nodeApiList', nodeApiList)

  const columns: GridColDef[] = [
    {
      field: 'nodeName',
      headerName: 'Node Name',
      width: 210,
      editable: true,
    },
    {
      field: 'authorizationCode',
      headerName: 'Authorization',
      width: 210,
      editable: true,
    },
    {
      field: 'apiHost',
      headerName: 'Api Endpoint',
      width: 290,
      editable: true,
    },

    {
      field: 'debugApiHost',
      headerName: 'Debug Api Endpoint',
      width: 290,
      editable: true,
    },
    {
      headerName: 'Actions',
      field: 'null',
      // eslint-disable-next-line react/display-name
      renderCell: data => {
        const id = data.row.id

        return (
          <>
            <Tooltip title="Delete">
              <Button
                onClick={() => {
                  handleRemoveNodeApi(id)
                }}
              >
                <DeleteOutlinedIcon />
              </Button>
            </Tooltip>
            <div style={{ width: '12px' }} />
            {id === nodeApi.id ? (
              <Chip label="CONNECTED" size="small" icon={<DoneIcon />} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleConnect(id)
                }}
              >
                CONNECT
              </Button>
            )}
          </>
        )
      },
      filterable: false,
      flex: 1,
      hideSortIcons: true,
      sortable: false,
      editable: false,
    },
  ]

  const handleEditRowsModelChange = React.useCallback((model: GridEditRowsModel) => {
    const updatedModel = { ...model }
    Object.keys(updatedModel).forEach(id => {
      let field = ''

      if (updatedModel[id].apiHost) {
        field = 'apiHost'
      } else if (updatedModel[id].debugApiHost) {
        field = 'debugApiHost'
      } else if (updatedModel[id].nodeName) {
        field = 'nodeName'
      }

      if (field) {
        const value = updatedModel[id][field].value as string
        const isValid = isUrl(value)
        updatedModel[id][field] = {
          ...updatedModel[id][field],
          error:
            (field === 'nodeName' ? !value : !isValid) ||
            exist(field as 'apiHost' | 'debugApiHost' | 'nodeName', value, id),
        }
      }
    })
    // console.log(updatedModel)
    setEditRowsModel(updatedModel)
  }, [])

  const handleConnect = (id: string) => {
    setAcitveNodeApi(id)
    window.location.reload()
  }

  const handleRemoveNodeApi = (id: string) => {
    removeNodeApi(id)
    refresh()

    if (id === nodeApi.id) window.location.reload()
  }

  return (
    <Paper>
      <DataGrid
        className={classes.root}
        autoHeight
        rows={nodeApiList}
        columns={columns}
        // pageSize={20}
        disableSelectionOnClick
        // editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        onCellEditCommit={data => {
          const { row, field, value } = data as unknown as { row: any; field: string; value: string }
          updateNodeApi({
            ...row,
            [field]: value,
            setActive: false,
          })
          refresh()
        }}
      />
    </Paper>
  )
}
