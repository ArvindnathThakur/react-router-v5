URL parameters are parameters whose values are set dynamically in a page’s URL. This allows a route to render the same component (UI) while passing that component the dynamic portion of the URL so it can change based off of it.

Take Twitter for example. Regardless of which profile you go to, Twitter is going to show you the same UI just with different data. They do this by utilizing URL Parameters. If rendered by React Router v5, the Route for the profile pages may look like this.

<Route path='/:handle'>
  <Profile />
</Route>
Notice that the path has a : in front of it. That’s because it’s dynamic. Instead of matching literally, it’s matching for a specific pattern. With this app, anytime someone visits a route that matches that pattern (/tylermcginnis, /dan_abramov, /anything), the Profile component is going to be rendered.

Now the question becomes, how do we access the dynamic portion of the URL (in this case, handle) from the component that’s rendered? As of React Router v5.1, React Router ships with a custom Hook that does just this, useParams. useParams returns an object with a mapping between the URL Parameter and its value.

import * as React from 'react'
import { useParams } from 'react-router-dom'

function Profile () {
  const [user, setUser] = React.useState(null)
  const { handle } = useParams()

  React.useEffect(() => {
    fetch(`https://api.twitter.com/user/${handle}`)
      .then(setUser)
  }, handle)

  return (
    ...
  )
}
Now let’s look at the example from the React Router v5 docs. It’s a simple app that allows us to navigate between 4 different “accounts” - netflix, zillow-group, yahoo, and module-create. Each account will have its own page, similar to Twitter we saw earlier.

First, let’s import the components we’ll need and create our navbar for linking between the different accounts.

import * as React from 'react'
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'

export default function App () {
  return (
    <Router>
      <React.Fragment>
        <h2>Accounts</h2>
        <ul>
          <li><Link to="/netflix">Netflix</Link></li>
          <li><Link to="/zillow-group">Zillow Group</Link></li>
          <li><Link to="/yahoo">Yahoo</Link></li>
          <li><Link to="/modus-create">Modus Create</Link></li>
        </ul>
      </React.Fragment>
    </Router>
  )
}
Now that we can navigate between our different accounts, we need to actually render some UI for each account page. To keep things simple, we’ll create a component that just renders the name of the account, i.e. the URL Parameter. Again, in order to get access to the URL Parameter with React Router v5, you use the useParams Hook.

function Account () {
  const { account } = useParams()

  return <h3>ID: {account}</h3>
}
Now that we have our links and the component to render, let’s create our Route with a URL Parameter. Like we saw earlier with Twitter, the pattern we want to use is /:account.

export default function App () {
  return (
    <Router>
      <React.Fragment>
        <h2>Accounts</h2>
        <ul>
          <li><Link to="/netflix">Netflix</Link></li>
          <li><Link to="/zillow-group">Zillow Group</Link></li>
          <li><Link to="/yahoo">Yahoo</Link></li>
          <li><Link to="/modus-create">Modus Create</Link></li>
        </ul>

        <Route path='/:account'>
          <Account />
        </Route>
      </React.Fragment>
    </Router>
  )
}
💻 Play with the code.

And that’s it. Because we’re using a URL parameter, we can have four different paths render the same component and that component can get access to the dynamic URL Parameter via React Router v5’s useParams Hook.