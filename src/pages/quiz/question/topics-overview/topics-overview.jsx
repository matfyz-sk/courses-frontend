/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, Button } from 'reactstrap'

// import api from '../../../../api';
import SideNav from '../../../../side-nav.tsx'
import TopicPreview from './topic-preview/topic-preview'

class TopicsOverview extends Component {
  state = {
    topicCollapse: [],
  }

  toggle = index => e => {
    e.preventDefault()
    const { topicCollapse } = this.state
    const updatedTopicCollapse = topicCollapse
    updatedTopicCollapse[index] = !updatedTopicCollapse[index]
    this.setState({ topicCollapse: updatedTopicCollapse })
  }

  // getQuestionGroups = () => {
  //   const { isAdmin } = this.state;
  //   fetch(api.quiz.fetchQuestionGroups(), {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       token: isAdmin
  //         ? 'http://www.semanticweb.org/semanticweb#Teacher'
  //         : 'http://www.semanticweb.org/semanticweb#Adam',
  //       // TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
  //     }),
  //   }).then(response => {
  //     if (response.ok) {
  //       response
  //         .json()
  //         .then(data => {
  //           this.setState({
  //             topics: data,
  //             topicCollapse: new Array(data.length).fill(false),
  //           });
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //   });
  // };

  render() {
    const { topicCollapse } = this.state
    const { topics, isAdmin } = this.props
    return (
      <>
        <SideNav />
        <h1>Questions by topic</h1>
        <div>
          {topics &&
            topics.map((topic, index) => {
              const { name, assignment, questions } = topic
              const id = topic['@id']
              return (
                <Card tag="article" key={id}>
                  <TopicPreview
                    id={id}
                    name={name}
                    assignment={assignment}
                    // questions={questions}
                    isTeacher={isAdmin} // TODO eventually change for isTeacher?
                    toggle={this.toggle(index)}
                    collapse={topicCollapse[index]}
                  />
                </Card>
              )
            })}
          {isAdmin ? ( // TODO eventually change for isTeacher?
            <Button color="success" tag={Link} to="/quiz/createTopic">
              <h2 className="h5">+ Create topic</h2>
            </Button>
          ) : null}
        </div>
      </>
    )
  }
}

TopicsOverview.propTypes = {
  topics: PropTypes.any,
  isAdmin: PropTypes.bool,
}

TopicsOverview.defaultProps = {
  topics: [],
  isAdmin: false,
}

export default TopicsOverview
