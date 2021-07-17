import { ReactElement, useState } from 'react'

import { Container, CircularProgress } from '@material-ui/core'

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { useApiHealth, useDebugApiHealth } from '../../hooks/apiHooks'
import Download from './Download'
import Upload from './Upload'
import TabsContainer from '../../components/TabsContainer'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
// import Tabs from '@material-ui/core/Tabs'
// import Tab from '@material-ui/core/Tab'
// import PhoneIcon from '@material-ui/icons/Phone'
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import PersonPinIcon from '@material-ui/icons/PersonPin'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    // maxWidth: 500,
  },
})

export default function Files(): ReactElement {
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  if (isLoadingHealth || isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!health || nodeHealth?.status !== 'ok') return <TroubleshootConnectionCard />

  return (
    <Container>
      <TabsContainer
        values={[
          {
            label: 'download',
            component: <Download />,
          },
          {
            label: 'upload',
            component: <Upload />,
          },
        ]}
      />
    </Container>
  )
}
