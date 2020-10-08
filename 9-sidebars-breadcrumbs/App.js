import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const routes = [
  {
    path: '/',
    exact: true,
    emojis: () => <div className='emojis'>🏠🏠🏠🏠🏠</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: '/rainbows',
    emojis: () => <div className='emojis'>🌈🌈🌈🌈🌈</div>,
    main: () => <h2>Rainbows</h2>
  },
  {
    path: '/bears',
    emojis: () => <div className='emojis'>🐻🐻🐻🐻🐻</div>,
    main: () => <h2>Bears</h2>
  }
]

export default function App () {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div className='sidebar'>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rainbows">Rainbows</Link></li>
            <li><Link to="/bears">Bears</Link></li>
          </ul>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
            >
              <route.emojis />
            </Route>
          ))}
        </div>

        <div>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
            >
              <route.main />
            </Route>
          ))}
        </div>
      </div>
    </Router>
  )
}