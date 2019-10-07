import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { withAuthenticator } from 'aws-amplify-react'
import 'tachyons/css/tachyons.min.css'
import { API, graphqlOperation } from 'aws-amplify'
import { listTodos } from './graphql/queries'
import { createTodo, deleteTodo } from './graphql/mutations'
import NoteItem from './NoteItem'

class App extends Component {
  state = {
    value: '',
    notes: [],
    loading: false
  }

  async componentDidMount() {
    this.loadItems()
  }

  async loadItems() {
    let { data } = await API.graphql(graphqlOperation(listTodos))
    
    this.setState({
      notes: data.listTodos.items
    })
  }

  onTextChange = (e) => this.setState({ value: e.target.value })

  render() {
    return (
      <div>
        <header className='flex flex-column items-center justify-center pa3 bg-washed-red'>
          <h1 className="code f2-1">Todo application</h1>
          <form className="mb3">
            <input
              type="text"
              className="pa2 f4"
              placeholder="Write here"
              value={this.state.value}
              onChange={this.onTextChange} />
            <button
              className="pa2 f4"
              type="button"
              onClick={this.onSubmitClick}
              disabled={this.state.loading}>
              Submit
            </button>
          </form>
          <div className="fl w-50 pa2">
            <h3>Note list</h3>
            <div className="list fl w-100 pa2">
              {this.renderNotes()}
            </div>
          </div>
        </header>
      </div>
    )
  }

  renderNotes = () => {
    return this.state.notes.map(n => {
      return (
        <NoteItem
          key={n.id}
          data={n}
          onDelete={this.onDeleteClick} />
      )
    })
  }

  onSubmitClick = async () => {
    let { value } = this.state

    if (!value)
      return

    this.resetValue()
    this.setState({ loading: true })

    try {
      let params = {
        input: {
          name: value
        }
      }

      await API.graphql(graphqlOperation(createTodo, params))
      await this.loadItems()
    } catch (ex) {
      console.warn(ex)
    }

    this.setState({ loading: false })
  }

  onDeleteClick = async ({ id }) => {
    try {
      await API.graphql(graphqlOperation(deleteTodo, {
        input: { id }
      }))
      await this.loadItems()
    } catch (ex) {
      console.warn(ex)
    }
  }

  resetValue() {
    this.setState({
      value: ''
    })
  }
}

export default withAuthenticator(App, {
  includeGreetings: true
});
