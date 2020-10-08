import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

const Home = () => <h1>Home</h1>
const Settings = () => <h1>Settings</h1>
const FourZeroFour = () => <h1>404</h1>

export default function App () {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>

        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route exact path="/settings"><Settings /></Route>
          <Route path='*'><FourZeroFour /></Route>
        </Switch>
      </div>
    </Router>
  )
}