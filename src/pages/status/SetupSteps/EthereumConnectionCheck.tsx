import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'

type Props = StatusEthereumConnectionHook

export default function EthereumConnectionCheck({ isLoading, isOk, nodeAddresses }: Props): ReactElement | null {
  if (isLoading) return null

  if (isOk) {
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Node Address
        </Typography>
        <EthereumAddress address={nodeAddresses?.ethereum} network={'blockscout.com/xdai/mainnet'} />
      </div>
    )
  }

  return (
    <p>
      Your Ant node must have access to the xdai blockchain, By default, Ant expects a local node at
      http://localhost:8545. To use a provider instead, simply change your <strong>--swap-endpoint</strong> in your
      configuration file.
    </p>
  )
}
