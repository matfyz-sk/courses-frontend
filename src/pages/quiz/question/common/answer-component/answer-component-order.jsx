import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { DragDropContext } from 'react-beautiful-dnd'
import AnswerOrderColumn from './answer-order-components/answer-order-column'
import { ListItem, ListItemText } from '@material-ui/core'


export function AnswerComponentOrder({
                                       orderAnswers,
                                       orderAnswersColumn,
                                       addNewOrderAnswer,
                                       setShowWarning,
                                       setOrderAnswersColumn,
                                       userAnswer,
                                       setUserAnswer,
                                       finalAnswer,
                                     }) {


  const [ orderAnswerCol, setOrderAnswerCol ] = useState(userAnswer && {
    id: "answerColumn",
    title: "answerColumn",
    answersPositions: userAnswer.map(uA => uA.orderingAnswer)
  })

  const onDragEnd = result => {
    const {destination, source, draggableId} = result;
    if(!destination) return
    if(destination.index === source.index) return

    if(userAnswer) {
      const newAnswersPos = orderAnswerCol.answersPositions
      newAnswersPos.splice(source.index, 1)
      newAnswersPos.splice(destination.index, 0, userAnswer[source.index].orderingAnswer)
      const newColumnData = {
        ...orderAnswerCol,
        answersPositions: newAnswersPos,
      }
      setOrderAnswerCol(newColumnData)
      const newUserAnswer = userAnswer.map(answer => {
        return {
          ...answer,
          userChoice: newAnswersPos.indexOf(answer.orderingAnswer)
        }
      })
      setUserAnswer(newUserAnswer)
    } else {
      setShowWarning(prevState => {
        return ({...prevState, answers: ''})
      })
      const newAnswersPos = orderAnswersColumn.answersPositions
      newAnswersPos.splice(source.index, 1)
      newAnswersPos.splice(destination.index, 0, parseInt(draggableId))
      const newColumnData = {
        ...orderAnswersColumn,
        answersPositions: newAnswersPos,
      }
      setOrderAnswersColumn(newColumnData)
    }
  }

  function orderComponentVariant() {
    if(addNewOrderAnswer) {
      const answersMapped = orderAnswersColumn.answersPositions.map(answerPos => orderAnswers.find(ans => ans.position === answerPos))
      return (
        <DragDropContext onDragEnd={ onDragEnd }>
          <AnswerOrderColumn
            orderAnswerColumn={ orderAnswersColumn }
            orderAnswers={ answersMapped }
          />
          { addNewOrderAnswer &&
            (<Button className="mt-3" color="success" onClick={ addNewOrderAnswer }>
              Add answer
            </Button>) }
        </DragDropContext>
      )
    }
    if(setUserAnswer && !finalAnswer) {
      const answersSorted = userAnswer.sort((a, b) => {
        return a.userChoice - b.userChoice
      })
      return (
        <DragDropContext onDragEnd={ onDragEnd }>
          <AnswerOrderColumn
            orderAnswerColumn={ orderAnswerCol }
            orderAnswers={ answersSorted }
            userAnswer={ userAnswer }
          />
        </DragDropContext>
      )
    }
    const answersSorted = !finalAnswer ?
      orderAnswers.sort((a, b) => {
        return a.position - b.position
      })
      :
      userAnswer.sort((a, b) => {
        return a.userChoice - b.userChoice
      })
    return (
      answersSorted.map(answer => {
        return (
          <ListItem
            className='mb-2'
            key={ finalAnswer ? answer.orderingAnswer : answer.id }
            style={ {
              backgroundColor: '#ffffff',
              border: `1px solid #d9d9d9`,
              justifyContent: 'center',
            } }
          >
            <ListItemText
              primary={ answer.text }
            />
          </ListItem>
        )
      })
    )
  }


  return (
    <div>
      { orderComponentVariant() }
    </div>
  )
}


export default AnswerComponentOrder
