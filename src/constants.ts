// These values can for now be constants because their change in the app reloads the page
import { getNodeApi } from './utils'

const nodeApi = getNodeApi()
export const apiHost = nodeApi.apiHost
export const debugApiHost = nodeApi.debugApiHost
