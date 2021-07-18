import React, { ReactElement, useEffect, useMemo } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { useEarns } from '../../hooks/status'
import { BigNumber } from 'bignumber.js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      //   backgroundColor: theme.palette.background.paper,
    },
    card: {
      padding: theme.spacing(2),
      //   textAlign: 'center',

      height: 100,
    },
    span: {
      margin: '8px auto',
      color: theme.palette.text.primary,
      fontWeight: 500,
      fontSize: 15,
    },
  }),
)

const PeerStatus = ({ isWork }: { isWork: boolean }) => (
  <div
    style={{
      backgroundColor: isWork ? '#32c48d' : 'red',
      marginRight: '7px',
      height: '10px',
      width: '10px',
      borderRadius: '50%',
      display: 'inline-block',
    }}
  />
)

function IcomeCard(): ReactElement {
  const classes = useStyles()
  const { isLockup, reward, pending, isWork, totalEarns } = useEarns()
  console.log('isWork', isWork)

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="space-between">
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>Deposit：5000</div>
            <div className={classes.span}>
              Peer Status：
              <span>
                <PeerStatus isWork={isWork} />
                {isWork ? 'working' : 'disconnected'}
              </span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>{`Earnings Available：${reward.toFixedDecimal()}`}</div>
            <div className={classes.span}>{`Received earnings：${pending.toFixedDecimal()}`}</div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>{`Lock-up volume：${isLockup ? '50,000' : '0'}`}</div>
            <div className={classes.span}>{`Unfreeze：${isLockup ? '0' : '50,000'}`}</div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>{`Total revenue：${totalEarns.toFixedDecimal()}`}</div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default IcomeCard
