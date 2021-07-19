import { ReactElement } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import {
  ListItemText,
  ListItemIcon,
  ListItem,
  Divider,
  List,
  Toolbar,
  Drawer,
  Link as MUILink,
} from '@material-ui/core'
import { OpenInNewSharp } from '@material-ui/icons'
import { Activity, FileText, DollarSign, Share2, Settings, Layers, Folder } from 'react-feather'

import { Health } from '@ethersphere/bee-js'
import PublishSharpIcon from '@material-ui/icons/PublishSharp'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'
import SettingsIcon from '@material-ui/icons/Settings'
import BallotIcon from '@material-ui/icons/Ballot'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

const drawerWidth = 240

const navBarItems = [
  {
    label: 'Status',
    id: 'status',
    path: '/',
    icon: Activity,
  },
  {
    label: 'Files',
    id: 'files',
    path: '/files/',
    icon: InsertDriveFileIcon,
  },
  {
    label: 'Stamps',
    id: 'stamps',
    path: '/stamps/',
    icon: BallotIcon,
  },
  {
    label: 'Accounting',
    id: 'accounting',
    path: '/accounting/',
    icon: AccountBalanceIcon,
  },
  {
    label: 'Peers',
    id: 'peers',
    path: '/peers/',
    icon: DeviceHubIcon,
  },
  {
    label: 'Settings',
    id: 'settings',
    path: '/settings/',
    icon: SettingsIcon,
  },
]

const useStyles = makeStyles((theme: Theme) => {
  const isLight = theme.palette.type === 'light'

  return createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.background.paper,
      boxShadow: 'none',
    },
    drawerContainer: {
      overflow: 'auto',
    },
    activeSideBar: {},
    activeSideBarItem: {
      // color: '#000',
      backgroundColor: `rgba(255, 255, 255, ${isLight ? '0.4' : '0.16'})`,
    },
    toolbar: theme.mixins.toolbar,
  })
})

interface Props extends RouteComponentProps {
  themeMode: string
  health: boolean
  nodeHealth: Health | null
}

export default function SideBar(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <Toolbar />
          <List>
            {navBarItems.map(item => (
              <Link to={item.path} key={item.id} style={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItem
                  button
                  selected={props.location.pathname === item.path}
                  className={props.location.pathname === item.path ? classes.activeSideBarItem : ''}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    className={props.location.pathname === item.path ? classes.activeSideBar : ''}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          {/* <List>
            <MUILink
              href={process.env.REACT_APP_BEE_DOCS_HOST}
              target="_blank"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              <ListItem button>
                <ListItemText primary={'Docs'} />
                <OpenInNewSharp fontSize="small" />
              </ListItem>
            </MUILink>
          </List> */}
        </div>
        <div style={{ position: 'fixed', bottom: 0, width: 'inherit', padding: '10px' }}>
          <ListItem>
            <div style={{ marginRight: '30px' }}>
              <div
                style={{
                  backgroundColor: props.health ? '#32c48d' : '#c9201f',
                  marginRight: '7px',
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span>API</span>
            </div>
            <div>
              <div
                style={{
                  backgroundColor: props.nodeHealth?.status === 'ok' ? '#32c48d' : '#c9201f',
                  marginRight: '7px',
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span>Debug API</span>
            </div>
          </ListItem>
        </div>
      </Drawer>
    </div>
  )
}
