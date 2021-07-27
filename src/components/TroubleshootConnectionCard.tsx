import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography } from '@material-ui/core/'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    // marginTop: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
  },
})

export default function TroubleshootConnectionCard(): ReactElement {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Looks like your node is not connected
        </Typography>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <strong>
            <Link to="/peers">Click to run status checks</Link> on your nodes connection or check out the{' '}
            <a href={process.env.REACT_APP_ANT_DOCS_HOST} target="_blank" rel="noreferrer">
              SANA Ant Docs
            </a>
          </strong>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ marginTop: '50px' }}>
            Still not working? Drop us a message on the Ethereum SANA{' '}
            <a href="https://discord.gg/c72mpR7Erf" target="_blank" rel="noreferrer">
              Discord
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
