import type { ReactElement } from 'react'
import { Switch, Route } from 'react-router-dom'

import AppRoute from './AppRoute'

// layouts
import Dashboard from '../layout/Dashboard'

// pages
import Status from '../pages/status'
import Files from '../pages/files'
import Peers from '../pages/peers'
import Accounting from '../pages/accounting'
import Settings from '../pages/settings'
import Stamps from '../pages/stamps'
import AppMarkplace from '../pages/apps'

const BaseRouter = (): ReactElement => (
  <Switch>
    <AppRoute exact path="/" layout={Dashboard} component={Status} />
    <AppRoute exact path="/files/" layout={Dashboard} component={Files} />
    <AppRoute exact path="/peers/" layout={Dashboard} component={Peers} />
    <AppRoute exact path="/accounting/" layout={Dashboard} component={Accounting} />
    <AppRoute exact path="/settings/" layout={Dashboard} component={Settings} />
    <AppRoute exact path="/stamps/" layout={Dashboard} component={Stamps} />
    <AppRoute exact path="/apps/" layout={Dashboard} component={AppMarkplace} />
  </Switch>
)

export default BaseRouter
