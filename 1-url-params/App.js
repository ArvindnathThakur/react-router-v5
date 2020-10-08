import * as React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
  useParams
} from 'react-router-dom'

const Student = () => {
  const { name } = useParams()

  return <h3>Student: {name}</h3>
}

const Invoice = () => {
  const { id } = useParams()
  
  return <h3>Invoice #{id}</h3>
}

export default function App () {
  return (
    <Router>
      <React.Fragment>
        <h2>Invoices</h2>
        <ul>
          <li><Link to="/invoices/1">1</Link></li>
          <li><Link to="/invoices/2">2</Link></li>
          <li><Link to="/invoices/3">3</Link></li>
          <li><Link to="/invoices/4">4</Link></li>
        </ul>

        <h2>Students</h2>
        <ul>
          <li><Link to="/tyler">Tyler</Link></li>
          <li><Link to="/jake">Jake</Link></li>
          <li><Link to="/mikenzi">Mikenzi</Link></li>
        </ul>

        <hr />

        <Route exact path='/:name'>
          <Student />
        </Route>
        <Route path='/invoices/:id'>
          <Invoice />
        </Route>
      </React.Fragment>
    </Router>
  )
}