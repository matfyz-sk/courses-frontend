/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Label, FormGroup, Input, Form, Button } from 'reactstrap'
import { getTopics, postTopic } from '../../../redux/actions'

class NewTopic extends Component {
  state = {
    topicName: '',
  }

  formSubmit = () => {
    const { postTopicConnect, token } = this.props
    const { topicName } = this.state
    const topic = {
      name: topicName,
    }
    postTopicConnect(topic, token)
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
  }

  changeHandler = e => {
    const { name } = e.target
    const { value } = e.target
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { topicName } = this.state
    const { isTeacher } = this.props
    return (
      <>
        {isTeacher ? (
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
        ) : (
          <div>Not authorized.</div>
          //   TODO add private route
        )}
      </>
    )
  }
}

NewTopic.propTypes = {
  postTopicConnect: PropTypes.any,
}

NewTopic.defaultProps = {
  postTopicConnect: null,
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {
  postTopicConnect: postTopic,
})(NewTopic)
