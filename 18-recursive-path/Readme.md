Recursive routes aren’t the most pragmatic thing in the world, but they really show off the benefits of React Router v5’s component-based approach to routing.

If you’re not familiar with nested routes, I’d check out Nested Routes with React Router v5 before continuing.

The main idea here is that since React Router v5 is just components, theoretically, you can create recursive, and therefore infinite routes. The secret lies in setting up the right data structure which can lead to the infinite routes. In this example, we’ll use an array of users who all have an id, a name, and an array of friends.

const users = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]
By having this data structure set up this way, when we render a Person, we’ll render all of their friends as Links. Then, when a Link is clicked, we’ll render all of that person’s friends as Links, and on and on. Each time a Link is clicked, the app’s pathname will become progressively longer.

Initially, we’ll be at / and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David
If Kim is clicked, then the URL will change to /2 (Kim’s id) and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David

Kim's Friends

  * Michelle
  * Sean
  * David
If David is clicked, then the URL will change to /2/3 (Kim’s id then David’s id) and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David

Kim's Friends

  * Michelle
  * Sean
  * David

David's Friends

  * Sean
  * Kim
And this process repeats for as long as the user wants to click on Links.

Now that we have the right data structure and mental model for our app, the next thing to do it construct our initial Routes. As we just saw, we want the main kickoff point of our app to be /:id. The component that’s going to be rendered at that path (and eventually do all the heavy lifting of creating our nested Routes and Links) is our Person component. For now, we’ll just keep it simple.

import * as React from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const users = [
  { id: 0, name: 'Michelle', friends: [1, 2, 3] },
  { id: 1, name: 'Sean', friends: [0, 3] },
  { id: 2, name: 'Kim', friends: [0, 1, 3], },
  { id: 3, name: 'David', friends: [1, 2] }
]

const Person = () => {
  return (
    <div>
      PERSON
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Route path="/:id">
        <Person />
      </Route>
    </Router>
  )
}
💻 Play with the code.

Now one small change before we start implementing our Person component. As we just saw, the main kickoff point of our app is /:id. This is what we want, but it’s a little strange to have nothing at the main index route, /. Let’s set up a simple redirect so if the user visits /, they’ll be taken to /0.

export default function App() {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/0" />
      </Route>
      <Route path="/:id">
        <Person />
      </Route>
    </Router>
  )
}
💻 Play with the code.

Now comes the fun part, implementing our Person component.

Remember, there are a few things this component needs to be responsible for.

Using the id URL parameter, it needs to find that specific person in the users array.
It should render a Link for every one of that specific person’s friends.
It should render a Route component which will match for the current pathname + /:id.
Let’s tackle #1. We know the id of the person we need to grab because of the URL parameter. Next, using that id, we can use Array.find to grab the person out of the users array.

const Person = () => {
  const { id } = useParams()
  const person = users.find((p) => p.id === Number(id))

  return (
    <div>
      PERSON
    </div>
  )
}
💻 Play with the code.

Next up we need to map over the person's friends and create a Link for each one of them. The only “gotcha” here is what we pass as the to prop to Link. We want to make sure that we’re taking the current URL, however deeply nested it is, and appending the id of the person we’re mapping over to it. To grab the current URL, we can use React Router v5.1’s useRouteMatch custom Hook.

const Person = () => {
  const { id } = useParams()
  const person = users.find((p) => p.id === Number(id))
  const { url } = useRouteMatch()

  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <ul>
        {person.friends.map((id) => (
          <li key={id}>
            <Link to={`${url}/${id}`}>
              {users.find((p) => p.id === id).name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
[💻 Play with the code.]

Finally, as stated in #3, we need to render a Route to match the pattern of our newly created Links. Because we’re creating a nested route, similar to what we did with Link, we’ll want to make sure we append the URL parameter (/:id) to the app’s path up until that point. To get the path, we can use the useRouteMatch custom Hook.

const Person = () => {
  const { id } = useParams()
  const person = users.find((p) => p.id === Number(id))
  const { url, path } = useRouteMatch()

  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <ul>
        {person.friends.map((id) => (
          <li key={id}>
            <Link to={`${url}/${id}`}>
              {users.find((p) => p.id === id).name}
            </Link>
          </li>
        ))}
      </ul>

      <Route path={`${path}/:id`}>
        <Person />
      </Route>
    </div>
  )
}
💻 Play with the code.

That’s it. Person renders a list of Links as well as a Route matching any of those Links. When a Link is clicked, the Route matches which renders another Person component which renders a list of Links and a new Route. This process continues as long as the user continues to click on any Links.