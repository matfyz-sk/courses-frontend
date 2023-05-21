import React from 'react'
import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  Button,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import * as ROUTES from '../../../constants/routes'
import './Courses.css'
import EnrollModal from '../EnrollModal'
import { getIcon } from '../Helper'
import arrow from '../../../images/arrow.svg'
import DeleteCourseModal from '../DeleteCourseModal'
import { redirect } from '../../../constants/redirect'

const CoursesList = ({
    coursesList,
    enroll,
    myCourses,
    isAdmin,
    user,
    tab,
  }) => (
    <ListGroup>
      {coursesList.length === 0 && (
        <ListGroupItem className="course-container">
          There are no courses in this section.
        </ListGroupItem>
      )}
      {coursesList.map(course => (
        <ListGroupItem className="course-container" key={course.id}>
          {/* teacher and student only one instance */}
          {course.courses &&
          course.courses.length === 1 &&
          !course.admin &&
          !isAdmin ? (
            <div className="single-course-container">
              {myCourses || isAdmin ? (
                <NavLinkCourse
                  course={course}
                  to={ROUTES.TIMELINE}
                  id={course.courses[0].id}
                />
              ) : (
                <NavLinkCourse
                  course={course}
                  to={ROUTES.INFO_PAGE}
                  id={course.courses[0].id}
                />
              )}
  
              <div className="courses-right-top-corner-container">
                <RoleIcon course={course.courses[0]} />
                {enroll != null &&
                  (!course.courses[0].requests ? (
                    <EnrollModal
                      user={user}
                      course={course}
                      courseInstance={course.courses[0]}
                    />
                  ) : (
                    <span className="requested">Requested</span>
                  ))}
              </div>
            </div>
          ) : (
            <>
              <div className="multiple-course-container">
                <div>
                  {user && (course.admin || user.isSuperAdmin) ? (
                    <NavLinkCourse
                      course={course}
                      to={ROUTES.COURSE_ID}
                      id={course.id}
                    />
                  ) : (
                    <>
                      <span className="course-name">{course.name}</span>
                      <br />
                      <span className="about">{course.desc}</span>
                    </>
                  )}
                  {/*<span className="name">{course.name}</span>*/}
                  {/*<br />*/}
                  {/*<span className="about">{course.desc}</span>*/}
                </div>
                <div className="courses-right-top-corner-container">
                  {course.admin === true && getIcon('Admin')}
                  {(isAdmin || course.admin) && (
                    <div className="edit-delete-buttons-container">
                      <NavLink
                        className="edit-delete-buttons"
                        to={redirect(ROUTES.EDIT_COURSE_ID, [
                          { key: 'course_id', value: course.id },
                        ])}
                      >
                        <span className="edit-delete-buttons">Edit</span>
                      </NavLink>
                      {/*<DeleteCourseModal*/}
                      {/*  course={course}*/}
                      {/*  courseInstance={null}*/}
                      {/*  type="course"*/}
                      {/*  small=""*/}
                      {/*/>*/}
                    </div>
                  )}
                </div>
              </div>
              <CollapsableCourse
                course={course}
                enroll={enroll}
                myCourses={myCourses}
                isAdmin={isAdmin}
                user={user}
                className="collapsable-container"
                tab={tab}
              />
            </>
          )}
        </ListGroupItem>
      ))}
    </ListGroup>
)

const NavLinkCourse = ({ course, to, id }) => (
    <>
      <NavLink to={redirect(to, [{ key: 'course_id', value: id }])}>
        <span className="course-name">{course.name}</span>
        <br />
        <span className="course-desc">{course.desc}</span>
      </NavLink>
    </>
)

const CollapsableCourse = ({
    course,
    enroll,
    myCourses,
    isAdmin,
    user,
    tab,
  }) => (
    <div>
      <div className="arrow-container">
        <img
          src={arrow}
          alt="arrow"
          className="collapse-arrow"
          id={`toggler${course.id}${tab}`}
          width="15px"
        />
      </div>
      <UncontrolledCollapse toggler={`#toggler${course.id}${tab}`}>
        <Card className="course-instances-card">
          <CardBody className="course-instances-card-body">
            {course.courses.length > 0 ? (
              course.courses
                .sort((a, b) => (a.year > b.year ? 1 : -1))
                .map(courseInstance => (
                  <ListGroup key={courseInstance.id}>
                    <ListGroupItem className="single-course-container instance-container">
                      {myCourses || isAdmin ? (
                        <NavLinkCourseInstance
                          course={course}
                          courseInstance={courseInstance}
                          to={ROUTES.TIMELINE}
                        />
                      ) : (
                        <NavLinkCourseInstance
                          course={course}
                          courseInstance={courseInstance}
                          to={''}
                        />
                      )}
  
                      <div className="courses-right-top-corner-container">
                        {enroll != null &&
                          (!courseInstance.requests ? (
                            <EnrollModal
                              user={user}
                              course={course}
                              courseInstance={course.courses[0]}
                            />
                          ) : (
                            <span className="requested">Requested</span>
                          ))}
                        <RoleIcon course={courseInstance} />
                        {/* edit/delete course */}
                        {(isAdmin ||
                          course.admin ||
                          courseInstance.instructor) && (
                          <div className="edit-delete-buttons-instance">
                            <NavLink
                              className="edit-delete-buttons"
                              to={redirect(ROUTES.EDIT_EVENT_ID, [
                                { key: 'event_id', value: courseInstance.id },
                                { key: 'course_id', value: course.courses[0].id },
                              ])}
                            >
                              <span className="edit-delete-buttons">Edit</span>
                            </NavLink>
                            <DeleteCourseModal
                              course={course}
                              courseInstance={courseInstance}
                              type="courseInstance"
                              small="small-delete-button"
                            />
                            {/*<NavLink*/}
                            {/*  className="edit-delete-buttons"*/}
                            {/*  to={`/deleteevent/${courseInstance.id}`}*/}
                            {/*>*/}
                            {/*  <span className="edit-delete-buttons">Delete</span>*/}
                            {/*</NavLink>*/}
                          </div>
                        )}
                      </div>
                    </ListGroupItem>
                  </ListGroup>
                ))
            ) : (
              <div className="single-course-container instance-container">
                No Course Instance for this course.
                <NavLink
                  className="edit-delete-buttons"
                  to={redirect(ROUTES.NEW_COURSE_INSTANCE, [
                    { key: 'course_id', value: course.id },
                  ])}
                >
                  <Button className="new-event-button">Create New</Button>
                </NavLink>
              </div>
            )}
          </CardBody>
        </Card>
      </UncontrolledCollapse>
    </div>
)

const NavLinkCourseInstance = ({ course, courseInstance, to }) => (
    <>
      <NavLink
        to={redirect(to, [{ key: 'course_id', value: courseInstance.id }])}
        className="instance-container-name"
      >
        <span>{course.name}</span>&nbsp;
        <b>{new Date(courseInstance.startDate?.millis).getFullYear()}</b>
      </NavLink>
    </>
)



const RoleIcon = ({ course }) => (
    <div>
        {course.enrolled && getIcon('Student')}
        {course.instructor && getIcon('Teacher')}
        {course.admin && getIcon('Admin')}
    </div>
)

export { CoursesList }