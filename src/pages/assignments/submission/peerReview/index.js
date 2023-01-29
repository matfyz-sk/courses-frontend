import React, { useState, useEffect } from 'react'
import { Label, Alert, Button, FormGroup, Input } from 'reactstrap'
import { connect } from 'react-redux'
import Questionare from './questionare'
import Answers from './answers'
import {
  getShortID,
  periodHappening,
  periodHasEnded,
  periodStarted,
  timestampToString,
  htmlFixNewLines,
  prepareMultiline,
  getStudentName,
  getRandomRolor,
  datesComparator,
} from 'helperFunctions'
import {
  useGetCommentOfSubmissionCreatedByQuery,
  useGetCommentOfSubmissionQuery,
  useGetPeerReviewQuestionQuery,
  useGetPeerReviewForTeamHasAnswerQuery,
  useGetPeerReviewOfUserHasAnswerQuery,
  useGetPeerReviewAnswersOfSubmissionQuery,
  useAddCommentMutation,
  useAddPeerReviewQuestionAnswerMutation,
  useUpdatePeerReviewQuestionAnswerMutation,
  useAddPeerReviewMutation,
  useUpdatePeerReviewMutation,
} from 'services/assignments'
import { useGetTeamQuery } from 'services/team'
import { useGetUserQuery } from 'services/user'


function PeerReview(props) {
  const commentCreatorsVisible = getCommentCreatorsVisible(props)
  const submissionID = getSubmissionID(props)
  const [questions, setQuestions] = useState([])
  const [questionsLoaded, setQuestionsLoaded] = useState(false)

  const [answers, setAnswers] = useState([])
  const [answersLoaded, setAnswersLoaded] = useState(false)

  const [myReview, setMyReview] = useState(null)
  const [myReviewLoaded, setMyReviewLoaded] = useState(false)

  const [questionare, setQuestionare] = useState([1, 2])
  const [questionareLoaded, setQuestionareLoaded] = useState(false)

  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [generalComments, setGeneralComments] = useState([])
  const [messageColors, setMessageColors] = useState([])
  const [newGeneralComment, setNewGeneralComment] = useState('')
  const [newGeneralCommentParent, setNewGeneralCommentParent] = useState(null)
  const [generalCommentSaving, setGeneralCommentSaving] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [addComment, addCommentResult] = useAddCommentMutation()
  const [addPeerReview, addPeerReviewResult] = useAddPeerReviewMutation()
  const [updatePeerReview, updatePeerReviewResult] = useUpdatePeerReviewMutation()
  const [addPeerReviewQuestionAnswer, addPeerReviewQuestionAnswerResult] = useAddPeerReviewQuestionAnswerMutation()
  const [updatePeerReviewQuestionAnswer, updatePeerReviewQuestionAnswerResult] = useUpdatePeerReviewQuestionAnswerMutation()

  useEffect(() => {
    fetchComments()
    if (periodHappening(props.assignment.peerReviewPeriod) 
        && props.settings.peerReview) {
      //student hodnoti niekoho
      fetchQuestions()
      fetchMyReview()
    } else if ((props.settings.myAssignment || props.settings.isInstructor) 
        && periodHasEnded(props.assignment.peerReviewPeriod)) {
      //instruktor alebo niekto pozera vysledky
      fetchQuestions()
      fetchAnswers()
    }
  }, [])

  useEffect(() => {
    if (!props.settings.isInstructor 
        && !props.settings.myAssignment) {
      loadForm()
    }
  }, [questions, questionsLoaded])

  useEffect(() => {
    loadForm()
  }, [myReview, myReviewLoaded])

  const fetchComments = () => {
    const initialSubmission = props.initialSubmission
    if (initialSubmission === null) {
      return
    }
    const {data, isSuccess} = getFetchCommentsRequest(commentCreatorsVisible, initialSubmission['@id'])
    if (isSuccess && data) {
      let allComments = data.filter(comment => !comment['@type'].endsWith('CodeComment'))
      let newMessageColors = [...messageColors]
      allComments = allComments
        .sort((comment1, comment2) =>
          datesComparator(comment1.createdAt, comment2.createdAt)
        )
        .map(comment => {
          if (
            !newMessageColors.some(color => color.id === comment.createdBy['@id'])
          ) {
            newMessageColors.push({
              id: comment.createdBy['@id'],
              hex: getRandomRolor(),
              name: `Anonymous ${newMessageColors.length + 1}`,
            })
          }
          return {
            ...comment,
            color: newMessageColors.find(
              color => color.id === comment.createdBy['@id']
            ),
          }
        })
      let childComments = allComments.filter(
        comment => comment.ofComment.length !== 0
      )
      const parentComments = allComments
        .filter(comment => comment.ofComment.length === 0)
        .map(comment => ({
          ...comment,
          childComments: childComments
            .filter(
              subcomment => subcomment.ofComment[0]['@id'] === comment['@id']
            )
            .reverse(),
        }))
      setGeneralComments(parentComments)
      setCommentsLoaded(true)
      setMessageColors(newMessageColors)
    }
  }

  const fetchQuestions = () => {
    const peerReviewQuestions = []
    props.assignment.reviewsQuestion.forEach(question => {
      const {data, isSuccess} = useGetPeerReviewQuestionQuery(getShortID(question['@id']))
      if (isSuccess && data) {
        peerReviewQuestions.push(data[0])
      }
    })
    setQuestions(peerReviewQuestions)
    setQuestionsLoaded(true)
  }
  
  const fetchMyReview = () => {
    if (submissionID === null 
      || props.toReview === null 
      || (props.assignment.reviewedByTeam 
          && !props.teams.some(team => team['@id'] === props.toReview.team[0]['@id']))) {
      return
    }
    const {data, isSuccess} = getFetchMyReviewRequest(props, submissionID)
    if (isSuccess && data) {
      setMyReview(data.length === 0 ? null : data[0])
      setMyReviewLoaded(true)
    }
  }

  const loadForm = () => {
    if (!questionsLoaded || !myReviewLoaded) {
      return
    }
    let questionare = questions.map(question => ({
      //load default values
      question,
      id: question['@id'],
      rated: question.rated,
      exists: false,
      score: 0,
      answer: '',
    }))

    if (myReview !== null) {
      myReview.hasQuestionAnswer.forEach(answer => {
        let index = questionare.findIndex(
          question => answer.question === question.id
        )
        if (index !== -1) {
          questionare[index] = {
            ...questionare[index],
            exists: true,
            score: answer.score,
            answer: answer.answer,
            answerID: answer['@id'],
          }
        }
      })
    }
    setQuestionare(questionare)
    setQuestionareLoaded(true)
  }
  
  const fetchAnswers = () => {
    if (submissionID === null) {
      return
    }
    const {data, isSuccess} = useGetPeerReviewAnswersOfSubmissionQuery(getShortID(submissionID))
    if (isSuccess && data) {
      let reviews = data
      if (props.settings.isInstructor 
          || props.assignment.reviewsVisibility === 'open') {
        if (props.assignment.reviewedByTeam) {
          //get team
          const teams = []
          reviews.forEach(review => {
            const {
              data: getTeamData, 
              isSuccess: getTeamIsSuccess
            } = useGetTeamQuery(getShortID(review.reviewedByTeam[0]['@id']))
            if (getTeamIsSuccess && getTeamData) {
              teams.push(getTeamData[0])
            }
          })
          reviews = assignTeamToReview(reviews, teams)
          processReviews(reviews)
        } else {
          //get user
          const users = []
          reviews.forEach(review => {
            const {
              data: getUserData, 
              isSuccess: getUserIsSuccess
            } = useGetUserQuery(getShortID(review.reviewedByStudent[0]['@id']))
            if (getUserIsSuccess && getUserData) {
              users.push(getUserData[0])
            }
          })
          reviews = assignStudentToReview(reviews, students)
          processReviews(reviews)
        }
      } else {
        processReviews(reviews)
      }
    }
  }

  const processReviews = (reviews) => {
    const answers = reviews
      .map(review => {
        return review.hasQuestionAnswer.map(answer => ({
          ...answer,
          review,
        }))
      })
      .reduce((acc, value) => {
        return acc.concat(value)
      }, [])
    setAnswers(answers)
    setAnswersLoaded(true)
  }

  const getQuestionAnswers = () => {
    const qAndA = questions.map(question => {
      return {
        ...question,
        answers: answers
          .filter(answer => answer.question === question['@id'])
          .sort((answer1, answer2) =>
            answer1.createdAt > answer2.createdAt ? -1 : 1
          ),
      }
    })
    return qAndA
  }

  // "http://www.courses.matfyz.sk/data/peerReviewQuestion/vctpc"
  // 'http://www.courses.matfyz.sk/data/peerReviewQuestion/vctpc' answer[0].question

  const addGeneralComment = () => {
    if (props.initialSubmission === null) {
      return
    }
    setGeneralCommentSaving(true)
    const newComment = {
      commentText: prepareMultiline(newGeneralComment),
      ofSubmission: props.initialSubmission['@id'],
      _type: 'comment',
    }
    if (newGeneralCommentParent !== null) {
      newComment.ofComment = newGeneralCommentParent['@id']
    }
    addComment(newComment).unwrap().then(response => {
      setGeneralCommentSaving(false)
      setNewGeneralComment('')
      setNewGeneralCommentParent(null)
      fetchComments()
    }).catch(error => {
      setGeneralCommentSaving(false)
      console.log(error)
    })
  }

  const submit = () => {
    if (submissionID === null) {
      return
    }
    setSaving(true)
    let existingReviews = questionare.filter(review => review.exists)
    let newReviews = questionare.filter(review => !review.exists)

    existingReviews.forEach(review =>
      updatePeerReviewQuestionAnswer({
        id: getShortID(review.answerID),
        patch: {
          score: review.score,
          answer: review.answer,
        }
      }).unwrap()
    )
    const newIDs = []
    newReviews.forEach(review =>
      addPeerReviewQuestionAnswer({
        score: review.score,
        answer: review.answer,
        question: review.question['@id'],
      }).unwrap().then(response => {
        newIDs.push(response.data.resource.iri)
      })
    )
    
    if (myReview !== null) {
      if (newIDs.length === 0) {
        setSaving(false)
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
        }, 3000)
      }

      updatePeerReview({
        id: getShortID(myReview['@id']),
        patch: {
          hasQuestionAnswer: [
            ...existingReviews.map(review => review.answerID),
            ...newIDs,
          ],
        }
      }).unwrap().then(response => {
        setSaving(false)
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
        }, 3000)
        fetchMyReview()
      })
    } else {
      let newPeerReview = {
        hasQuestionAnswer: newIDs,
        ofSubmission: submissionID,
      }
      if (props.assignment.reviewedByTeam) {
        newPeerReview.reviewedByTeam = props.toReview.team[0]['@id']
      } else {
        newPeerReview.reviewedByStudent =
          props.toReview.student[0]['@id']
      }
      addPeerReview(newPeerReview).unwrap().then(response => {
        setSaving(false)
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
        }, 3000)
        fetchMyReview()
      })
    }
  }

  /*
  /courses/DZFAI/assignments/assignment/938uy/review/team/dvyaa/oHHUJ/reviews
  ziskaj otazky
  ziskaj odpovede s otazkami
  ziskaj MOJE odpovede - ak sa deje review potrebne

  zobraz formular
  zobraz odpovede

  open - napis info o teame alebo osobe, ALEBO INSTRUKTOR inak nepis nic
  */
  if (!periodStarted(props.assignment.teamReviewPeriod)) {
    return (
      <Alert color="danger" className="mt-3">
        Peer review hasn't started yet!
      </Alert>
    )
  }

  if (!periodHasEnded(props.assignment.peerReviewPeriod) 
    && props.settings.isInstructor) {
    return (
      <Alert color="danger" className="mt-3">
        Peer review hasn't ended yet!
      </Alert>
    )
  }

  if (submissionID === null && props.settings.peerReview) {
    return (
      <Alert color="danger" className="mt-3">
        You can't review this submission, there's none
      </Alert>
    )
  }

  if (submissionID === null 
    && !props.settings.isInstructor 
    && props.settings.myAssignment) {
    return (
      <Alert color="danger" className="mt-3">
        You can't get review if you haven't submitted anything!
      </Alert>
    )
  }

  if (submissionID === null && props.settings.isInstructor) {
    return (
      <Alert color="danger" className="mt-3">
        There is no submission, so there are no reviews to view!
      </Alert>
    )
  }

  const loading =
    (props.settings.peerReview &&
      periodHappening(props.assignment.peerReviewPeriod) &&
      !questionareLoaded) ||
    ((props.settings.myAssignment || props.settings.isInstructor) &&
      periodHasEnded(props.assignment.peerReviewPeriod) &&
      (!questionsLoaded || !answersLoaded))
  if (loading) {
    return (
      <Alert color="primary" className="mt-3">
        Loading peer reviews...
      </Alert>
    )
  }

  return (
    <div>
      <Alert style={{ marginTop: '20px' }} isOpen={saved}>
        Submission was saved successfully.
      </Alert>
      {periodHappening(props.assignment.peerReviewPeriod) &&
        props.settings.peerReview && (
          <Questionare
            questionare={questionare}
            onChange={e => setQuestionare(e)}
            saving={saving}
            submit={submit}
          />
        )}
      {}
      {(props.settings.myAssignment ||
        props.settings.isInstructor) &&
        periodHasEnded(props.assignment.peerReviewPeriod) && (
          <Answers
            questionsWithAnswers={getQuestionAnswers()}
            nameVisible={
              props.assignment.reviewsVisibility === 'open' ||
              props.settings.isInstructor
            }
          />
        )}

      <h3>
        <Label className="bold">General comments</Label>
      </h3>
      {generalComments.length === 0 && (
        <div style={{ fontStyle: 'italic' }}>
          There are currently no comments!
        </div>
      )}
      {generalComments.map(genComment => (
        <div key={genComment['@id']}>
          <Label className="flex row">
            Commented by
            <span
              style={{
                fontWeight: 'bolder',
                color: genComment.color.hex,
                marginLeft: '0.5rem',
              }}
            >{`${getCommentBy(genComment, commentCreatorsVisible)}`}</span>
            <div className="text-muted ml-auto">
              {timestampToString(genComment.createdAt)}
            </div>
          </Label>
          <div className="text-muted">
            <div
              dangerouslySetInnerHTML={{
                __html: htmlFixNewLines(genComment.commentText),
              }}
            />
          </div>
          <div style={{ padding: '5px 10px' }}>
            {genComment.childComments.map(childComment => (
              <div key={childComment['@id']}>
                <hr style={{ margin: 0 }} />
                <Label className="flex row">
                  Commented by
                  <span
                    style={{
                      fontWeight: 'bolder',
                      color: childComment.color.hex,
                      marginLeft: '0.5rem',
                    }}
                  >{`${getCommentBy(childComment, commentCreatorsVisible)}`}</span>
                  <div className="text-muted ml-auto">
                    {timestampToString(childComment.createdAt)}
                  </div>
                </Label>
                <div className="text-muted">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: htmlFixNewLines(childComment.commentText),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            color="link"
            onClick={() =>
              setNewGeneralCommentParent(genComment)
            }
          >
            <i className="fa fa-reply" /> Reply
          </Button>
          <hr />
        </div>
      ))}
      <FormGroup>
        <Label htmlFor="addCodeComment" style={{ fontWeight: 'bold' }}>
          New comment
        </Label>
        <Input
          id="addCodeComment"
          type="textarea"
          value={newGeneralComment}
          onChange={e => setNewGeneralComment(e.target.value)}
        />
      </FormGroup>
      {newGeneralCommentParent && (
        <span>
          Commenting on{' '}
          {newGeneralCommentParent.commentText.substring(0, 10)}...
          <Button
            color="link"
            className="ml-auto"
            onClick={() => setNewGeneralComment(null)}
          >
            <i className="fa fa-times" />
          </Button>
        </span>
      )}
      <Button
        color="primary"
        disabled={
          generalCommentSaving ||
          newGeneralComment.length === 0
        }
        onClick={addGeneralComment}
      >
        Add comment
      </Button>
    </div>
  )
}

const getCommentCreatorsVisible = (props) => {
  return props.assignment.reviewsVisibility === 'open' 
    || props.settings.isInstructor
}

const getSubmissionID = (props) => {
  if (props.initialSubmission !== null) {
    return props.initialSubmission['@id']
  }
  return null
}

const getFetchCommentsRequest = (commentCreatorsVisible, id) => {
  if (commentCreatorsVisible) {
    return useGetCommentOfSubmissionCreatedByQuery(getShortID(id))
  }
  return useGetCommentOfSubmissionQuery(getShortID(id))
}

const getFetchMyReviewRequest = (props, submissionID) => {
  if (this.props.assignment.reviewedByTeam) {
    return useGetPeerReviewForTeamHasAnswerQuery({
      teamId: getShortID(props.toReview.team[0]['@id']),
      id: getShortID(submissionID)
    })
  }
  return useGetPeerReviewOfUserHasAnswerQuery({
    id: getShortID(props.toReview.student[0]['@id']),
    subId: getShortID(submissionID)
  })
}

const getCommentBy = (comment, commentCreatorsVisible) => {
  if (commentCreatorsVisible) {
    return getStudentName(comment.createdBy)
  }
  return comment.color.name
}

const assignTeamToReview = (reviews, teams) => {
  return reviews.map(review => ({
    ...review,
    team: teams.find(team => team['@id'] === review.reviewedByTeam[0]['@id']),
  }))
}

const assignStudentToReview = (reviews, students) => {
  return reviews.map(review => ({
    ...review,
    student: students.find(
      student => student['@id'] === review.reviewedByStudent[0]['@id']
    ),
  }))
}

const mapStateToProps = ({ authReducer, assignStudentDataReducer }) => {
  const { user } = authReducer
  const { teams } = assignStudentDataReducer
  return {
    user,
    teams,
  }
}

export default connect(mapStateToProps, {})(PeerReview)
