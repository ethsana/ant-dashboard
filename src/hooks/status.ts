import { ChequebookAddressResponse } from '@ethersana/ant-js'
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
    isOk: true,
    userVersion: nodeHealth?.version,
    latestVersion,
    latestUrl: latestBeeRelease?.html_url || 'https://github.com/ethsana/sana/releases/latest',
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
  // chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0),

  return {
    isLoading: isLoadingChequebookAddress || isLoadingChequebookBalance,
    isOk: Boolean(chequebookAddress?.chequebookAddress),
    chequebookBalance,
    chequebookAddress,
  }
}

export interface Earns {
  reward: Token
  pending: Token
  isWork: boolean
  totalEarns: Token
  deposit?: Token | null
  isLoadingEarnsInfo: boolean
  isLockup: boolean
  expire: number
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
      expire: 0,
    }
  }

  const reward = new Token(earnsInfo.reward)
  const deposit = earnsInfo.deposit ? new Token(earnsInfo.deposit) : new Token('0')
  const pending = new Token(earnsInfo.pending)
  const totalEarns = new Token(reward.toBigNumber.plus(pending.toBigNumber))
  const isLockup = Number(earnsInfo.expire) * 1000 - new Date().getTime() >= 0
  const expire = Number(earnsInfo.expire) * 1000

  return {
    reward,
    pending,
    deposit,
    totalEarns,
    expire,
    isWork: Boolean(earnsInfo.work),
    isLoadingEarnsInfo,
    isLockup: !Boolean(earnsInfo.work) || isLockup,
    error,
  }
}
