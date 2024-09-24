import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { useGetCourseBadgeTypesQuery, useUpdateAwardableBadgeMutation, useGetBadgeTypeQuery, useRefreshCacheMutation } from "services/badge"
import { Alert, Modal, ModalBody, ModalFooter, ModalHeader, Button, Row } from "reactstrap"
import { Card, CardContent, CardActions, Typography, Select, FormControl, MenuItem, InputLabel, TextField } from "@material-ui/core"
import { useGetUserQuery } from "services/user"
import BadgeIcon from "./badgeIcon"

const AwardableBadge = (props) => {
    const {courseInstanceReducer} = props
    const {courseInstance} = courseInstanceReducer
    const {type: awardType} = props
    const {user} = props.userReducer
    const {item} = props
    const courseInstanceId = !courseInstance ? "" : courseInstance._id
    const {awardedTo, hasUser} = item
    const {courseBadgeType} = item
    const {badgeType: badge} = item
    const badgeId = badge ? badge._id : null
    const courseBadgeId = courseBadgeType ? courseBadgeType._id : null
    const awardedToId = awardedTo ? awardedTo._id : null
    const awardingId = hasUser ? hasUser._id : null

    const [modal, setModal] = useState(false)
    const [receiver, setReceiver] = useState(awardedTo ? awardedTo : "")
    const [comment, setComment] = useState("")
    const [awardBadge] = useUpdateAwardableBadgeMutation()
    const [refreshCache] = useRefreshCacheMutation()

    const {data: badgeType, isLoading: isLoadingBadgeType, isError: isErrorBadgeType, isUninitialized: isUninitializedBadgeType} = useGetBadgeTypeQuery(badgeId, {skip: !badge})
    const {data} = useGetCourseBadgeTypesQuery({courseBadgeId: courseBadgeId}, {skip: !courseBadgeType})
    const awardableTo = data ? data[0].awardableTo : ""
    const {data: receivers} = useGetUserQuery({studentOfId: courseInstanceId}, {skip: !courseInstance || awardableTo !== "course"})
    const {data: awardedUser} = useGetUserQuery({id: awardedToId}, {skip: !courseInstance || !awardedToId})
    const {data: awardingUser} = useGetUserQuery({id: awardingId}, {skip: !courseInstance || !awardingId})
    
    const handleChange = (event) => {
        setReceiver(event.target.value)
    }

    const award = () => {
        awardBadge({id: item._id, user: receiver, comment: comment, awardedOn: new Date()})
        toggle()
    }

    const toggle = () => {
        refreshCache()
        setModal(!modal)
    }

    return (
        <>
        {isLoadingBadgeType ? <div><Alert color="info">Loading...</Alert></div> :
        (isErrorBadgeType || isUninitializedBadgeType) ? <div><Alert color="danger">Error</Alert></div> :
        <Card onClick={toggle} title={badgeType.description} style={{cursor: "pointer", width: '8.5rem', margin: '.5rem', backgroundColor: "GhostWhite" }}>
            <CardContent style={{padding: '.5rem', textAlign: "center"}}>
                   <div style={{position: "relative"}}>
                    <BadgeIcon color={item.color ? item.color : "#FFFFFF"}/>
                    <img src={badgeType.icon} width={40} height={40} style={{top: "24px", left: "40px", position: "absolute"}}/>
                    <h6 style={{textAlign: "center", margin: "auto"}}>{badgeType.title}</h6>
                    
                   </div>

                {awardedUser ? 
                    <Typography variant="caption" align="left">
                         {item.awardedOn.toLocaleString("sk-SK").slice(0, -3)}
                    </Typography>
                :
                <Row style={{marginTop: "0.5rem"}}>
                    <Typography variant="caption" align="left">
                        Award until<br/>{data ? data[0].enabledUntil.toLocaleString("sk-SK").slice(0, -3) : ""}
                    </Typography>
                </Row>}
            </CardContent>
        </Card>}

        <Modal isOpen={modal} toggle={toggle}>
            {awardedUser ? <></> :
                <ModalHeader>Award a badge</ModalHeader>
            }
            
            <ModalBody>
                <Card style={{ backgroundColor: "GhostWhite", margin: "auto" }}>
                    <CardContent style={{ margin: "auto" }}>
                        <Row style={{marginBottom: "1rem"}}>
                            {isLoadingBadgeType ? <div><Alert color="info">Loading...</Alert></div> :
                            (isErrorBadgeType || isUninitializedBadgeType) ? <div><Alert color="danger">Error</Alert></div> :
                            <>
                                <img src={badgeType.icon} width={50} height={50} style={{marginRight: '1rem' }}/> 
                                <h5 style={{paddingTop: '.5em'}}>{badgeType.title}</h5>
                            </>}
                        </Row>
                        <Row>
                            <Typography variant="body1">
                                {badgeType ? badgeType.description : ""}
                            </Typography>
                        </Row>
                    </CardContent>
                    <CardActions>
                        <Row style={{marginLeft: "auto"}}>
                            <Typography color="textSecondary" variant="caption" >
                                {item.awardedOn ? `Awarded on ${item.awardedOn.toLocaleString("sk-SK").slice(0, -3)}` 
                                : `Award this badge to any of ${awardableTo === "team" ? "your teammates" : "the course attendees"}`}
                            </Typography>
                        </Row>
                    </CardActions>
                </Card>
                {item.additional ? <><hr style={{marginBottom: "0"}}/>
                    <Typography color="textSecondary" variant="caption" >
                        Instructor's note
                    </Typography>
                <Row>
                    <Typography variant="body2">
                        {(item.additional !== null) ? item.additional : ""}
                    </Typography>
                </Row></> : <></>}
                {awardedUser && awardingUser ?
                    <>
                    {item && item.awardComment ?
                        <>
                        <hr style={{marginBottom: "0"}}/>
                        <Typography color="textSecondary" variant="caption" >
                            {awardingUser[0].firstName}'s comment
                        </Typography>
                        <Row>
                            <Typography variant="body2">
                                {item.awardComment}
                            </Typography>
                        </Row>
                        <hr />
                        </> : <hr />}
                    <Row>
                        {
                        awardType === "received" ? 
                            <Typography variant="h6" style={{margin: "auto"}}>
                                Awarded by {awardingUser[0].firstName + " " + awardingUser[0].lastName}
                            </Typography>
                        :
                            <Typography variant="h6" style={{margin: "auto"}}>
                                Awarded to {awardedUser[0].firstName + " " + awardedUser[0].lastName}
                            </Typography>
                        }
                    </Row>
                    </>
                :
                <>
                <hr />
                <Row>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="receiver" value="">Award to</InputLabel>
                        <Select value={receiver} onChange={handleChange} labelId="receiver" id="receiverId" label="Award to">
                            {receivers ? receivers.filter(u => u._id !== user.fullURI).map(user => 
                                <MenuItem value={user._id}>
                                    {user.firstName + " " + user.lastName}
                                </MenuItem>
                            ) : null}
                        </Select>
                    </FormControl>
                </Row>
                <hr />
                <Row>
                    <TextField 
                        multiline 
                        fullWidth 
                        id="outlined-basic" 
                        label="Optional Comment" 
                        variant="outlined" 
                        onChange={ e => {
                            setComment(e.target.value)
                        }}/>
                </Row>
                </>}
            </ModalBody>
            {awardedUser ? <></> :
                <ModalFooter>
                    <Button color="primary" onClick={award}>
                        Award
                    </Button>
                </ModalFooter>
            }
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(AwardableBadge))