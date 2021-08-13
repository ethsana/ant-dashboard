import { useContext } from 'react'
import { Context, ApplicationInterface } from '../providers/Application'
export default (): ApplicationInterface => useContext(Context)
