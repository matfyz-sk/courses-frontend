import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { CardBody, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap"
import {Card} from "@material-ui/core"
import { BlockPicker } from 'react-color'
import { 
    useDeleteCourseBadgeTypeMutation,
    useUpdateCourseBadgeTypeMutation,
    useRefreshCacheMutation,
    useDeleteAwardableBadgeMutation,
} from "services/badge"
import { useCancelJobMutation, 
         useScheduleJobMutation, } from "services/job"
import { useGetUserQuery } from "services/user"



function CourseBadgeTypeCard(props) {
    const {item} = props
    const {courseInstanceReducer} = props
    const {courseInstance} = courseInstanceReducer
    const courseInstanceId = !courseInstance ? "" : courseInstance._id
    const [modal, setModal] = useState(false)
    const badgeType = item.badgeType
    const [studentAwarding, setStudentAwarding] = useState(item.canAwardStudent)
    const [instructorAwarding, setInstructorAwarding] = useState(item.canAwardInstructor)
    const { data: students } = useGetUserQuery({studentOfId: courseInstanceId}, {skip: !courseInstance})


    const click = () => {
        setModal(!modal)
        setStudentAwarding(item.canAwardStudent)
        setInstructorAwarding(item.canAwardInstructor)
        refreshCache()
        clearForm()
    }

    const [deleteCourseBadgeType] = useDeleteCourseBadgeTypeMutation()
    const [updateCourseBadgeType] = useUpdateCourseBadgeTypeMutation()
    const [deleteAwardableBadge] = useDeleteAwardableBadgeMutation()
    const [cancelBadge] = useCancelJobMutation()
    const [scheduleBadge] = useScheduleJobMutation()
    const [refreshCache] = useRefreshCacheMutation()

    const [form, setForm] = useState({
        courseInstance: item.courseInstance,
        type: item.badgeType,
        additional: item.additional ? item.additional : "",
        canAwardStudent: item.canAwardStudent,
        canAwardInstructor: item.canAwardInstructor,
        enabled: item.enabled,
        enabledFrom: item.enabledFrom,
        enabledUntil: item.enabledUntil,
        awardableTo: item.awardableTo,
        additional: item.additional,
        color: item.color,
    })

    const clearForm = () => {
        setForm({
            courseInstance: item.courseInstance,
            type: item.badgeType,
            additional: item.additional ? item.additional : "",
            canAwardStudent: item.canAwardStudent,
            canAwardInstructor: item.canAwardInstructor,
            enabled: item.enabled,
            enabledFrom: item.enabledFrom,
            enabledUntil: item.enabledUntil,
            awardableTo: item.awardableTo,
            additional: item.additional,
            color: item.color,
        })
    }

    const color = item.enabled ? (item.color + "80") : "GhostWhite"
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107"]

    const disable = () => {
        setForm({...form, enabledUntil: item.enabledFrom, enabled: false})
        submitUpdate(true)
    }

    const submitDelete = () => {
        deleteCourseBadgeType({id: item._id})
        deleteAwardableBadge({id: item._id, awarded: false})
        setModal(false)
        clearForm()
    }

    const refreshScheduled = (time) => {
        setTimeout(() => {
            refreshCache()
        }, time - Date.now())
    }

    const submitUpdate = (disable) => {
        if (disable) {
            updateCourseBadgeType({id: item._id, body: {...form, enabledUntil: item.enabledFrom, enabled: false}})
            deleteAwardableBadge({id: item._id, awarded: false})
        }
        else {
            let users = []
            if (form.canAwardInstructor)
                users = users.concat(courseInstance.hasInstructor.map(u => u._id))
            if (form.canAwardStudent && students)
                users = users.concat(students.map(s => s._id))

            updateCourseBadgeType({id: item._id, body: {...form, enabled: new Date() >= form.enabledFrom && new Date() < form.enabledUntil}}).unwrap().then(id => {
                cancelBadge({id: id})
                scheduleBadge({instance: courseInstance, users: users, id: id, badgeId: item.badgeType._id ,enableDate: form.enabledFrom, disableDate: form.enabledUntil, awardableTo: form.awardableTo, additional: form.additional, color: form.color})
                refreshScheduled(form.enabledFrom)
                refreshScheduled(form.enabledUntil)
            }).catch(error => {
                console.log(error)
            })
        }
        setModal(false)
    }

    const truncate = (title) => {
        return title.length > 18 ? title.slice(0, 17) + "…" : title
    }

    return (
        <>
        <Card onClick={click} title={badgeType.description} style={{cursor: "pointer", width: '12rem', margin: '.5rem', backgroundColor: color  }}>
            <CardBody style={{padding: '.5rem'}}>
                <Row>
                    <img src={badgeType.icon} width={35} height={35} />
                    <CardTitle tag="h6" style={{margin: "auto"}}>
                        {truncate(badgeType.title)}
                    </CardTitle>          
                </Row>
            </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={click} >
        <ModalHeader>
            {badgeType.title}
        </ModalHeader>
        <ModalBody>
            <Form>
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
                        disabled={item.enabled}
                        id="additional"
                        name="text"
                        type="textarea"
                        value={form.additional}
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
                                <Input disabled={item.enabled} type="checkbox" id='student' checked={studentAwarding}
                                    onChange={ e => {
                                        setForm({...form, canAwardStudent: !studentAwarding})
                                        setStudentAwarding(!studentAwarding)
                                    }}/>
                                <Label check for='student' style={{fontWeight: 'normal'}}>
                                Student
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Input disabled={item.enabled} type="checkbox" id='instructor' checked={instructorAwarding}
                                    onChange={ e => {
                                        setForm({...form, canAwardInstructor: !instructorAwarding})
                                        setInstructorAwarding(!instructorAwarding)
                                    }}/>
                                <Label check for='instructor' style={{fontWeight: 'normal'}}>
                                Instructor
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Label>Awarded to</Label>
                            <FormGroup check>
                                <Input disabled={item.enabled} name='radio1' type='radio' id='r1' defaultChecked={item.awardableTo == 'course'} 
                                    onChange={e => {
                                        setForm({...form, awardableTo: e.target.checked ? 'course' : 'team'})
                                    }}/>
                                    <Label check for='r1' style={{fontWeight: 'normal'}}>Course attendee</Label><br />
                                <Input disabled={item.enabled} name='radio1' type='radio' id='r2' defaultChecked={item.awardableTo == 'team'} 
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
                                disabled={item.enabled}
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
                                disabled={item.enabled}
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
            {item.enabled && <Button color="warning" onClick={disable}>Disable</Button>}
            <Button color="danger" onClick={submitDelete}>Delete</Button>
            {!item.enabled && <Button color="primary" onClick={() => submitUpdate(false)}>Save</Button>}
                </ModalFooter> 
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(CourseBadgeTypeCard))