import React from 'react'
import { Button, CustomInput, Input, InputGroup, InputGroupAddon, InputGroupText, } from 'reactstrap'
import { FaTrashAlt } from 'react-icons/fa'
import { Checkbox, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

const enText = {
  'is-correct': 'Correct',
  delete: 'Delete',
}

export function AnswerComponentPredefined({
                                            id,
                                            text,
                                            correct,
                                            onChangeAnswerChecked,
                                            placeholder,
                                            onChangeAnswerText,
                                            deleteAnswer,
                                            userAnswer,
                                            handleUserAnswer,
                                            finalAnswer,
                                          }) {
  // const onChangeAnswerText = event => {
  //   onChangeAnswerText(event.target.value)
  // }
  //
  // const onChangeAnswerChecked = event => {
  //   onChangeAnswerChecked(e.target.checked)
  // }

  const handleThisUserAnswer = event => {
    handleUserAnswer(id, {...userAnswer, userChoice: !userAnswer.userChoice})
  }

  function predefinedAnswerVariant() {
    if(onChangeAnswerText) {
      return (
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <CustomInput
                type="checkbox"
                id={ id }
                label={ enText['is-correct'] }
                checked={ correct }
                // TODO add color #1e7e34
                onChange={ e => onChangeAnswerChecked(e.target.checked) }
              />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            placeholder={ placeholder }
            value={ text }
            onChange={ e => onChangeAnswerText(e.target.value) }
            // disabled={!this.props.isTextEnabled}
          />
          <InputGroupAddon addonType="append">
            <Button color="danger" onClick={ deleteAnswer }>
              <FaTrashAlt/>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      )
    }
    if(userAnswer && !finalAnswer) {
      return (
        <ListItem
          style={ {
            backgroundColor: '#ffffff',
            border: `1px solid #d9d9d9`,
            justifyContent: 'center',
          } }
        >
          <ListItemIcon>
            <Checkbox
              checked={ userAnswer.userChoice }
              onChange={ e => handleThisUserAnswer(e) }
              style={ {color: '#29741d', backgroundColor: 'transparent'} }
            />
          </ListItemIcon>
          <ListItemText
            primary={ text }
          />
        </ListItem>
      )
    }
    return (
      <ListItem
        style={ {
          backgroundColor: '#ffffff',
          border: `1px solid #d9d9d9`,
          justifyContent: 'center',
        } }
      >
        <ListItemIcon>
          <Checkbox
            checked={ finalAnswer ? userAnswer.userChoice : correct }
            style={ {color: '#29741d', backgroundColor: 'transparent'} }
          />
        </ListItemIcon>
        <ListItemText
          primary={ text }
        />
      </ListItem>
    )
  }

  return (
    <div className='mb-2' key={ id }>
      { predefinedAnswerVariant() }
    </div>
    // <InputGroup className="mb-2">
    //   {onChangeAnswerText ? (
    //     <>
    //       <InputGroupAddon addonType="prepend">
    //         <InputGroupText>
    //           <CustomInput
    //             type="checkbox"
    //             id={id}
    //             label={enText['is-correct']}
    //             checked={correct}
    //             // TODO add color #1e7e34
    //             onChange={e => onChangeAnswerChecked(e.target.checked)}
    //           />
    //         </InputGroupText>
    //       </InputGroupAddon>
    //       <Input
    //         type="text"
    //         placeholder={placeholder}
    //         value={text}
    //         onChange={e => onChangeAnswerText(e.target.value)}
    //         // disabled={!this.props.isTextEnabled}
    //       />
    //       <InputGroupAddon addonType="append">
    //         <Button color="danger" onClick={deleteAnswer}>
    //           <FaTrashAlt/>
    //         </Button>
    //       </InputGroupAddon>
    //     </>
    //   ) : (
    //     handleUserAnswer ?
    //       <ListItem
    //         style={{
    //           backgroundColor: '#ffffff',
    //           border: `1px solid #d9d9d9`,
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <ListItemIcon>
    //           <Checkbox
    //             checked={userAnswer.userChoice}
    //             onChange={e => handleThisUserAnswer(e)}
    //             style={{color: '#29741d', backgroundColor: 'transparent'}}
    //           />
    //         </ListItemIcon>
    //         <ListItemText
    //           primary={text}
    //         />
    //       </ListItem>
    //       :
    //       <>
    //         <ListItem
    //           style={{
    //             backgroundColor: '#ffffff',
    //             border: `1px solid #d9d9d9`,
    //             justifyContent: 'center',
    //           }}
    //         >
    //           <ListItemIcon>
    //             <Checkbox
    //               checked={correct}
    //               style={{color: '#29741d', backgroundColor: 'transparent'}}
    //             />
    //           </ListItemIcon>
    //           <ListItemText
    //             primary={text}
    //           />
    //         </ListItem>
    //       </>
    //   )}
    // </InputGroup>
  )
}

export default AnswerComponentPredefined
