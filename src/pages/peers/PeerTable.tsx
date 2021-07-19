import React, { ReactElement, useState } from 'react'
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
  Tooltip,
  Container,
  CircularProgress,
} from '@material-ui/core'
// import { Autorenew } from '@material-ui/icons'

import { beeDebugApi } from '../../services/bee'
import type { Peer } from '@ethersphere/bee-js'
import Rocketpng from '../../assets/rocket.png'

const RocketIcon = () => <img src={Rocketpng} width="24" style={{ border: 'none', outline: 0 }} />

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    container: {
      maxHeight: 'calc(100vh - 250px)',
    },
    headerCell: {
      background: theme.palette.type === 'dark' ? '#424242' : '#fff',
    },
    tableCell: {
      borderBottom: 0,
    },
  }),
)

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    border: 0,
  },
}))(TableRow)

interface Props {
  peers: Peer[] | null
  isLoading: boolean
  error: Error | null
}

function PeerTable(props: Props): ReactElement {
  const classes = useStyles()

  const [peerLatency, setPeerLatency] = useState([{ peerId: '', rtt: '', loading: false }])

  const PingPeer = (peerId: string) => {
    setPeerLatency([...peerLatency, { peerId: peerId, rtt: '', loading: true }])
    beeDebugApi.connectivity
      .ping(peerId)
      .then(res => {
        setPeerLatency([...peerLatency, { peerId: peerId, rtt: res.rtt, loading: false }])
      })
      .catch(() => {
        setPeerLatency([...peerLatency, { peerId: peerId, rtt: 'error', loading: false }])
      })
  }

  if (props.isLoading) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (props.error || props.peers === null) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <p>Failed to load peers</p>
      </Container>
    )
  }

  return (
    <div>
      <TableContainer className={classes.container} component={Paper}>
        <Table className={classes.table} aria-label="peers table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Index</TableCell>
              <TableCell className={classes.headerCell}>Peer Id</TableCell>
              <TableCell className={classes.headerCell} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.peers.map((peer: Peer, idx: number) => (
              <StyledTableRow key={peer.address}>
                <TableCell component="th" scope="row" className={classes.tableCell}>
                  {idx + 1}
                </TableCell>
                <TableCell className={classes.tableCell}>{peer.address}</TableCell>
                <TableCell align="right" className={classes.tableCell}>
                  <Tooltip title="Ping node">
                    <Button color="primary" onClick={() => PingPeer(peer.address)}>
                      {
                        // FIXME: this should be broken up
                        /* eslint-disable no-nested-ternary */
                        peerLatency.find(item => item.peerId === peer.address) ? (
                          peerLatency.filter(item => item.peerId === peer.address)[0].loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            peerLatency.filter(item => item.peerId === peer.address)[0].rtt
                          )
                        ) : (
                          // <Autorenew />
                          <RocketIcon />
                        )
                        /* eslint-enable no-nested-ternary */
                      }
                    </Button>
                  </Tooltip>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PeerTable
