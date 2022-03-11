import React from 'react'
import { getShortID } from '../../../../../../helperFunctions'
import { Box, Button, ThemeProvider, Typography } from '@material-ui/core'
import { customTheme } from '../../../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import { formatDateTime } from '../../../../common/functions/common-functions'

function QuizTakeTable({
                         match,
                         history,
                         userId,
                         quizAssignment
                       }) {

  const goToReviewForStudent = () => {
    history.push({
      pathname: `/courses/${ match.params.courseId }/quiz/quizResult/${ getShortID(quizAssignment.quizTake['@id']) }`,
      state: {
        quizAssignment: quizAssignment
      }
    })
  }

  return (
    <ThemeProvider theme={ customTheme }>
      <Box marginBottom={ 4 } width='100%'>
        { quizAssignment.quizTake ?
          <Box width='100%'>
            <Box display='flex' width='100%'>
              <Box width='85%' display='flex' padding={ 1 } minHeight='55px' paddingLeft={ 2 }>
                <Box display='flex' alignItems='center' width='40%' marginRight={ 2 }>
                  <Typography style={ {fontSize: 19} }>Submitted</Typography>
                </Box>
                <Box display='flex' alignItems='center' width='40%' marginRight={ 2 }>
                  <Typography style={ {fontSize: 19} }>Reviewed</Typography>
                </Box>
                <Box display='flex' alignItems='center' width='20%' marginRight={ 2 }>
                  <Typography style={ {fontSize: 19} }>Score</Typography>
                </Box>
              </Box>
              <Box display='flex' width='15%' padding={ 0 }/>
            </Box>
            <Box display='flex' width='100%'>
              <Box width='85%' display='flex' padding={ 1 } border={ `1px solid ${ grey[300] }` }
                   minHeight='55px' paddingLeft={ 2 }>
                <Box display='flex' alignItems='center' width='40%' marginRight={ 2 }>
                  <Typography>{ formatDateTime(quizAssignment.quizTake.createdAt) }</Typography>
                </Box>
                <Box display='flex' alignItems='center' width='40%' marginRight={ 2 }>
                  { quizAssignment.quizTake.publishedReview &&
                    <Typography>{ formatDateTime(quizAssignment.quizTake.reviewedDate) }</Typography> }
                </Box>
                <Box display='flex' alignItems='center' width='20%' marginRight={ 2 }>
                  { quizAssignment.quizTake.publishedReview &&
                    <Typography>{ quizAssignment.quizTake.score } %</Typography> }
                </Box>
              </Box>
              <Box display='flex' width='15%' padding={ 0 }>
                <Button
                  variant='outlined'
                  color='primary'
                  fullWidth
                  disabled={ !quizAssignment.quizTake.publishedReview }
                  style={ {margin: 0, borderRadius: 0, boxShadow: 0, height: '100%'} }
                  onClick={ e => goToReviewForStudent() }
                >
                  View review
                </Button>
              </Box>
            </Box>
          </Box>
          :
          <Box>
            {/*<Typography style><em>Quiz not taken yet</em></Typography>*/ }
          </Box>
        }
      </Box>
    </ThemeProvider>
  )
}

export default QuizTakeTable


// import { Link } from 'react-router-dom'
// import { CardSubtitle, NavLink, Table } from 'reactstrap'
//
// class QuizTakeTable extends Component {
//   render() {
//     const {
//       headerText,
//       authorHeader,
//       scoreHeader,
//       questions,
//       link
//     } = this.props;
//     return (
//       <React.Fragment>
//         <CardSubtitle tag={"h5"} className={"mb-1"}>
//           {headerText}
//         </CardSubtitle>
//         <Table hover striped size="sm">
//           <thead>
//             <tr>
//               {authorHeader ? <th className={"h6"}>{authorHeader}</th> : null}
//               {scoreHeader ? <th className={"h6"}>{scoreHeader}</th> : null}
//             </tr>
//           </thead>
//           <tbody>
//             {questions
//               ? questions.map(question => {
//                   return (
//                     <tr key={question.id}>
//                       <td>
//                         <NavLink
//                           tag={Link}
//                           to={link + encodeURIComponent(question.id)}
//                           color="primary"
//                         >
//                           {question.author.name}
//                         </NavLink>
//                       </td>
//                       <td>
//                         <NavLink
//                           tag={Link}
//                           to={link + encodeURIComponent(question.id)}
//                           color="primary"
//                         >
//                           {question.totalScore}
//                         </NavLink>
//                       </td>
//                     </tr>
//                   );
//                 })
//               : null}
//           </tbody>
//         </Table>
//       </React.Fragment>
//     );
//   }
// }
//
// export default QuizTakeTable;
