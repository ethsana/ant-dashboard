import { ReactElement, useCallback } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Toolbar, Chip, IconButton } from '@material-ui/core/'

import { Sun, Moon } from 'react-feather'
import SanaLogoLight from '../assets/sana-logo-light.svg'
import SanaLogoDark from '../assets/sana-logo-dark.svg'
import useTheme from '../hooks/useTheme'

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
  }),
)

export default function SideBar(): ReactElement {
  const classes = useStyles()
  const { theme: themeMode } = useTheme()

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
        <Chip style={{ marginLeft: '7px' }} size="small" label="Goerli" className={classes.network} />
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
