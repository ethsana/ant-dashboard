import React, { ReactElement } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { useEarns } from '../../hooks/status'
import CashoutEarnModal from '../../components/ CashoutEarnModal'
import CashoutDespositModal from '../../components/CashoutDespositModal'
import { Container } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
      height: 142,
    },
    span: {
      margin: '10px auto',
      color: theme.palette.text.primary,
      fontWeight: 500,
      fontSize: 15,
    },
    label: {
      display: 'block',
      fontSize: 16,
      color: theme.palette.primary.main,
    },
    val: {
      display: 'block',
      paddingTop: '2px',
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

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Amount of SANA deposits</span>
              <span className={classes.val}>50,000</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Node Status</span>
              <span className={classes.val}>
                <PeerStatus isWork={isWork} />
                {isWork ? 'working' : 'unwork'}
              </span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Received rewards</span>
              <span className={classes.val}>{reward.toFixedDecimal()}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Unclaimed awards</span>
              <span className={classes.val}>{pending.toFixedDecimal()}</span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Frozen SANA</span>
              <span className={classes.val}>{isLockup ? '50,000' : '0'}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Unfrozen SANA</span>
              <span className={classes.val}> {isLockup ? '0' : '50,000'}</span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Total revenue</span>
              <span className="val">{totalEarns.toFixedDecimal()}</span>
            </div>
            <div className={classes.span} style={{ display: 'flex', marginTop: '20px' }}>
              <CashoutEarnModal disabled={Boolean(pending.toBigNumber.isZero())} />
              <CashoutDespositModal disabled={isLockup || !isWork} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default IcomeCard
