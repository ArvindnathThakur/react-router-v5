React Router v5 uses a declarative, component-based approach to routing. What that means is when you want to create a new route, you render a Route component. Route allows you to map URL paths to different React components. For example, say we wanted to render the Dashboard component whenever a user navigates to the /dashboard path. To do that, we’d render a Route that looks like this.

<Route path='/dashboard'>
  <Dashboard />
</Route>
Now, what if we also wanted to pass the Dashboard component a prop? In previous versions of React Router (v4), this was non-trivial since React Router was in charge of creating the element. You’d have to use the Routes render prop. However, with React Router v5, since you’re in charge of creating the element, you’d pass a prop just like you normally would.

<Route path='/dashboard'>
  <Dashboard authed={true}/>
</Route>