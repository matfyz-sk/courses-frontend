import React, { Component } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Badge
} from "reactstrap";

export class AnswerComponent extends Component {
  constructor(props) {
    super(props);
    const checkboxValue =
      this.props.userChoice !== undefined
        ? this.props.userChoice
        : this.props.correct !== undefined
        ? this.props.correct
        : false;
    this.state = {
      checkboxValue: checkboxValue
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.correct !== prevProps.correct) {
      const checkboxValue =
        this.props.userChoice !== undefined
          ? this.props.userChoice
          : this.props.correct !== undefined
          ? this.props.correct
          : false;
      this.setState({
        checkboxValue: checkboxValue
      });
    }
  }
  render() {
    return (
      <div className="inline">
        <Badge
          color={
            this.props.userChoice !== undefined &&
            this.props.correct !== undefined &&
            this.props.showAll === true
              ? this.props.userChoice === this.props.correct
                ? "success"
                : "danger"
              : "none"
          }
        >
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Input
                  addon
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                  name={this.props.checkboxName}
                  checked={this.state.checkboxValue}
                  onChange={this.props.onChange}
                  readOnly={!this.props.isCheckboxEnabled}
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name={this.props.name}
              placeholder={this.props.placeholder}
              value={this.props.value}
              onChange={this.props.onChange}
              valid={this.props.valid}
              disabled={!this.props.isTextEnabled}
            />
          </InputGroup>
        </Badge>
      </div>
    );
  }
}

export default AnswerComponent;
