import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { useGetAwardableBadgesQuery } from "../../../services/badge"
import { Modal, ModalHeader, ModalBody, Button, Row, Alert } from "reactstrap"
import AwardableBadge from "./awardableBadgeCard"
import { useGetUserQuery } from "services/user"

const BadgesDetail = (props) => {
    const {userId} = props
    const {data: badges, isLoading, isError} = useGetAwardableBadgesQuery({awarded: userId}, {skip: !userId})
    const {data: user} = useGetUserQuery({id: userId}, {skip: !userId})

    const [modal, setModal] = useState(false)

    const toggle = () => setModal(!modal)

    return (
        <td>
        <Button color="link" onClick={toggle}>{badges ? badges.length : 0}🎖️</Button>
        <Modal size="lg" isOpen={modal} toggle={toggle}>
            <ModalHeader>
                {user ? user[0].firstName + "'s Badges" : "user's Badges"}
            </ModalHeader>
            <ModalBody>
                {isLoading ? <div><Alert color="info">Loading...</Alert></div> :
                isError ? <div><Alert color="danger">An error has occured.</Alert></div> :
                badges ? <Row>{badges.map((item) => <AwardableBadge item={item} type="received" />)}</Row> :
                <div><Alert color="info">This user hasn't received any badges yet.</Alert></div>}
            </ModalBody>
        </Modal>
        </td>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(BadgesDetail))