/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import {
  Button,
  Label,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Table,
} from 'reactstrap'

class AgentOperatorNew extends Component {
  state = {
    agent: '',
  }

  componentDidUpdate(prevProps, prevState) {
    const { agentOptions } = this.props
    if (agentOptions !== prevProps.agentOptions) {
      this.setState({
        agent:
          agentOptions && agentOptions.length && agentOptions.length > 0
            ? agentOptions[0].id
            : '',
      })
    }
  }

  deleteAgent = selectedAgentUri => {
    const { selectedAgents, deleteSelectedAgent } = this.props
    const currentSelectedAgents = [...selectedAgents]
    let deletedAgentUri = ''
    const index = currentSelectedAgents.indexOf(selectedAgentUri)
    if (index !== -1) {
      currentSelectedAgents.splice(index, 1)
      deletedAgentUri = selectedAgentUri
    }
    this.setState({
      agent: deletedAgentUri,
    })
    deleteSelectedAgent(currentSelectedAgents)
  }

  selectAgent = e => {
    const { agentOptions } = this.props
    e.preventDefault()
    const { agent } = this.state
    const selectedAgent = agentOptions.find(
      agentOption => agentOption.id === agent
    )
    if (selectedAgent) {
      selectedAgent.addSelectedAgent()
    }
  }

  handleChange = e => {
    const { name } = e.target
    const { value } = e.target
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { agent } = this.state
    const { agentOptions, selectedAgents } = this.props

    const agentsTable = selectedAgents.map(selectedAgent => {
      const { id, name, deleteSelectedAgent } = selectedAgent
      return (
        <tr key={id}>
          <td>{name}</td>
          <td>
            {deleteSelectedAgent && (
              <Button color="danger" onClick={deleteSelectedAgent}>
                X
              </Button>
            )}
          </td>
        </tr>
      )
    })

    return (
      <>
        <FormGroup>
          <Label for="agent">Assign to</Label>
          <InputGroup>
            <Input
              type="select"
              name="agent"
              id="agent"
              value={agent || ''}
              onChange={this.handleChange}
            >
              {agentOptions.map(agentOption => {
                return (
                  <option key={agentOption.id} value={agentOption.id}>
                    {agentOption.name}
                  </option>
                )
              })}
            </Input>
            <InputGroupAddon addonType="append">
              <Button color="success" onClick={this.selectAgent}>
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
            <tbody>{agentsTable}</tbody>
          </Table>
        </FormGroup>
      </>
    )
  }
}

export default AgentOperatorNew
