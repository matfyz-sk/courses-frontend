import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Row, Col, Collapse, Button } from "reactstrap"
import { Alert } from "@material-ui/lab"
import AwardableBadge from "./awardableBadgeCard"
import badgesDetail from "./badgesDetail"
import { useGetAwardableBadgesQuery } from "../../../services/badge"
import { getUserID, } from "../../../components/Auth"
const AwardingMenu = props => {
    const {courseInstanceReducer} = props
    const {courseInstance} = courseInstanceReducer
    const userID = getUserID()
    const {data: awardableBadges, isLoading, isError} = useGetAwardableBadgesQuery({id: userID})

    const [openAwardables, setOpenAwardables] = useState(true)
    const [openAwarded, setOpenAwarded] = useState(true)

    const toggleAwardables = () => {
        setOpenAwardables(!openAwardables)
    }

    const toggleAwarded = () => {
        setOpenAwarded(!openAwarded)
    }

    const compare = (a, b) => {
        if (a._id < b._id)
          return -1
        if (a._id > b._id)
          return 1
        return 0
    }

    let awardables = []
    let awarded = []
    if (awardableBadges) {
        awardableBadges.filter(badge => badge.courseInstance === courseInstance)
        awardables = awardableBadges.filter(item => !item.awardedTo).sort(compare)
        awarded = awardableBadges.filter(item => item.awardedTo).sort(compare)
    }

    return (
        <>
            <h4>Awardable Badges</h4>
            <Row style={{margin: "1rem"}}>
                <Col>
                    <Button onClick={toggleAwardables} color="link" style={{padding: "0", color: "black"}}><h6 onClick={toggleAwardables}>{openAwardables ? "▼" : "▶"} Not awarded</h6></Button>
                    <Collapse isOpen={openAwardables} toggle={toggleAwardables}>
                        {isLoading ? <div><Alert severity="info">Loading...</Alert></div> :
                        isError ? <div><Alert severity="error">An error has occured.</Alert></div> :
                        (awardables && awardables.length !== 0) ? <Row>{awardables.map((item) => <AwardableBadge item={item} />)}</Row> :
                        <div><Alert severity="info">No badges available to award.</Alert></div>}
                    </Collapse>
                    
                </Col>
            </Row>
            <Row style={{margin: "1rem"}}>
                <Col>
                <Button onClick={toggleAwarded} color="link" style={{padding: "0", color: "black"}}><h6>{openAwarded ? "▼" : "▶"} Awarded</h6></Button>
                    <Collapse isOpen={openAwarded} toggle={toggleAwarded}>
                        {isLoading ? <div><Alert severity="info">Loading...</Alert></div> :
                        isError ? <div><Alert severity="error">An error has occured.</Alert></div> :
                        (awarded && awarded.length !== 0) ? <Row>{awarded.map((item) => <AwardableBadge item={item} />)}</Row> :
                        <div><Alert severity="info">You haven't awarded any badges.</Alert></div>}
                    </Collapse>
                    
                </Col>
            </Row>

        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(AwardingMenu))