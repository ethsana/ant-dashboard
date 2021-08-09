import React, { ReactElement, ReactNode, useState, useContext } from 'react'
import { Paper, Container, TextField, Typography, Button, Tooltip, Tabs, Tab, Chip } from '@material-ui/core'
import { DataGrid, GridColDef, GridEditRowsModel } from '@material-ui/data-grid'
import { createMuiTheme, Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import DoneIcon from '@material-ui/icons/Done'
import { updateNodeApi, removeNodeApi, isUrl, setAcitveNodeApi } from '../../utils'
import useApplication from '../../hooks/useApplication'

const defaultTheme = createMuiTheme()
const useStyles = makeStyles(
  (theme: Theme) => {
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

  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settings Node API
        </Typography>
        <Typography variant="subtitle1">The data is stored locally, please do not clear the browser cache.</Typography>
        <div style={{ height: '20px' }} />
        <Tabs
          value={tab}
          onChange={(_, newValue) => {
            setTab(newValue)
          }}
        >
          <Tab label="connected node api" />
          <Tab label="manage node api" />
        </Tabs>
        <div style={{ height: '20px' }} />
        {tab === 0 && <CurrentNode />}
        {tab === 1 && <ManageNode />}
      </Container>
    </div>
  )
}

type InputInfo = {
  error: boolean
  helperText: string
}

function CurrentNode() {
  const [refreshVisibility, toggleRefreshVisibility] = useState(false)
  const { nodeApi } = useApplication()
  const [nodeName, setNodeName] = useState(nodeApi.nodeName)
  const [host, setHost] = useState(nodeApi.apiHost)
  const [hostInfo, setHostInfo] = useState<InputInfo>({
    error: false,
    helperText: '',
  })
  const [debugHostInfo, setDebugHostInfo] = useState<InputInfo>({
    error: false,
    helperText: '',
  })
  const [debugHost, setDebugHost] = useState(nodeApi.debugApiHost)
  const handleRemoveNodeApi = () => {
    removeNodeApi(nodeApi.id)
    window.location.reload()
  }
  const handleNewHostConnection = (isAdd: boolean) => {
    if (host || debugHost || nodeName) {
      updateNodeApi({
        id: isAdd ? '' : nodeApi.id,
        nodeName,
        apiHost: host,
        debugApiHost: debugHost,
      })
      // toggleRefreshVisibility(!refreshVisibility)
      window.location.reload()
    }
  }

  const error = hostInfo.error || debugHostInfo.error

  return (
    <>
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
            // toggleRefreshVisibility(true)
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

            // toggleRefreshVisibility(true)
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
            set
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
    </>
  )
}

function ManageNode() {
  const { nodeApi, nodeApiList, refresh } = useApplication()
  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({})
  const classes = useStyles()

  const columns: GridColDef[] = [
    {
      field: 'nodeName',
      headerName: 'Node Name',
      width: 200,
      editable: true,
    },
    {
      field: 'apiHost',
      headerName: 'Api Endpoint',
      width: 340,
      editable: true,
    },
    {
      field: 'debugApiHost',
      headerName: 'Debug Api Endpoint',
      width: 340,
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
      }

      if (field) {
        const isValid = isUrl(updatedModel[id][field].value as string)
        updatedModel[id][field] = { ...updatedModel[id][field], error: !isValid }
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
