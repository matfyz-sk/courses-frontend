import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import AwardableBadge from "./awardableBadgeCard"
import { useGetAwardableBadgesQuery } from "../../../services/badge"
import { getUserID } from "../../../components/Auth"
import { Row, Col } from "reactstrap"
import { Alert } from "@material-ui/lab"

import BadgesDetail from "./badgesDetail"


const ReceivedMenu = props => {
    const userID = getUserID()
    const {data: awardableBadges, isLoading, isError} = useGetAwardableBadgesQuery({awarded: userID})

    return (
        <>
            <h4>Received Badges</h4>
            <Row style={{margin: "1rem"}}>
                <Col>
                    {isLoading ? <div><Alert severity="info">Loading...</Alert></div> :
                    isError ? <div><Alert severity="error">An error has occured.</Alert></div> :
                    awardableBadges ? <Row>{awardableBadges.map((item) => <AwardableBadge item={item} type="received" />)}</Row> :
                    <div><Alert severity="info">You haven't received any badges.</Alert></div>}
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(ReceivedMenu))