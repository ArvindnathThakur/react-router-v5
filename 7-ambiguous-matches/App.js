import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useParams
} from 'react-router-dom'

const invoices = [
  {
    id: 1,
    account: 'Google',
    amount: 5000
  },
  {
    id: 2,
    account: 'Netflix',
    amount: 7000
  },
  {
    id: 3,
    account: 'UI',
    amount: 2300
  }
]

const Home = () => <h2>Home</h2>

const Statements = () => (
  <React.Fragment>
    <h2>Statements</h2>
    <ul>
      {invoices.map(({ id, account, amount }) => (
        <li key={id}>
          <Link to={`/${id}`}>#{id}</Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

const Invoice = () => {
  const { iid } = useParams()
  const { account, id, amount } = invoices.find((inv) => inv.id === Number(iid))

  return (
    <div>
      <h2>#{id}</h2>
      <h4>{account} - ${amount.toLocaleString()}</h4>
    </div>
  )
}

export default function App () {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/statements">Statements</Link></li>
        </ul>

        <Switch>
          <Route exact path='/'><Home /></Route>
          <Route path='/statements'><Statements /></Route>
          <Route path='/:iid'><Invoice /></Route>
        </Switch>
      </div>
    </Router>
  )
}