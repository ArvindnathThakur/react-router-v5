import * as React from "react"
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom"

const submit = () => {
  // fake AF
  return new Promise(res => {
    setTimeout(() => res(), 500)
  })
}

function Results() {
  return <h1>Mmmm. Thanks for submitting your favorite food.</h1>
}

function Form() {
  const history = useHistory()

  const [name, setName] = React.useState("")
  const [food, setFood] = React.useState("")

  const handleChange = e => {
    const { name, value } = e.target

    name === "name" ? setName(value) : setFood(value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    submit(name, food).then(() => history.push("/results"))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your name
        <input type="text" value={name} onChange={handleChange} name="name" />
      </label>
      <label>
        Favorite Food
        <input type="text" value={food} onChange={handleChange} name="food" />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}

export default function App() {
  return (
    <Router>
      <Route exact path="/">
        <Form />
      </Route>
      <Route path="/results">
        <Results />
      </Route>
    </Router>
  )
}
