import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, Collapse } from 'reactstrap';

export default class ProfileSettings extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
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
        return (
            <React.Fragment>
                <h3 className={"mb-5 mt-5"}>My profile settings</h3>
                <Row>
                    <Col sm={6} xs={12}>
                        <Form>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="name">Name *</Label>
                                        <Input type="text" name="name" id="name" placeholder="My name" value={"Patrik"} disabled />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="surname">Surname *</Label>
                                        <Input type="text" name="surname" id="surname" placeholder="My surname" value={"Hudak"} disabled />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label for="name">Email *</Label>
                                        <Input type="email" name="email" id="email" placeholder="My email" value={"mail@mail.com"} disabled />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="about_me">About me</Label>
                                <Input type="textarea" name="about_me" id="about_me" placeholder="I am ..." rows={3} />
                            </FormGroup>
                            <Button>Save</Button>
                        </Form>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}