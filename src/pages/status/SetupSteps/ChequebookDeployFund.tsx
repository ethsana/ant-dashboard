import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'
import DepositModal from '../../../containers/DepositModal'
import type { ReactElement } from 'react'
import type { StatusChequebookHook } from '../../../hooks/status'

interface Props extends StatusChequebookHook {
  ethereumAddress?: string
}

const ChequebookDeployFund = ({
  isLoading,
  chequebookAddress,
  chequebookBalance,
  ethereumAddress,
}: Props): ReactElement | null => {
  if (isLoading) return null

  return (
    <div>
      <p style={{ marginBottom: '20px', display: 'flex' }}>
        {chequebookAddress?.chequebookAddress && <DepositModal />}
      </p>
      <div style={{ marginBottom: '10px' }}>
        {!(chequebookAddress?.chequebookAddress && chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0)) && (
          <div>
            <span>
              Your chequebook is either not deployed or funded. Join{' '}
              <a href="https://discord.gg/c72mpR7Erf" rel="noreferrer" target="_blank">
                our discord channel
              </a>
            </span>
          </div>
        )}
      </div>
      <Typography variant="subtitle1" gutterBottom>
        Chequebook Address
      </Typography>
      <EthereumAddress address={chequebookAddress?.chequebookAddress} network={'blockscout.com/xdai/mainnet'} />
    </div>
  )
}

export default ChequebookDeployFund
