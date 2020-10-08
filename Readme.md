If you’ve been in React land for the last few years, you know that React Router has gone through a few different iterations. Say what you will, but it’s clear that the React Router we have today is a huge improvement on previous versions. The reason for these changes are pretty standard - the authors today are more experienced React developers than they were when React Router was first built. You see, back in 2014, everyone was new to React. React itself was still under a year old and no one really knew to what extent this whole component thing would play out. With that in mind, it’s natural that the first commits of React Router looked something like this.

React Router's first commits

At the time, the creators of React Router were coming from Ember backgrounds. So naturally, the first version of React Router was similar in nature to that of Ember’s router. That is, with both routers you’d establish your routes statically as part of the app’s initialization process. In fact, mostly all of the router’s you’re probably familiar with are used this way - Express, Angular, Ember, etc.

Here’s some code from an older version of React Router (v3). As you can see, you’d have a routes.js file where you’d establish your static routes.

// routes.js

const routes = (
  <Router>
    <Route path='/' component={Main}>
      <IndexRoute component={Home} />
      <Route path='playerOne' component={Prompt} />
      <Route path='playerTwo/:playerOne' component={Prompt} />
      <Route path='battle' component={ConfirmBattle} />
      <Route path='results' component={Results} />
      <Route onEnter={checkAuth} path='dashboard' component={Dashboard} />
    </Route>
  </Router>
)

export default routes
Then when you’d initialize your app, you’d pass your route to ReactDOM.render.

// index.js

import * as React from 'react'
import ReactDOM from 'react-dom'
import routes from './config/routes'

ReactDOM.render(routes, document.getElementById('app'))
This brings up the question, is static routing bad? The answer to that is obviously no. However, one could argue it’s not really the “React way” of doing things. Since its creation, as the creators of React Router gained more experience, what they found was the original API behind React Router didn’t align with the mental model of React. Not only that but in some places React Router even competed against React.

Looking back at the previous example, we pass an onEnter prop to the <Route> component.

<Route
  onEnter={checkAuth}
  path='dashboard'
  component={Dashboard}
/>
The idea here is that before the user sees the Dashboard component, the checkAuth function verifies the user is authenticated. Not bad, but React has built in ways for accomplishing this already with the useEffect Hook.

With the original versions of React Router, it was more of a router for React rather than a true React router.

React Router v4 (and now v5) were built to fix these inconsistencies and work with React, rather than against it. If you’re already familiar with the benefits of React and the benefits of component composition, newer versions of React Router are going to make you feel at home - you just need to forget everything you know about traditional static routers.

So what is it about newer versions of React Router that align so nicely with React when previous versions fought against it? The answer has to do with composition. By ditching static route configs (rrv4) and leveraging custom Hooks (rrv5), you can compose your routes together just like you would any other part of your React app.

Now that you’re familiar with the why of React Router, let’s look at some code.

BrowserRouter
There are certain circumstances where React Router will need to pass routing props to any component in your application. To accomplish this, React Router uses React Context under the hood of the BrowserRouter component. There’s not much to it, you just need to make sure that if you’re using React Router on the web, you wrap your app inside of a BrowserRouter component.

It’s convention to rename BrowserRoute to Router when you import it. We’ll stick to that pattern in this course.

import ReactDOM from 'react'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App`

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
, document.getElementById('app))
Route
Next is the workhorse of React Router, the Route component. Put simply, Route will render its children element if its path prop matches the app’s location. If not, it’ll render null.

<Route path='/feed'>
  <Home />
</Route>
<Route path='/messages'>
  <Messages >
</Route>
The only gotcha to the Route component is its exact prop. When true, a Route with an exact prop will only match (and therefor render its children element) if the path matches the app’s location exactly. Sounds straight forward but it gets a little weird since React Router v5 does partial matching.

<Route path='/users'>
  <Users />
</Route>
<Route path='/users/new'>
  <NewUser />
</Route>
In this example, if the user was at /users/new, what components would you expect to see? It may come as a surprise but you’d see both the NewUser component as well as the Users component.

The reason for this is because /users is a partial match of /users/new, so both Routes match.’

The most frequent use of the exact prop will be when you have an index route, /. Yes, the index route will partially match any other Route in your application.

<Route path='/'> {/* 🚨 Always matches */}
  <Home />
</Route>
<Route path='/messages'>
  <Messages >
</Route>
<Route exact path='/'>
  {/* Only matches when the user is at / */}
  <Home />
</Route>
<Route path='/messages'>
  <Messages >
</Route>
In their defense, they fix this weird behavior in React Router v6.

Link
Now that you know how to create Routes, the next step is being able to navigate between them. This is the purpose of the Link component.

To tell Link what path to take the user to when clicked, you pass it a to prop.

<nav>
  <Link to='/'>Home</Link>
  <Link to='/messages'>Messages</Link>
</nav>
If you need more control over Link, you can pass to as an object.

<nav>
  <Link to='/'>Home</Link>
  <Link to={{
    pathname: '/messages',
    search: '?sort=date',
    state: { fromHome: true },
    hash: '#does-anyone-use-hashes-anymore`
  }}>Messages</Link>
</nav>
At this point we’ve covered the absolute fundamentals of React Router v5 but one thing should be clear - by embracing composition, React Router is truly a router for React. I believe React will make you a better JavaScript developer and React Router will make you a better React developer.