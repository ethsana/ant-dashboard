import React, { ReactElement } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { Button, colors } from '@material-ui/core'
import CashoutEarnModal from '../../components/ CashoutEarnModal'
import CashoutDespositModal from '../../components/CashoutDespositModal'
// import { Container } from '@material-ui/core'
import { Sync } from '@material-ui/icons/'
import { Token } from '../../models/Token'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
      // height: 142,
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

interface IncomeProps {
  isLockup: boolean
  reward: Token
  pending: Token
  isWork: boolean
  totalEarns: Token
  error: string
}

function IcomeCard({ error, isLockup, isWork, pending, reward, totalEarns }: IncomeProps): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Amount of SANA deposits</span>
              <span className={classes.val}>{isWork ? '50,000' : '0'}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Miner Node Status</span>
              <span className={classes.val}>
                <PeerStatus isWork={isWork} />
                {error ? ' The node is wrong, refresh to check' : isWork ? 'working' : 'unwork'}
                {error && (
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginTop: '7px' }}
                    onClick={() => window.location.reload()}
                  >
                    <Sync />
                    <span>Refresh Checks</span>
                  </Button>
                )}
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
              <span className={classes.val}>{isWork ? (isLockup ? '50,000' : '0') : '0'}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Unfrozen SANA</span>
              <span className={classes.val}> {isWork ? (isLockup ? '0' : '50,000') : '0'}</span>
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
              <CashoutDespositModal disabled={isLockup} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default IcomeCard
