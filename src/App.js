import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import store from './store'
import history from './history'
import Layouts from './layouts'
import { THEME_CONFIG } from './configs/AppConfig'
import './lang'
import moment from 'moment'

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
}

function App() {
  useEffect(() => {
    const currentDate = new Date()
    const utcDate = currentDate.toISOString()

    console.log(moment(utcDate).format(), utcDate, 'shittee')

    console.log(
      moment('2023-06-26T15:59:14.879Z').format('YYYY-MM-DD hh:mm a'),
      'geyu'
    )
  }, [])
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter history={history}>
          <ThemeSwitcherProvider
            themeMap={themes}
            defaultTheme={THEME_CONFIG.currentTheme}
            insertionPoint="styles-insertion-point"
          >
            <Layouts />
          </ThemeSwitcherProvider>
        </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
