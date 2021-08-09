import { createContext, ReactChild, ReactElement, useState, useCallback, useMemo } from 'react'
import { getNodeApi, getNodeApiList, NodeApi } from '../utils'

export interface ApplicationInterface {
  nodeApi: NodeApi
  nodeApiList: NodeApi[]
  refresh: () => void
  exist: (key: 'nodeName' | 'apiHost' | 'debugApiHost', value: string, id?: string) => boolean
}

const initialValues: ApplicationInterface = {
  refresh: () => {
    ///
  },
  exist: () => false,
  nodeApi: getNodeApi(),
  nodeApiList: getNodeApiList(),
}

export const Context = createContext<ApplicationInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

type FieldObj = { [name: string]: string }

export function Provider({ children }: Props): ReactElement {
  const [nodeApi, setNodeApi] = useState<NodeApi>(initialValues.nodeApi)
  const [nodeApiList, setNodeApiList] = useState<NodeApi[]>(initialValues.nodeApiList)
  const [nodeNameObj, apiHostObj, debugApiHostObj] = useMemo(() => {
    const nodeNameObj: FieldObj = {}
    const apiHostObj: FieldObj = {}
    const debugApiHostObj: FieldObj = {}

    nodeApiList.forEach(({ id, nodeName, apiHost, debugApiHost }: NodeApi) => {
      if (nodeName) nodeNameObj[nodeName] = id

      if (apiHost) apiHostObj[apiHost] = id

      if (debugApiHost) debugApiHostObj[debugApiHost] = id
    })

    return [nodeNameObj, apiHostObj, debugApiHostObj]
  }, [nodeApiList])

  const refresh = useCallback(() => {
    setNodeApi(getNodeApi())
    setNodeApiList(getNodeApiList())
  }, [setNodeApi, setNodeApiList])

  const exist = useCallback(
    (field: 'nodeName' | 'apiHost' | 'debugApiHost', value: string, id?: string): boolean => {
      let res = false
      // console.log(field, value, id, Boolean(nodeNameObj[value]))

      if (field === 'nodeName') {
        res = Boolean(nodeNameObj[value]) && (id ? id !== nodeNameObj[value] : true)
      } else if (field === 'apiHost') {
        res = Boolean(apiHostObj[value]) && (id ? id !== apiHostObj[value] : true)
      } else if (field === 'debugApiHost') {
        res = Boolean(debugApiHostObj[value]) && (id ? id !== debugApiHostObj[value] : true)
      }

      return res
    },
    [nodeNameObj, apiHostObj, debugApiHostObj],
  )

  return <Context.Provider value={{ nodeApi, nodeApiList, refresh, exist }}>{children}</Context.Provider>
}
