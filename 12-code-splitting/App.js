import * as React from 'react'
import Loading from './Loading'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const Home = React.lazy(() => import('./Home'))
const Newsletters = React.lazy(() => import('./Newsletters'))
const Dashboard = React.lazy(() => import('./Dashboard'))

export default function App () {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/newsletters'>Newsletters</Link></li>
          <li><Link to='/dashboard'>Dashboard</Link></li>
        </ul>

        <hr />

        <React.Suspense fallback={<Loading />}>
          <Route exact path='/'><Home /></Route>
          <Route path='/newsletters'><Newsletters /></Route>
          <Route path='/dashboard'><Dashboard /></Route>
        </React.Suspense>
      </div>
    </Router>
  )
}