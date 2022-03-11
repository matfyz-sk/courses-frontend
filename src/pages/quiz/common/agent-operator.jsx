/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, Label, Table, } from 'reactstrap'

class AgentOperator extends Component {
  state = {
    agent: '',
  }

  componentDidUpdate(prevProps, prevState) {
    const {allAgents} = this.props
    if(allAgents !== prevProps.allAgents) {
      this.setState({
        agent:
          allAgents && allAgents.length && allAgents.length > 0
            ? allAgents[0].id
            : '',
      })
    }
  }

  deleteAgent = selectedAgentUri => {
    const {selectedAgents, setSelectedAgents} = this.props
    const currentSelectedAgents = [ ...selectedAgents ]
    let deletedAgentUri = ''
    const index = currentSelectedAgents.indexOf(selectedAgentUri)
    if(index !== -1) {
      currentSelectedAgents.splice(index, 1)
      deletedAgentUri = selectedAgentUri
    }
    this.setState({
      agent: deletedAgentUri,
    })
    setSelectedAgents(currentSelectedAgents)
  }

  selectAgent = () => {
    const {allAgents, selectedAgents, setSelectedAgents} = this.props
    const {agent} = this.state
    const currentSelectedAgents = [ ...selectedAgents ]
    let selectFind = false
    let nextAgent = agent
    allAgents.forEach(agentFromAllAgents => {
      if(agentFromAllAgents.id === agent) {
        currentSelectedAgents.push(agent)
        selectFind = !selectFind
      }
    })
    let isEmpty = true
    if(selectFind) {
      allAgents.forEach(agentFromAllAgents => {
        if(currentSelectedAgents.indexOf(agentFromAllAgents.id) === -1) {
          isEmpty = false
          nextAgent = agentFromAllAgents.id
        }
      })
    }
    if(isEmpty) {
      nextAgent = ''
    }
    this.setState({
      agent: nextAgent,
    })
    setSelectedAgents(currentSelectedAgents)
  }

  handleChange = e => {
    const {name} = e.target
    const {value} = e.target
    this.setState({
      [name]: value,
    })
  }

  render() {
    const {agent} = this.state
    const {allAgents, selectedAgents} = this.props
    return (
      <>
        <FormGroup>
          <Label for="agent">Assign to</Label>
          <InputGroup>
            <Input
              type="select"
              name="agent"
              id="agent"
              value={ agent || '' }
              onChange={ this.handleChange }
            >
              { allAgents.map(agentFromAllAgents => {
                return selectedAgents.indexOf(agentFromAllAgents.id) === -1 ? (
                  <option
                    key={ agentFromAllAgents.id }
                    value={ agentFromAllAgents.id }
                  >
                    { agentFromAllAgents.name }
                  </option>
                ) : null
              }) }
            </Input>
            <InputGroupAddon addonType="append">
              <Button color="success" onClick={ this.selectAgent }>
                Add
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="agents">Assign to</Label>
          <Table>
            <thead>
            <tr>
              <th>Username</th>
              <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            { allAgents.map(agentFromAllAgents => {
              return selectedAgents.indexOf(agentFromAllAgents.id) !== -1 ? (
                <tr key={ agentFromAllAgents.id }>
                  <td>{ agentFromAllAgents.name }</td>
                  <td>
                    <Button
                      color="danger"
                      onClick={ () => this.deleteAgent(agentFromAllAgents.id) }
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ) : null
            }) }
            </tbody>
          </Table>
        </FormGroup>
      </>
    )
  }
}

export default AgentOperator
