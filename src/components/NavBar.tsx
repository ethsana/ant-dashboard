import { ReactElement, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Toolbar, Chip, TextField, DialogContent, DialogTitle, Button, Dialog } from '@material-ui/core/'
import { ArrowDropDown } from '@material-ui/icons/'
import DoneIcon from '@material-ui/icons/Done'
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import { setAcitveNodeApi } from '../utils'
// import { Sun, Moon } from 'react-feather'
import SanaLogoLight from '../assets/sana-logo-light.svg'
import SanaLogoDark from '../assets/sana-logo-dark.svg'
import useTheme from '../hooks/useTheme'
import useApplication from '../hooks/useApplication'

const useStyles = makeStyles(theme =>
  createStyles({
    logo: {
      width: 200,
      flexShrink: 0,
      flexGrow: 0,
    },
    network: {
      color: '#fff',
      backgroundColor: '#32c48d',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
    legend: {
      '.PrivateNotchedOutline-legend-21': {
        width: '200px',
      },
    },
  }),
)

export default function SideBar(): ReactElement {
  const classes = useStyles()
  const { theme: themeMode } = useTheme()
  const { nodeApi, nodeApiList, refresh } = useApplication()
  const [showNodeModel, setShowNodeModel] = useState(false)
  const [filter, setFilter] = useState('')

  const handleClickOpen = () => {
    setShowNodeModel(true)
  }

  const handleClose = () => {
    setShowNodeModel(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'nodeName',
      headerName: 'Node Name',
      width: 200,
      editable: false,
    },
    {
      field: 'apiHost',
      headerName: 'Api Endpoint',
      width: 260,
      editable: false,
    },
    {
      field: 'debugApiHost',
      headerName: 'Debug Api Endpoint',
      width: 260,
      editable: false,
    },
    {
      headerName: ' ',
      field: 'null',
      // align: 'right',
      // eslint-disable-next-line react/display-name
      renderCell: data => {
        // eslint-disable-next-line react/display-name
        const id = data.row.id

        return (
          <>
            {id === nodeApi.id ? (
              <Chip label="CONNECTED" size="small" icon={<DoneIcon />} />
            ) : (
              <Button
                size="small"
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

  const handleConnect = (id: string) => {
    setAcitveNodeApi(id)
    refresh()
    window.location.reload()
  }

  // const clickTheme = useCallback(() => {
  //   if (updater && typeof updater === 'function') {
  //     updater()
  //   }
  // }, [updater])

  return (
    <Toolbar style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <div className={classes.logo}>
        <img src={themeMode === 'light' ? SanaLogoLight : SanaLogoDark} alt="sana logo" width="50" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {nodeApiList.length > 0 && (
          <>
            <span style={{ color: '#999' }}>Connected Node:</span>&nbsp;
            <Button onClick={handleClickOpen} style={{ textTransform: 'none' }} endIcon={<ArrowDropDown />}>
              <span style={{ marginRight: '-6px' }}>{nodeApi.nodeName || nodeApi.apiHost || nodeApi.debugApiHost}</span>
            </Button>
            <Dialog open={showNodeModel} onClose={handleClose} maxWidth="md" fullWidth>
              <DialogTitle>Change Node API</DialogTitle>
              <DialogContent>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  <TextField
                    label="Type to search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={filter}
                    onChange={e => {
                      setFilter(e.target.value.trim())
                    }}
                  />
                  {Boolean(filter) && (
                    <Button
                      onClick={() => {
                        setFilter('')
                      }}
                    >
                      clear
                    </Button>
                  )}
                </div>

                {/* <FormControl variant="outlined" size="small" fullWidth className={clsx(classes.legend)}>
                  <InputLabel>Type to search</InputLabel>
                  <OutlinedInput
                    // label="Type to search"
                    // id="outlined-adornment-password"
                    // placeholder="Type to search"
                    value={filter}
                    onChange={e => {
                      setFilter(e.target.value.trim())
                    }}
                    endAdornment={
                      filter ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setFilter('')
                            }}
                            edge="end"
                          >
                            <CloseIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                    labelWidth={70}
                  />
                </FormControl> */}
                <div style={{ height: 20 }} />
                <DataGrid
                  aria-labelledby="id"
                  rows={nodeApiList.filter(({ nodeName, apiHost, debugApiHost }) => {
                    if (filter) {
                      const key = filter.toLowerCase()

                      return (
                        nodeName.toLowerCase().indexOf(key) >= 0 ||
                        apiHost.toLowerCase().indexOf(key) >= 0 ||
                        debugApiHost.toLowerCase().indexOf(key) >= 0
                      )
                    } else {
                      return true
                    }
                  })}
                  columns={columns}
                  headerHeight={45}
                  rowHeight={45}
                  pageSize={10}
                  // rowsPerPageOptions={[15, 20, 50]}
                  autoHeight
                  disableSelectionOnClick
                  disableColumnMenu
                  disableColumnSelector
                  disableDensitySelector
                />
              </DialogContent>
              <div style={{ height: 20 }} />
            </Dialog>
          </>
        )}
        <Chip style={{ marginLeft: '12px' }} size="small" label="xDai" className={classes.network} />
        {/* <div style={{ width: '100%' }}>
          <div style={{ float: 'right' }}>
            <IconButton style={{ marginRight: '10px' }} aria-label="dark-mode" onClick={clickTheme}>
              {themeMode === 'dark' ? <Moon /> : <Sun />}
            </IconButton>
          </div>
        </div> */}
      </div>
    </Toolbar>
  )
}
