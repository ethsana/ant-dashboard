import { ReactElement } from 'react'
import { Container, CircularProgress } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import NodeSetupWorkflow from './NodeSetupWorkflow'
import StatusCard from './StatusCard'
import EthereumAddressCard from '../../components/EthereumAddressCard'
// import NodeError from '../../components/NodeError'
import IconCard from './IcomeCard'
import {
  useStatusEthereumConnection,
  useStatusNodeVersion,
  useStatusDebugConnection,
  useStatusConnection,
  useStatusTopology,
  useStatusChequebook,
  useEarns,
} from '../../hooks/status'

// import NodeError from '../../components/NodeError'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Status(): ReactElement {
  const classes = useStyles()
  const nodeVersion = useStatusNodeVersion()
  const ethereumConnection = useStatusEthereumConnection()
  const debugApiConnection = useStatusDebugConnection()
  const apiConnection = useStatusConnection()
  const topology = useStatusTopology()
  const chequebook = useStatusChequebook()
  const mineStatus = useEarns()

  const checks = [nodeVersion, ethereumConnection, debugApiConnection, apiConnection, topology, chequebook]

  // If any check data are still loading
  if (!checks.every(c => !c.isLoading)) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <div className={classes.root}>
      <StatusCard
        userBeeVersion={nodeVersion.userVersion}
        isLatestBeeVersion={nodeVersion.isLatestBeeVersion}
        isOk={checks.every(c => c.isOk)}
        nodeTopology={topology.topology}
        latestUrl={nodeVersion.latestUrl}
        nodeAddresses={ethereumConnection.nodeAddresses}
      />
      {/* <NodeError isWork={mineStatus.isWork} isLoading={mineStatus.isLoadingEarnsInfo} /> */}
      {mineStatus.error !== '404' && (
        <IconCard
          error={mineStatus.error}
          isLockup={mineStatus.isLockup}
          isWork={mineStatus.isWork}
          reward={mineStatus.reward}
          pending={mineStatus.pending}
          totalEarns={mineStatus.totalEarns}
        />
      )}
      {ethereumConnection.nodeAddresses && chequebook.chequebookAddress && (
        <EthereumAddressCard
          nodeAddresses={ethereumConnection.nodeAddresses}
          isLoadingNodeAddresses={ethereumConnection.isLoading}
          chequebookAddress={chequebook.chequebookAddress}
          isLoadingChequebookAddress={chequebook.isLoading}
        />
      )}
      <NodeSetupWorkflow
        nodeVersion={nodeVersion}
        ethereumConnection={ethereumConnection}
        debugApiConnection={debugApiConnection}
        apiConnection={apiConnection}
        topology={topology}
        chequebook={chequebook}
      />
    </div>
  )
}
