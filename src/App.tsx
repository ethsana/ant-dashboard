import { ReactElement, useEffect, useState, createContext } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import './App.css'

import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'

import BaseRouter from './routes/routes'
import { lightTheme, darkTheme } from './theme'
import { Provider as StampsProvider } from './providers/Stamps'
// import useTheme from './hooks/useTheme'

export const Context = createContext<{ theme: string; updater?: () => void }>({ theme: 'dark' })

const App = (): ReactElement => {
  const [theme, setTheme] = useState('dark')

  // const switchTheme = () => {
  //   const _nextTheme = theme === 'light' ? 'dark' : 'light'

  //   localStorage['theme'] = _nextTheme.toString()
  //   setTheme(_nextTheme)
  //   // window.location.reload()
  // }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <StampsProvider>
        <SnackbarProvider>
          <Context.Provider value={{ theme }}>
            <CssBaseline />
            <Router>
              <BaseRouter />
            </Router>
          </Context.Provider>
        </SnackbarProvider>
      </StampsProvider>
    </ThemeProvider>
  )
}

export default App
