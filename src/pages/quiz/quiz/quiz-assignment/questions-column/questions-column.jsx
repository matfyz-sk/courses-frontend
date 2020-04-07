import React from "react";
import QuestionRow from "./question-row/question-row";
import { ListGroup } from "reactstrap";
import { Droppable } from "react-beautiful-dnd";
const style = {
  minHeight: "100px"
};
export default class QuestionsColumn extends React.Component {
  render() {
    const { column, questions } = this.props;
    return (
      <React.Fragment>
        <h3>{column.title}</h3>
        <Droppable droppableId={column.id}>
          {provided => (
            <div
              style={style}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ListGroup>
                {questions.map((question, index) => {
                  return (
                    <QuestionRow
                      question={question}
                      index={index}
                      key={index}
                    />
                  );
                })}
                {provided.placeholder}
              </ListGroup>
            </div>
          )}
        </Droppable>
      </React.Fragment>
    );
  }
}
