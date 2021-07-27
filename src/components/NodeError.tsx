import { ReactElement, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useStatusNodeVersion } from '../hooks/status'
import { Button, colors } from '@material-ui/core'
import { Sync } from '@material-ui/icons/'
// const SUPPORTED_Ant_VERSION_EXACT = '0.0.2'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      //   marginBottom: theme.spacing(2),
    },
  }),
)

interface AlertInface {
  isWork: boolean
  isLoading: boolean
}

export default function NodeError({ isWork, isLoading }: AlertInface): ReactElement | null {
  const classes = useStyles()

  return (
    <Collapse in={true}>
      <div className={classes.root}>
        <Alert severity="error">
          <AlertTitle>Note</AlertTitle>
          <div>The node is wrong, refresh to check</div>
          <Button variant="outlined" size="small" style={{ marginTop: '7px' }} onClick={() => window.location.reload()}>
            <Sync />
            <span>Refresh Checks</span>
          </Button>
        </Alert>
      </div>
    </Collapse>
  )
}
