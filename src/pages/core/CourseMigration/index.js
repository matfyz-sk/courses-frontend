import React from "react";
import {NavigationCourse} from "../../../components/Navigation";
import {Card, CardHeader, Container} from "reactstrap";

class CourseMigration extends React.Component {
    render() {
        return (
            <React.Fragment>
                <NavigationCourse/>
                <Container>
                    <Card>
                        <CardHeader className="event-card-header">Course Migration</CardHeader>
                        ...
                    </Card>
                </Container>
            </React.Fragment>
        )
    }
}

export default CourseMigration;