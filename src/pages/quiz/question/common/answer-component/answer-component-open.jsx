import React, { useState } from 'react'
import { Input } from 'reactstrap'
import { TextField, Typography } from '@material-ui/core'

const enText = {
  regexpLabel: 'Regular expression',
}

function AnswerComponentOpen({
                               setRegexp,
                               regexp,
                               userAnswer,
                               setUserAnswer,
                               finalAnswer,
                             }) {

  const [testRegExp, setTestRegExp] = useState("")

  function openAnswerVariant() {
    if (setRegexp) {
      const regex = RegExp(regexp)
      return (
        <div>
          <Input
            type="text"
            value={regexp}
            placeholder = "Regular expression"
            onChange={e => setRegexp(e.target.value)}
            style={{marginBottom: 20}}
          />
          <Input
            type="text"
            value={testRegExp}
            placeholder = "Test regular expression"
            onChange={e => setTestRegExp(e.target.value)}
            valid={testRegExp !== '' && regex.test(testRegExp)}
            invalid={testRegExp !== '' && !regex.test(testRegExp)}
          />
        </div>
      )
    }
    if (setUserAnswer && !finalAnswer) {
      return (
        <div>
          <TextField
            fullWidth
            variant='outlined'
            size='small'
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
          />
        </div>
      )
    }
    if (finalAnswer) {
      return (
        <Typography variant='subtitle1' style={{maxWidth: '100%'}}>{userAnswer}</Typography>
      )
    }
    return(
      <div style={{ whiteSpace: 'pre-line' }}>{regexp}</div>
    )
  }

  return (
    <div>
      {setRegexp && <legend>Answer</legend>}
      { openAnswerVariant() }
    </div>
  )
}

//
// export class AnswerComponentOpen extends Component {
//   setRegexp = event => {
//     const { setRegexp } = this.props
//     setRegexp(event.target.value)
//   }
//
//   setRegexpUserAnswer = event => {
//     const { setRegexpUserAnswer } = this.props
//     setRegexpUserAnswer(event.target.value)
//   }
//
//   setUserAnswer = event => {
//     const { setUserAnswer } = this.props
//     setUserAnswer(event.target.value)
//   }
//
//   render() {
//     const {
//       setRegexp,
//       regexp,
//       setRegexpUserAnswer,
//       regexpUserAnswer,
//       setUserAnswer,
//       userAnswer,
//       placeholder,
//       quiz,
//     } = this.props
//     const regex = RegExp(regexp)
//     return (
//       <div>
//         {setUserAnswer ?
//           <TextField
//             fullWidth
//             variant='outlined'
//             size='small'
//             value={userAnswer}
//             onChange={e => setUserAnswer(e.target.value)}
//           />
//           :
//       <fieldset>
//         {!setUserAnswer && <legend>Regex</legend>}
//         {setRegexp && (
//           <div className="mb-3">
//             <Label for="title">{enText.regexpLabel}</Label>
//             <Input
//               type="text"
//               placeholder={placeholder}
//               value={regexp}
//               onChange={setRegexp && this.setRegexp}
//             />
//           </div>
//         )}
//         {!setRegexp && <div style={{ whiteSpace: 'pre-line' }}>{regexp}</div>}
//         {/*{setRegexpUserAnswer && (*/}
//         {/*  <div>*/}
//         {/*    <Input*/}
//         {/*      type="text"*/}
//         {/*      placeholder={placeholder}*/}
//         {/*      value={regexpUserAnswer}*/}
//         {/*      onChange={setRegexpUserAnswer && this.setRegexpUserAnswer}*/}
//         {/*      valid={regexpUserAnswer !== '' && regex.test(regexpUserAnswer)}*/}
//         {/*      invalid={regexpUserAnswer !== '' && !regex.test(regexpUserAnswer)}*/}
//         {/*    />*/}
//         {/*  </div>*/}
//         {/*)}*/}
//         {userAnswer && (
//           <Input
//             type="text"
//             placeholder={placeholder}
//             value={userAnswer}
//             onChange={setUserAnswer && this.setUserAnswer}
//           />
//         )}
//       </fieldset>
//           }
//       </div>
//     )
//   }
// }

export default AnswerComponentOpen
