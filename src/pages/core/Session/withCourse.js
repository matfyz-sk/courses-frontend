import { CourseContext } from './context';
import React from "react";

const withCourse = Component => {
    class WithCourse extends React.Component {
        constructor(props) {
            super(props);

            this.setCourse = course => {
                this.setState({
                    course: course,
                });
            };

            this.state = {
                course: null,
                setCourse: this.setCourse,
            };
        }

        render() {
            return (
                <CourseContext.Provider value={this.state}>
                    <Component {...this.props}/>,
                </CourseContext.Provider>
            );
        }
    }
    return WithCourse;
};

export default withCourse;