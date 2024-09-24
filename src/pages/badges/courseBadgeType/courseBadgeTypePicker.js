import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { Container, Alert, Form, FormGroup, Label, Input, Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import BadgeTypeCard from "../BadgeType/badgeTypeCard"
import CourseBadgeTypeCard from "./courseBadgeTypeCard"
import { useGetAllBadgeTypesQuery, 
         useCreateCourseBadgeTypeMutation, 
         useGetCourseBadgeTypesQuery,
         useUpdateCourseInstanceMutation,
         useRefreshCacheMutation, } from "services/badge"
import { useScheduleJobMutation, } from "services/job"
import { useGetUserQuery } from "services/user"
import { BlockPicker } from 'react-color'

const BadgeTypePicker = (props) => {

    const { courseInstanceReducer } = props
    const { courseInstance } = courseInstanceReducer
    const courseInstanceId = !courseInstance ? "" : courseInstance._id
    const { data: badgeTypes, isLoading: isLoadingBadgeTypes, isError: isErrorBadgeTypes } = useGetAllBadgeTypesQuery()
    const { data: students } = useGetUserQuery({studentOfId: courseInstanceId}, {skip: !courseInstance})
    const { data: courseBadgeTypes, isLoading: isLoadingCourseBadgeTypes, isError: isErrorCourseBadgeTypes } = useGetCourseBadgeTypesQuery({id: courseInstanceId}, {skip: !courseInstance})
    const [createCourseBadgeType,] = useCreateCourseBadgeTypeMutation()
    const [updateCourseInstance] = useUpdateCourseInstanceMutation()
    const [scheduleBadge] = useScheduleJobMutation()
    const [refreshCache] = useRefreshCacheMutation()

    const compare = (a, b) => {
        if (a.enabledUntil < b.enabledUntil)
          return -1
        if (a.enabledUntil > b.enabledUntil)
          return 1
        if (a._id < b._id)
            return -1
        if (a._id > b._id)
          return 1
    }

    let courseBadgeTypesSorted = []
    if (courseBadgeTypes)
        courseBadgeTypesSorted = [...courseBadgeTypes].sort(compare)

    const [types, setTypes] = useState([])
    const [form, setForm] = useState({
        additional: "",
        canAwardStudent: false,
        canAwardInstructor: false,
        awardableTo: "course",
        enabled: false,
        enabledUntil: new Date(),
        enabledFrom: new Date(),
        color: "#00BCD4",
    })
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107"]

    const clearForm = () => {
        setForm({
            additional: "",
            canAwardStudent: false,
            canAwardInstructor: false,
            awardableTo: "course",
            enabled: false,
            enabledUntil: new Date(),
            enabledFrom: new Date(),
            color: "#00BCD4",
        })
        setTypes([])
    }

    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => {
        setIsOpen(!isOpen)
        clearForm()
    }
    
    const addBadgeTypeToCourse = (id) => {
        const bTypes = []
        if (courseBadgeTypesSorted) courseBadgeTypesSorted.forEach(item => bTypes.push(item._id))
        bTypes.push(id)

        updateCourseInstance({
            id: courseInstanceId,
            body: {hasBadgeType: bTypes}
        }).unwrap().then(response => {
            console.log("RESPONSE: " + JSON.stringify(response))
          }).catch(e => {
            console.log(e)
          })
        clearForm()
    }

    const refreshScheduled = (time) => {
        setTimeout(() => {
            refreshCache()
        }, time - Date.now())
    }

    const addBadgeType = () => {
        console.log(types)
        if (types) types.forEach((item) => {
            createCourseBadgeType({instance: courseInstanceId, type: item, body: {...form, enabled: form.enabledFrom < Date.now() && Date.now() < form.enabledUntil}})
            .unwrap().then(id => {
                addBadgeTypeToCourse(id)
                let users = []
                if (form.canAwardInstructor)
                    users = users.concat(courseInstance.hasInstructor.map(u => u._id))
                if (form.canAwardStudent && students)
                    users = users.concat(students.map(s => s._id))
                scheduleBadge({instance: courseInstance, id: id, badgeId: item, enableDate: form.enabledFrom, disableDate: form.enabledUntil, users: users, awardableTo: form.awardableTo, additional: form.additional, color: form.color})
                refreshScheduled(form.enabledFrom)
                refreshScheduled(form.enabledUntil)
            })
            .catch(error => {
                console.error("Error occurred:", error)
            })
        })
        clearForm()
        setIsOpen(!isOpen)
    }

    return (
        <>
        <Container style={{marginBottom: '5rem'}}>
            <h2 className="mb-4">Badge types</h2>
        <Button color="primary" size="sm" onClick={toggle} style={{ marginBottom: '1rem' }}>
            Add Badge Type
        </Button>

        <h4>Enabled</h4>
        <Row>
            {(isLoadingBadgeTypes || isLoadingCourseBadgeTypes) ? <div><Alert color="info">Loading...</Alert></div> :
            (isErrorBadgeTypes || isErrorCourseBadgeTypes) ? <div><Alert color="danger">An error has occurred.</Alert></div> :
            (badgeTypes && courseBadgeTypesSorted) ? courseBadgeTypesSorted.filter(item => item.enabled).length === 0 ? <div><Alert color="info">No badge types enabled.</Alert></div> :
            courseBadgeTypesSorted.map((item) => item.enabled ? <CourseBadgeTypeCard item={item} /> : <></>) :
            <div><Alert color="info">No badge types added.</Alert></div>}
        </Row>
        <hr />
        <h4>Disabled</h4>
        <Row>
            {(isLoadingBadgeTypes || isLoadingCourseBadgeTypes) ? <div><Alert color="info">Loading...</Alert></div> :
            (isErrorBadgeTypes || isErrorCourseBadgeTypes) ? <div><Alert color="danger">An error has occurred.</Alert></div> :
            (badgeTypes && courseBadgeTypesSorted) ? courseBadgeTypesSorted.filter(item => !item.enabled).length === 0 ? <div><Alert color="info">No badge types disabled.</Alert></div> :
            courseBadgeTypesSorted.map((item) => !item.enabled ? <CourseBadgeTypeCard item={item} /> : <></>) :
            <div><Alert color="info">No badge types added.</Alert></div>}
        </Row>

        <Modal isOpen={ isOpen } toggle={ toggle }>
            <ModalHeader>
                Add Badge Type
            </ModalHeader>
            <ModalBody>
                <Form>
                    <Label for="types">Badge Types</Label>
                    <FormGroup>
                            {(badgeTypes === undefined) ? <div><Alert color="info">No badge types created.</Alert></div> :
                            <Row>
                                {badgeTypes.map((item) => 
                                <FormGroup check inline>
                                    <Input type="checkbox" 
                                        id={item._id} 
                                        style={{display: 'none'}}
                                        onChange={ e => {
                                            setTypes(e.target.checked ? [...types, item._id] : types.filter(id => id !== item._id))
                                        }} />
                                    <Label check for={item._id}>
                                    <BadgeTypeCard item={item} func="pick" />
                                    </Label>
                                </FormGroup>
                                )}
                            </Row>
                            }
                    </FormGroup>
                    <hr />
                    <Label for="color">Background Color</Label>
                    <FormGroup>
                        <BlockPicker 
                            color={form.color} 
                            triangle="hide" 
                            width="100%"
                            onChange={c => {
                                setForm({...form, color: c.hex})
                            }}
                            colors={colors}
                        />
                    </FormGroup>
                    <hr />
                    <FormGroup>
                        <Label for="additional">
                            Additional description
                        </Label>
                        <Input
                            id="additional"
                            name="text"
                            type="textarea"
                            onChange={ e => {
                                setForm({...form, additional: e.target.value})
                            }}
                        />
                    </FormGroup>
                    <hr />
                    <FormGroup>
                        <Row>
                            <Col>
                                <Label for="award">Awarded by</Label><br />
                                <FormGroup check>
                                    <Input type="checkbox" id='student'
                                    onChange={ e => {
                                        setForm({...form, canAwardStudent: e.target.checked})
                                    }}/>
                                    <Label check for='student' style={{fontWeight: 'normal'}}>
                                    Student
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Input type="checkbox" id='instructor'
                                    onChange={ e => {
                                        setForm({...form, canAwardInstructor: e.target.checked})
                                    }}/>
                                    <Label check for='instructor' style={{fontWeight: 'normal'}}>
                                    Instructor
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Label>Awarded to</Label>
                                <FormGroup check>
                                    <Input name='radio1' type='radio' id='r1' defaultChecked 
                                        onChange={e => {
                                            setForm({...form, awardableTo: e.target.checked ? 'course' : 'team'})
                                        }}/>
                                        <Label check for='r1' style={{fontWeight: 'normal'}}>Course attendee</Label><br />
                                    <Input name='radio1' type='radio' id='r2' 
                                        onChange={e => {
                                            setForm({...form, awardableTo: e.target.checked ? 'team' : 'course'})
                                        }}/>
                                        <Label check for='r2' style={{fontWeight: 'normal'}}>Team member</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                    <hr />
                    <FormGroup>
                        <Row>
                            <Col>
                                <Label for="award">Enabled from</Label>
                                <DatePicker 
                                    selected={form.enabledFrom} 
                                    onChange={date => setForm({...form, enabledFrom: date})} 
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                />
                            </Col>
                            <Col>
                                <Label for="award">Enabled until</Label>
                                <DatePicker 
                                    selected={form.enabledUntil} 
                                    onChange={date => setForm({...form, enabledUntil: date})}  
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                />
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={addBadgeType}>Add</Button>
            </ModalFooter>
        </Modal>
        </Container>
        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(BadgeTypePicker))