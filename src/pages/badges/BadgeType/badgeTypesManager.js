import React from "react"
import { withRouter } from "react-router-dom"
import { Container, Row, Alert } from "reactstrap"
import BadgeTypeModal from "./badgeTypeModal"
import BadgeTypeCard from "./badgeTypeCard"
import adminOnly from "../adminOnly"
import { connect } from "react-redux"
import { useGetAllBadgeTypesQuery } from "services/badge"


const BadgeTypesManager = () => {
    const { data, isLoading, isError } = useGetAllBadgeTypesQuery()

    const compare = (a, b) => {
        if (a.title < b.title)
          return -1
        if (a.title > b.title)
          return 1
        return 0
    }

    let sortedData = []
    if (data)
        sortedData = [...data].sort(compare)

    return (
        <Container>
            <h1 className="mb-4">Badges</h1>
            <BadgeTypeModal />
            <hr />
            <Row>
                {isLoading ? <div><Alert color="info">Loading...</Alert></div> : 
                isError ?  <div><Alert color="danger">An error has occurred.</Alert></div> :
                sortedData ? sortedData.map((item) => <BadgeTypeCard item={item} /> ) :
                <div><Alert color="info">No badge types created.</Alert></div>}
            </Row>
            <hr />
        </Container>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(adminOnly(BadgeTypesManager)))