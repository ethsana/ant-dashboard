import { Typography } from '@material-ui/core/'
import QRCodeModal from './QRCodeModal'
import ClipboardCopy from './ClipboardCopy'

import Identicon from 'react-identicons'
import { ReactElement } from 'react'
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined'
interface Props {
  address: string | undefined
  network?: string
  hideBlockie?: boolean
  transaction?: boolean
  truncate?: boolean
}

export default function EthereumAddress(props: Props): ReactElement {
  return (
    <Typography component="div" variant="subtitle1">
      {props.address ? (
        <div style={{ display: 'flex' }}>
          {props.hideBlockie ? null : (
            <div style={{ paddingTop: '5px', marginRight: '10px' }}>
              {/* <Identicon size={20} string={props.address} /> */}
              <AccountBalanceWalletOutlinedIcon style={{ width: '23' }} />
            </div>
          )}
          <div>
            <a
              style={
                props.truncate
                  ? {
                      marginRight: '7px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }
                  : { marginRight: '7px' }
              }
              href={`https://${props.network}/${props.transaction ? 'tx' : 'address'}/${props.address}`}
              target="_blank"
              rel="noreferrer"
            >
              {props.address}
            </a>
          </div>
          <QRCodeModal value={props.address} label={'Ethereum Address'} />
          <ClipboardCopy value={props.address} />
        </div>
      ) : (
        '-'
      )}
    </Typography>
  )
}
