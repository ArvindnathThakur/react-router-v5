It’s 2020. Your users shouldn’t have to download your entire app when all they need is a piece of it. If a user is creating a new post, it doesn’t make sense to have them download all the code for the /registration route. If a user is registering, they don’t need the huge rich text editor your app needs on the /settings route. It’s wasteful and some would argue disrespectful to those users who don’t have the privilege of unlimited bandwidth. This idea has not only gained much more popularity in recent years, but it’s also become exponentially easier to pull off - it even has a fancy cool name - code splitting.

The idea is simple, don’t download code until the user needs it. Though in practice, it’s not that simple. The reason for this isn’t because code splitting itself is terribly difficult, but that there are various tools to do it and everyone has an opinion on which is the best. When you’re first starting out, it can be hard to parse what is what.

The two most common approaches are using Webpack and its bundle loader or the ECMAScript dynamic import() proposal which is currently in stage 4 of the ECMAScript process. Any chance I get to not use webpack I take, so we’ll be using dynamic import() in this post.

If you’re familiar with ES modules, you know that they’re completely static. What that means is that you must specify what you’re importing and exporting at compile time, not run time. This also means that you can’t dynamically import a module based on some condition. imports need to be declared at the top of your file or they’ll throw an error.

if (!user) {
  import * as api from './api' // 🙅‍♀️🚫. "import' and 'export' may only appear at the top level"
}
Now, what if import didn’t have to be static? Meaning what if the code above worked? What benefits would that give us? First, it would mean we could load certain modules on demand. That would be pretty powerful since it would enable us to get closer to the vision of only downloading code the user needs.

if (editPost === true) {
  import * as edit from './editpost'

  edit.showEditor()
}
Assuming editpost contained a pretty large rich text editor, we’d make sure we didn’t download it until the user was actually ready to use it.

Another cool use case of this would be for legacy support. You could hold off on downloading specific code until you were certain the user’s browser didn’t already have it natively.

Here’s the good news (that I kind of already alluded to earlier). This type of functionality does exist, it’s supported by default with Create React App, and it’s currently in Stage 4 of the ECMAScript process. The difference is that instead of using import as you typically would, you use it like a function that returns you a promise that resolves with the module once the module is completely loaded.

if (editPost === true) {
  import('./editpost')
    .then((module) => module.showEditor())
    .catch((e) => )
}
Pretty rad, right?

Now that we know how to import modules dynamically, the next step is figuring out how to use it with React and React Router v5.

The first (and probably biggest) question we need to ask ourselves when it comes to code splitting with React is where should we split at? Typically, there are two answers.

Split at the route level. 🙂
Split at the component level. 😃
The more common approach is to split at the route level. You already split your app into different routes, so adding in code splitting on top of that feels pretty natural. How would this actually look?

Let’s start off with a basic React Router v5 example. We’ll have three routes, /, /topics, /settings.

import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

import Home from './Home'
import Topics from './Topics'
import Settings from './Settings'

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/topics'>Topics</Link></li>
          <li><Link to='/settings'>Settings</Link></li>
        </ul>

        <hr />

        <Route exact path='/'>
          <Home/>
        </Route>
        <Route path='/topics'>
          <Topics/>
        </Route>
        <Route path='/settings'>
          <Settings/>
        </Route>
      </div>
    </Router>
  )
}
💻 Play with the code.

Now, say our /settings route was super heavy. It contains a rich text editor, an original copy of Super Mario Brothers, and an HD image of Guy Fieri. We don’t want the user to have to download all of that when they’re not on the /settings route. We’ve already learned about Dynamic Imports but there’s still one piece of information we’re missing, React.lazy.

React.lazy takes in a single argument - a function that invokes a dynamic import. What it returns is a regular React Component

const LazyHomeComponent = React.lazy(() => import('./Home'))

...

<LazyHomeComponent />
Now the last question you may have centers around what to show to the UI as React is loading the module. Because Dynamic Imports are asynchronous, there’s an unspecified amount of time the user needs to wait before the component is loaded, rendered, and the UI is displayed. To solve this, you can use React’s Suspense component passing it a fallback element.

const Settings = React.lazy(() => import('./Settings'))

function App () {
  return (
    <div>
      <React.Suspense fallback={<Loading />}>
        <Settings />
      </React.Suspense>
    </div>
  )
}
What’s nice about React.Suspense is that Suspense can take in multiple, lazily loaded components while still only rendering one fallback element.

const AdDashboard = React.lazy(() => import('./AdDashboard'))
const Analytics = React.lazy(() => import('./Analytics'))
const Settings = React.lazy(() => import('./Settings'))

function App () {
  return (
    <div>
      <React.Suspense fallback={<Loading />}>
        <AdDashboard />
        <Analytics />
        <Settings />
      </React.Suspense>
    </div>
  )
}
Now let’s update our app from earlier to utilize our newly found knowledge of Dynamic Imports, React.lazy, and React.Suspense.

import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'
import Loading from './Loading'

const Home = React.lazy(() => import('./Home'))
const Topics = React.lazy(() => import('./Topics'))
const Settings = React.lazy(() => import('./Settings'))

export default function App () {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/topics'>Topics</Link></li>
          <li><Link to='/settings'>Settings</Link></li>
        </ul>

        <hr />

        <React.Suspense fallback={<Loading />}>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/topics'>
            <Topics />
          </Route>
          <Route path='/settings'>
            <Settings />
          </Route>
        </React.Suspense>
      </div>
    </Router>
  )
}
💻 Play with the code.

How do we know this is actually working and code splitting our routes? If you were to run npm run build with an app created by Create React App, you’d see our app’s being split into 3 chunks.

react router code splitting in action

Each chunk is each dynamic import() in our app.

Remember earlier when we talked about how there were two main ways to go about code splitting your app? We had this handy little guide.

Split at the route level. 🙂
Split at the component level. 😃
So far we’ve only covered splitting at the route level. This is where a lot of people stop. Code splitting at the route level only is like brushing your teeth but never flossing. Your teeth will be mostly clean, but you’ll still get cavities.

Instead of thinking about code splitting as splitting your app up by its routes, you should think of it as splitting your app up by its components (<Route>s are just components, after all). If you have a rich text editor that lives in a modal, splitting by the route only will still load the editor even if the modal is never opened.

At this point, it’s more of a paradigm shift that needs to happen in your brain rather than any new knowledge. You already know how to dynamically import modules with import(), now you just need to figure out which components in your app you can hold off downloading until your user needs them.