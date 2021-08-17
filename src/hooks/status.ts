import { ChequebookAddressResponse } from '@ethersphere/bee-js'
import {
  ChequebookBalance,
  useApiChequebookAddress,
  useApiChequebookBalance,
  useApiHealth,
  useApiNodeAddresses,
  useApiNodeTopology,
  useDebugApiHealth,
  useLatestBeeRelease,
  useEarnsInfo,
} from './apiHooks'
import semver from 'semver'
import { Token } from '../models/Token'

export interface StatusChequebookHook extends StatusHookCommon {
  chequebookBalance: ChequebookBalance | null
  chequebookAddress: ChequebookAddressResponse | null
}

export const useStatusNodeVersion = (): StatusNodeVersionHook => {
  const { latestBeeRelease, isLoadingLatestBeeRelease } = useLatestBeeRelease()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const latestVersion = semver.coerce(latestBeeRelease?.name)?.version
  const latestUserVersion = semver.coerce(nodeHealth?.version)?.version

  const isLatestBeeVersion = Boolean(
    latestVersion &&
      latestUserVersion &&
      semver.satisfies(latestVersion, latestUserVersion, {
        includePrerelease: true,
      }),
  )

  return {
    isLoading: isLoadingNodeHealth || isLoadingLatestBeeRelease,
    // isOk: Boolean(
    //   nodeHealth &&
    //     semver.satisfies(nodeHealth.version, engines.bee, {
    //       includePrerelease: true,
    //     }),
    // ),
    isOk: true,
    userVersion: nodeHealth?.version,
    latestVersion,
    latestUrl: latestBeeRelease?.html_url || 'https://github.com/ethersphere/bee/releases/latest',
    isLatestBeeVersion,
  }
}

export const useStatusEthereumConnection = (): StatusEthereumConnectionHook => {
  const { isLoadingNodeAddresses, nodeAddresses } = useApiNodeAddresses()

  return {
    isLoading: isLoadingNodeAddresses,
    isOk: Boolean(nodeAddresses?.ethereum),
    nodeAddresses,
  }
}

export const useStatusDebugConnection = (): StatusHookCommon => {
  const { isLoadingNodeHealth, nodeHealth } = useDebugApiHealth()

  return {
    isLoading: isLoadingNodeHealth,
    isOk: Boolean(nodeHealth?.status === 'ok'),
  }
}

export const useStatusConnection = (): StatusHookCommon => {
  const { isLoadingHealth, health } = useApiHealth()

  return {
    isLoading: isLoadingHealth,
    isOk: health,
  }
}

export const useStatusTopology = (): StatusTopologyHook => {
  const { topology, isLoading } = useApiNodeTopology()

  return {
    isLoading,
    isOk: Boolean(topology?.connected && topology?.connected > 0),
    topology,
  }
}

export const useStatusChequebook = (): StatusChequebookHook => {
  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()

  return {
    isLoading: isLoadingChequebookAddress || isLoadingChequebookBalance,
    isOk:
      Boolean(chequebookAddress?.chequebookAddress) &&
      chequebookBalance !== null &&
      chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0),
    chequebookBalance,
    chequebookAddress,
  }
}

export interface Earns {
  reward: Token
  pending: Token
  isWork: boolean
  totalEarns: Token
  isLoadingEarnsInfo: boolean
  isLockup: boolean
  error: string
}

export const useEarns = (): Earns => {
  const { isLoadingEarnsInfo, error, earnsInfo } = useEarnsInfo()

  if (!earnsInfo) {
    return {
      reward: new Token('0'),
      pending: new Token('0'),
      totalEarns: new Token('0'),
      isWork: false,
      isLoadingEarnsInfo,
      isLockup: false,
      error,
    }
  }

  const reward = new Token(earnsInfo.reward)
  const pending = new Token(earnsInfo.pending)
  const totalEarns = new Token(reward.toBigNumber.plus(pending.toBigNumber))
  const isLockup = Number(earnsInfo.expire) * 1000 - new Date().getTime() >= 0

  return {
    reward,
    pending,
    totalEarns,
    isWork: Boolean(earnsInfo.work),
    isLoadingEarnsInfo,
    isLockup: !Boolean(earnsInfo.work) || isLockup,
    error,
  }
}
