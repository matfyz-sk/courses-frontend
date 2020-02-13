import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, Collapse } from 'reactstrap';

export default class PrivacySettings extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            privacy: true,
            publish: true,
            classmates: false,
            profile_detail: true,
            co_workers: true,
            dont_care: false,
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        const {privacy, publish, classmates, profile_detail, co_workers, dont_care} = this.state;
        return (
            <React.Fragment>
                <Row className={"mt-5"}>
                    <Col sm={6} xs={12}>
                        <Form>
                            <Collapse isOpen={privacy}>
                                <h3>Privacy settings</h3>
                                <p>Your profile will be partially or completely private. It's up to you.</p>
                                <FormGroup>
                                    <Label for="surname">My nickname is</Label>
                                    <Input type="text" name="surname" id="surname" placeholder="Hide my name" value={"abcd111"} />
                                </FormGroup>
                                <h4>Privacy exceptions</h4>
                                <p>I am okay with:</p>
                                <FormGroup check>
                                    <Input type="checkbox" name="publish" id="publish" onChange={this.handleInputChange} checked={publish}/>
                                    <Label for="publish" check>Publishing specific information on home page with my real name</Label>
                                </FormGroup>
                                <Collapse isOpen={publish}>
                                    <FormGroup check>
                                        <Input type="checkbox" name="check" id="exampleCheck"/>
                                        <Label for="exampleCheck" check>My badges can be published</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input type="checkbox" name="check" id="exampleCheck"/>
                                        <Label for="exampleCheck" check>I can publish my active courses</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input type="checkbox" name="check" id="exampleCheck"/>
                                        <Label for="exampleCheck" check>I can publish my passed courses, because i don't care anymore.</Label>
                                    </FormGroup>
                                </Collapse>
                                <Collapse isOpen={!dont_care}>
                                    <FormGroup check>
                                        <Input type="checkbox" name="classmates" id="classmates" onChange={this.handleInputChange} checked={classmates}/>
                                        <Label for="classmates" check>My classmates can see something more</Label>
                                    </FormGroup>
                                    <Collapse isOpen={classmates}>
                                        <FormGroup check>
                                            <Input type="checkbox" name="profile_detail" id="profile_detail" onChange={this.handleInputChange} checked={profile_detail}/>
                                            <Label for="profile_detail" check>Classmates can click to my profile detail</Label>
                                        </FormGroup>
                                        <Collapse isOpen={profile_detail}>
                                            <FormGroup check>
                                                <Input type="checkbox" name="check" id="exampleCheck"/>
                                                <Label for="exampleCheck" check>My badges are public for my classmates</Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="checkbox" name="check" id="exampleCheck"/>
                                                <Label for="exampleCheck" check>My list of courses is public for classmates</Label>
                                            </FormGroup>
                                        </Collapse>
                                    </Collapse>
                                    <FormGroup check>
                                        <Input type="checkbox" name="co_workers" id="co_workers" onChange={this.handleInputChange} checked={co_workers}/>
                                        <Label for="co_workers" check>Okay, but my course co-workers can see something more. Maybe.</Label>
                                    </FormGroup>
                                    <Collapse isOpen={co_workers}>
                                        <FormGroup check>
                                            <Input type="checkbox" name="check" id="exampleCheck"/>
                                            <Label for="exampleCheck" check>They can see my real name.</Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input type="checkbox" name="check" id="exampleCheck"/>
                                            <Label for="exampleCheck" check>They can see my course evaluation.</Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input type="checkbox" name="check" id="exampleCheck"/>
                                            <Label for="exampleCheck" check>They can see my profile detail with all information.</Label>
                                        </FormGroup>
                                    </Collapse>
                                </Collapse>
                                <hr/>
                                <FormGroup check>
                                    <Input type="checkbox" name="dont_care" id="dont_care" onChange={this.handleInputChange} checked={dont_care}/>
                                    <Label for="dont_care" check><b>I don'care this settings. Just show them only what they show me!</b></Label>
                                </FormGroup>
                            </Collapse>
                        </Form>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}