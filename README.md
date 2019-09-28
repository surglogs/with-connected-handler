# withConnectedHandler

[![Build Status](https://travis-ci.org/surglogs/with-connected-handler.svg?branch=master)](https://travis-ci.org/surglogs/with-connected-handler)

withConnectedHandler is a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html) that allows you to easily create a handler function you can use for submitting a form, reacting to input change or handling any kind of event. It has a similar API as [`withHandlers`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers) HOC from [`recompose`](https://github.com/acdlite/recompose). The added benefit of our HOC is that you can directly connect all the actions and state props from [`redux`](https://redux.js.org/) that you need in your handler.

## Instalation

`npm i @surglogs/with-connected-handler recompose react-redux`

## What is this library good for?

### Todo list example

Let's say we have a todo list form. When the user clicks on save button, we want to update the todo list. We will call API endpoint that updates the todos and use it's response to update our redux state.

We will assume we already have `TodoListForm` component, `updateTodos` action and a working `api`.

We can create a basic form handler like this:

```js
import withConnectedHandler from '@surglogs/with-connected-handler'

import { updateTodos } from '../actions'
import TodoListForm from './TodoListForm'
import api from '../api'

const TodoListFormWithHandler = withConnectedHandler({
  name: 'handleFormSubmit'
  actions: { updateTodos },
  handler: ({ updateTodos }) => async (newTodos) => {
    const response = await api.postTodos(newTodos)

    // dispatch updateTodos action
    updateTodos(response)
  }
})(TodoListForm)

// Alternatively, we can dispatch the action direcly using dispatch prop:

// const TodoListFormWithHandler = withConnectedHandler({
//   name: 'handleFormSubmit'
//   handler: ({ dispatch }) => async (newTodos) => {
//     const response = await api.postTodos(newTodos)

//     // dispatch updateTodos action
//     dispatch(updateTodos(response))
//   }
// })(TodoListForm)

export default FormWithHandler
```

Great! This is a good start. What if we need to use any props coming to `TodoListFormWithHandler` component or Redux state? It is pretty easy!

Let's say we need to send the category of our todo list to the API. The `category` prop is passed to `TodoListFormWithHandler` like this:

```js
<TodoListFormWithHandler category="Books to read" />
```

We also want to update the color of our todo list. Let's assume that the new color of our todo list is stored in the Redux state as prop `todoListColor`.

Our code will look like this:

```js
import withConnectedHandler from '@surglogs/with-connected-handler'

import { updateTodos } from '../actions'
import TodoListForm from './TodoListForm'
import api from '../api'

const TodoListFormWithHandler = withConnectedHandler({
  name: 'handleFormSubmit'
  actions: { updateTodos },
  args: {
    category: 'category', // picks a 'category' prop coming to TodoListFormWithHandler
    // category: (_, props) => props.category // this also works
    todoListColor: (state, props) => state.todoListColor // get todoListColor from redux state
  }
  handler: ({ updateTodos, category, todoListColor }) => async (newTodos) => {
    const response = await api.postTodos(newTodos, category, todoListColor)

    // dispatch updateTodos action
    updateTodos(response)
  }
})(TodoListForm)

export default FormWithHandler
```

## When to use it?

`withConnectedHandler` HOC is best suited for handling form submits, input changes or any kinds of events. The only limitation is that you have to be using [`Redux`](https://redux.js.org/) state management tool in your app for `withConnectedHandler` to work.
