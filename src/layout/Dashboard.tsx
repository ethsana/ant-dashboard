import { useState, useEffect, ReactElement, Fragment } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import AlertVersion from '../components/AlertVersion'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import SideBar from '../components/SideBar'
import NavBar from '../components/NavBar'
// import NavBar from '../components/NavBar'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useApiHealth, useDebugApiHealth } from '../hooks/apiHooks'
import { RouteComponentProps } from 'react-router'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
    },
    main: {
      marginLeft: '240px',
      flexGrow: 1,
      minHeight: `calc(100vh - 64px)`,
      backgroundColor: theme.palette.background.default,
      padding: '12px',
      boxSizing: 'border-box',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.background.default,
      flexGrow: 1,
    },
    toolbar: {
      width: '100%',
      justifyContent: 'space-between',
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
  }),
)

interface Props extends RouteComponentProps {
  children?: ReactElement
}

const Dashboard = (props: Props): ReactElement => {
  const classes = useStyles()

  const [themeMode, toggleThemeMode] = useState<string>('light')

  // FIXME: handle errrors and loading
  const { health } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const userVersion = nodeHealth?.version

  // useEffect(() => {
  //   const theme = localStorage.getItem('theme')

  //   if (theme) {
  //     props?.switchTheme(String(localStorage.getItem('theme')))
  //   } else if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
  //     props?.switchTheme('dark')
  //   }

  //   window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', e => {
  //     props?.switchTheme(e?.matches ? 'dark' : 'light')
  //   })

  //   return () =>
  //     window?.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', e => {
  //       props?.switchTheme(e?.matches ? 'dark' : 'light')
  //     })
  // }, [])

  return (
    <Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <NavBar />
      </AppBar>
      <div style={{ height: '64px' }} />
      <SideBar {...props} themeMode={themeMode} health={health} nodeHealth={nodeHealth} />
      <ErrorBoundary>
        <main className={classes.main}>
          <AlertVersion version={userVersion} isLoadingNodeHealth={isLoadingNodeHealth} />
          {props.children}
        </main>
      </ErrorBoundary>
    </Fragment>
  )
}

export default Dashboard
