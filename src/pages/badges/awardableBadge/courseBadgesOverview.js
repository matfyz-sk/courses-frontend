import React from "react"
import { withRouter } from "react-router-dom"
import { Container } from "reactstrap"
import AwardingMenu from "./awardingMenu"
import ReceivedMenu from "./receivedMenu"

const CourseBadgesOverview = () => {
    
    return (
        <Container>
            <h1 className="mb-4 mt-4">My Badges</h1>
            <AwardingMenu />
            <ReceivedMenu />
        </Container>
    )
}

export default withRouter(CourseBadgesOverview)