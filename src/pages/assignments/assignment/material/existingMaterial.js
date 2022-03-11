import React, { Component } from 'react';
import { Alert, Button, InputGroup, InputGroupAddon, InputGroupText, Table } from 'reactstrap';

export default class AddMaterial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
    }
  }

  render() {
    let selectedMaterialsIDs = this.props.selectedMaterials.map((material) => material['@id']);
    return (
      <div className="scrollable">
        <Alert color="info" className="small-alert">
          Only new materials that were assigned to the assignment will be saved!
        </Alert>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText><i className="fa fa-search flip"/></InputGroupText>
          </InputGroupAddon>
          <input
            type="text"
            className="form-control search-text"
            value={ this.state.filter }
            onChange={ (e) => this.setState({filter: e.target.value}) }
            placeholder="Search"
          />
        </InputGroup>
        <Table>
          <thead>
          <tr>
            <th>Name</th>
            <th width="100">URL</th>
            <th width="75">Is new</th>
            <th width="20"></th>
          </tr>
          </thead>
          <tbody>
          {
            this.props.allMaterials.filter(
              (material) =>
                !selectedMaterialsIDs.includes(material['@id']) &&
                ((material.URL && material.URL.toLowerCase().includes(this.state.filter.toLowerCase())) || material.name.toLowerCase().includes(this.state.filter.toLowerCase()))
            ).map((material) =>
              <tr key={ material['@id'] }>
                <td>{ material.name }</td>
                <td><a href={ material.URL } target="_blank" without="true" rel="noopener noreferrer">
                  { material.URL && (material.URL.substring(0, 50) + (material.URL.length > 50 ? '...' : '')) }
                </a></td>
                <td style={ {textAlign: 'center'} }>{ material.new ? <i className="fa fa-check green-color"/> :
                  <i className="fa fa-times light-red-color"/> }</td>
                <td>
                  <Button outline size="sm" color="success" className="center-ver"
                          onClick={ () => this.props.addMaterial(material) }>
                    Add
                  </Button>
                </td>
              </tr>
            )
          }
          </tbody>
        </Table>
        <Button outline size="sm" className="m-2" color="secondary" onClick={ this.props.closePopover }>
          Close
        </Button>
      </div>
    )
  }
}
