import { ReactElement, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useStatusNodeVersion } from '../hooks/status'
import { version } from 'prettier'

// const SUPPORTED_Ant_VERSION_EXACT = '0.0.2'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  }),
)

interface VersionInface {
  version: string | null | undefined
  isLoadingNodeHealth: boolean
}

export default function VersionAlert(props: VersionInface): ReactElement | null {
  const classes = useStyles()
  const { isLoading, userVersion } = useStatusNodeVersion()
  const [open, setOpen] = useState<boolean>(true)

  if (isLoading || props.isLoadingNodeHealth) return null

  const isExactlySupportedAntVersion = props.version === userVersion

  return (
    <Collapse in={!isExactlySupportedAntVersion && open}>
      <div className={classes.root}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Warning</AlertTitle>
          Your Ant node version (<code>{userVersion}</code>) does not exactly match the Ant version we tested the Ant
          Dashboard against (<code>{props.version}</code>). Please note that some functionality may not work properly.
        </Alert>
      </div>
    </Collapse>
  )
}
