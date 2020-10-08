When you’re building for the web, sometimes you need to pass information via the URL. To do this, you can use a query string.

You’ve probably seen them before IRL. Here’s an example from Twitter’s analytics page.

React Router v5 Query Strings

This URL has three route parameters and two query strings. Twitter is using query strings to tell its route to filter the Tweets by top (most popular) and that the origin was im (which I’m not sure what that means, TBH).

With that said, odds are you’re not here to learn what query strings are but instead how to use them with React Router v5. The good news is that if you’re already comfortable with React Router v5, there are just a few small details you need to know.

Let’s say we were Twitter and we were building the Route for the URL above. It would probably look something like this.

const { path } = useRouteMatch()

return (
  <Route path={`${path}/tweets`}>
    <Tweets />
  </Route>
)
Notice at this point there’s nothing new. We don’t account for the query string when we create the Route. Instead, we parse them inside the component that is being rendered when that path matches - in this case, Tweets.

Now the question becomes, how do we actually do this?

As of React Router v5.1, React Router comes with a custom useLocation Hook. useLocation returns a location object which has a search property whose value is the query string.

const { search } = useLocation()
console.log(search) // "?filter=top&origin=im"
Cool, but this is the literal query string. You’ll need to somehow parse it before you can get the actual values.

You may be surprised to hear that React Router v5 doesn’t come with built-in support for parsing query strings. The reason for this is because, over the years, there have been many requests to support different implementations. With that, the team decided it would be best for users to decide what the implementation looks like rather than baking in a “one size fits all” solution. Regardless, what that means is that you’ll need to bring your own query-string parser.

There are two common solutions. Either use a browser API (that may not be supported by all the browsers you need) or use an external library for parsing the query string. The library I typically use is the query-string library on NPM.

With that library installed, all we need to do is call queryString.parse, passing it location.search. That will parse the query string into an object which we can then grab the values off of.

import queryString from 'query-string'
import { useLocation } from 'react-router-dom'

...

const { search } = useLocation()
const values = queryString.parse(search)
console.log(values.filter) // "top"
console.log(values.origin) // "im"
That’s it. Go parse those query strings.