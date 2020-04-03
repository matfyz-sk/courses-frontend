/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Label, FormGroup, Input, Form, Button } from 'reactstrap';
import { getTopics, postTopic } from '../../../redux/actions';

class NewTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicName: '',
    };
  }

  componentDidMount() {
    const { getTopicsConnect } = this.props;
    getTopicsConnect();
  }

  formSubmit = () => {
    const { postTopicConnect } = this.props;
    const { topicName } = this.state;
    const topic = {
      name: topicName,
    };
    postTopicConnect(topic);
    // .then(
    //   response => {
    //     this.props.history.push("/quiz/questionGroups");
    //   }
    // error => {
    //   if (error.statusCode === 401) {
    //     return <Redirect to="/login" />;
    //   }
    // }
    // );
  };

  changeHandler = e => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { topicName } = this.state;
    return (
      <Form>
        <FormGroup>
          <Label for="name">Topic name</Label>
          <Input
            type="textarea"
            name="topicName"
            id="topicName"
            value={topicName}
            onChange={this.changeHandler}
          />
        </FormGroup>
        <Button color="success" onClick={this.formSubmit}>
          Create topic
        </Button>
      </Form>
    );
  }
}

NewTopic.propTypes = {
  getTopicsConnect: PropTypes.any,
  postTopicConnect: PropTypes.any,
};

NewTopic.defaultProps = {
  getTopicsConnect: null,
  postTopicConnect: null,
};

const mapStateToProps = ({ userReducer, topicsReducer }) => {
  const { topics, topicsLoaded } = topicsReducer;
  const { isAdmin } = userReducer;
  return {
    isAdmin,
    topics,
    topicsLoaded,
  };
};

export default connect(mapStateToProps, {
  getTopicsConnect: getTopics,
  postTopicConnect: postTopic,
})(NewTopic);
