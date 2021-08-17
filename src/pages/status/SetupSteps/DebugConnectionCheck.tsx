import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'
import ConnectToHost from '../../../components/ConnectToHost'
import { debugApiHost } from '../../../constants'

type Props = StatusHookCommon

export default function NodeConnectionCheck({ isLoading, isOk }: Props): ReactElement | null {
  if (isLoading) return null

  const changeDebugApiUrl = (
    <div style={{ display: 'flex', marginTop: '25px', marginBottom: '25px' }}>
      <span style={{ marginRight: '15px' }}>
        Debug API (<Typography variant="button">{debugApiHost}</Typography>)
      </span>
      <ConnectToHost hostName={'debug_api_host'} defaultHost={debugApiHost} />
    </div>
  )

  if (isOk) {
    return changeDebugApiUrl
  }

  return (
    <div>
      {changeDebugApiUrl}

      <div>
        <Typography component="div" variant="body2" gutterBottom style={{ margin: '15px' }}>
          We cannot connect to your nodes debug API at <Typography variant="button">{debugApiHost}</Typography>. Please
          check the following to troubleshoot your issue.
        </Typography>
      </div>
    </div>
  )
}
