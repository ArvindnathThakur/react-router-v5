If you’re reading this, you’ve probably discovered that React Router v5 doesn’t come with a built-in solution for animated transitions. That ties into React Router’s philosophy - it gives you routing primitives that you can build on and trusts you can figure out the rest. Because every app has different needs, this approach is typically the safest. The downside of this is that it’ll take some extra work to get the exact functionality you want. The tool we’ll be using alongside React Router in this post is “React Transition Group”. React Transition Group is an animation library that gives us a way to perform animations when a React component enters or leaves the DOM. Paired with React Router, it’s the perfect tool to animate route transitions.

First, let’s walk through the type of app we’re going to be building to demonstrate animated route transitions.

If you’re not familiar with URL Parameters, read URL Parameters with React Router v5 before continuing.

Animations aside, the goal is to make it so the user can navigate between URLs with the following patterns, /hsl/:h/:s/:l and /rgb/:r/:g/:b.

If you’re familiar with HSL and RGB codes, those should look familiar. When the user navigates to a path that matches /hsl/:h/:s/:l, the background will animate to an HSL color with the corresponding hue (:h), saturation (:s), and lightness (:l). Similar, when the user navigates a path that matches /rgb/:r/:g/:b, the background will animate to an RGB color with the corresponding red (:r), green (:g), and blue (:b) values.

Final App Preview

Because you’re here to learn about animated transitions with React Router v5 and not how to set up a basic React app, I’ll give you the starter code upfront. Don’t continue before you have a solid understanding of how it works. It’s the final app without the animated transitions.

💻 Starter Code.

For animating our transitions, the first thing we need to do is take a look into how React Transition Group works. Like React Router, it has a component-based API. The two components we’ll be using from it are TransitionGroup and CSSTransition.

First, let’s look at TransitionGroup. The way you use TransitionGroup is as a wrapper component.

<TransitionGroup>
  {/* stuff */}
</TransitionGroup>
Defined, it’s a “state machine for managing the mounting and unmounting of components over time”. In practice, the first thing it does is it keeps track of all of its children (props.children) inside of its local state. Then, whenever its props change and its getDerivedStateFromProps is called, it loops over the next children and figures out which are new (entering), which have been deleted (exiting), and which children have stayed the same. Once it figures that out, it clones and merges all of its children together passing to each item a few props which represent its status (exiting, entering, etc.). At this point, it updates its local state with all of the merged children (which all individually know if they’re entering, exiting, or remaining the same). That causes a re-render and the new merged children is shown to the view.

Breathe

That was a lot of words to say that TransitionGroup renders all its new and old children after passing certain props to each based on if they’re new, old, or the same.

You may be wondering why it renders all the old children, new children, and children that didn’t change. The reason for that is for animation purposes. For example, an “old” (exiting) child might receive an animation that takes its opacity from 1 to 0. A new (entering) child might pull a Peter Thiel and receive an animation that takes its opacity from 0 to 1. Regardless, it’s important to understand that all the children are going to be shown for a specified time.

The last important item to mention about TransitionGroup is the way in which it keeps track of which children are which. If you’re familiar with React, you’re familiar with the idea of key props. When you’re mapping over an array to create a list UI, you need to give each item a unique key prop. This way, React can effectively manage that list. It’s the exact same thing with TransitionGroup's children. Each child needs its own unique key prop so TransitionGroup can more effectively figure out which children have changed (entered or exited).

I realize we’re pretty deep in the weeds here. Stick with me, you’re doing great.

Next, we have the CSSTransition component. When you render a TransitionGroup, its direct children must either be a CSSTransition component or a Transition component (both come with the library).

What CSSTransition does is it takes the information it got from TransitionGroup, specifically if certain children are entering, leaving, or staying the same, and it applies a pair of class names to them during the ‘appear’, ‘enter’, and ‘exit’ stages of the transition based on their status. What this allows you to do is, based on those class names, have CSS in your app which will select the same class names that CSSTransition is applying and add some styles to those elements. For example, if we told CSSTransition to apply a fade class, our CSS might look like this.

.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
That way we’ll adjust the opacity of an element anytime it has a class name of fade-enter (which CSSTransition will apply for us).

Alright now that we have our App set up and we understand a little bit more about React Transition Group, let’s join them.

First, we know that we have to wrap everything that’s going to be animating inside of TransitionGroup. Since we’ll be animating our Switch component, let’s wrap it in TransitionGroup.

...

import { TransitionGroup } from 'react-transition-group'

...

function Content () {
  return (
    <div className='fill content'>
      <TransitionGroup>
        <Switch>
          <Route exact path="/hsl/:h/:s/:l">
            <HSL />
          </Route>
          <Route exact path="/rgb/:r/:g/:b">
            <RGB />
          </Route>
          <Route path='*'>
            <div>Not Found</div>
          </Route>
        </Switch>
      </TransitionGroup>
    </div>
  )
}
Now as we talked about earlier, TransitionGroup only gets us part of the way there; we also need to tie in CSSTransition Just like we did with TransitionGroup, let’s wrap our Switch inside of a CSSTransition component so we can specify some properties for how Switch will be animated.

We’ll pass it two props, timeout and classNames (notice it’s plural, with an s). timeout specifies how long TransitionGroup will display all of its children before removing the old children (aka how long the animation will take place). classNames is the CSS class that is applied to the component as it enters or exits.

For example, if you provide a classNames of fade, then the following classes will be added to the component during its animation lifecycle - fade-enter, fade-enter-active, fade-exit, fade-exit-active, fade-appear, and fade-appear-active.

...

import { TransitionGroup, CSSTransition } from 'react-transition-group'

...

function Content () {
  return (
    <div className='fill content'>
      <TransitionGroup>
        <CSSTransition
          timeout={300}
          classNames='fade'
        >

          <Switch>
            <Route exact path="/hsl/:h/:s/:l">
              <HSL />
            </Route>
            <Route exact path="/rgb/:r/:g/:b">
              <RGB />
            </Route>
            <Route path='*'>
              <div>Not Found</div>
            </Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}
Now, because we’ve given it a classNames prop of fade, we need to add some CSS that will do the animation for us.

.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
💻 Play with the code.

And…! It doesn’t work. 😔

Remember earlier when we talked about how TransitionGroup keeps track of its children? Because we didn’t give CSSTransition a unique key, whenever we switch routes, TransitionGroup just assumes nothing happened since none of its children’s keys changed.

Now the question is, what should we use for a unique key? Well, what is the thing that is changing in the app? It’s the app’s location. So ideally, we would use that as the key since we know if the location changed, we’d want TransitionGroup to be aware of that and let CSSTransition know.

Now we have another problem 😣. How do we get the app’s location? We could reach out to window.location but that feels hacky and not very React like. Instead, we’ll use React Router v5’s useLocation custom Hook. That will return us a location object which has a key property we can use.

...

import { useLocation } from 'react-router-dom'

...

function Content () {
  const location = useLocation()

  return (
    <div className='fill content'>
      <TransitionGroup>
        <CSSTransition
          timeout={300}
          classNames='fade'
          key={location.key}
        >
          ...
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}
💻 Play with the code.

🙏 now we have access to a unique key value in location.key and we can pass that as a key prop to CSSTransition. And with that, we’re done!

Just kidding 😩

You’re so close! Pinky promise.

If you run the app as it currently is, you’ll notice that everything seems to be working fine. When you navigate to a new path, for 300ms (timeout), both the new CSSTransition component and the old CSSTransition component are in the DOM. You can see this perfectly in the React Dev Tools screenshot below.

Why isn't it working yet? Two CSSTransition components

Here’s what’s happening. At that exact moment of the screenshot, if you look deeper into the CSSTransition components, the first one looks like this.

Detailed css transition component

and the second looks like this

Detailed CSS transition component 2

Notice that eventually CSSTransition is rendering our Switch component, which makes sense. You’ll also notice that the images are the exact same except for the key props. This isn’t’ good and it’s the reason why it’s not working.

Take a closer look at the Switch components in the images above. Notice that both of them have the exact same location prop. We don’t want that to happen. Remember the purpose of Switch is to render the component of the first Route that matches. If the location prop is the same on both Switch components, that means that the same Route is going to match in both Switches, which means the same component is going to be rendered. This means that even if the animations are occurring, we’re not going to see them since both components being rendered are the same. What we need to do is figure out why the locations are the same and how to fix them. The goal here is to make it so when TransitionGroup renders its children, the old child has the previous location while the new child has the new location. Right now, they both just have the new location.

Whenever you render a Switch component, under the hood Switch is going to get its location from context.location. You can think of it as Router keeping track of the app’s current location and Switch always has access to it. This gives us a huge insight into the current issue we’re having. When both Switches are rendered, they’re both grabbing the location from context. By the time they render, context.location has already been updated to the new location. This means that instead of getting one Switch with the old location and one with the new location, both have the new location since both got the location from context.location. Now, how do we fix this?

When you use Switch, it can take in an optional location prop. That prop allows you to tell Switch “Hey, use this location instead of the location from context”. Exactly what we need. Since we already have access to location from earlier when we used useLocation, all we have to do is pass it so Switch.

function Content () {
  const location = useLocation()

  return (
    <div className='fill content'>
      <TransitionGroup>
        <CSSTransition
          timeout={300}
          classNames='fade'
          key={location.key}
        >
          <Switch location={location}>
            <Route exact path="/hsl/:h/:s/:l">
              <HSL />
            </Route>
            <Route exact path="/rgb/:r/:g/:b">
              <RGB />
            </Route>
            <Route path='*'>
              <div>Not Found</div>
            </Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}
💻 Play with the code.

And just like that, it works! (for real this time).

The goal of this post was to really dive into the why of animated transitions in React Router v5 and I think we’ve accomplished just that.