import React from 'react'
import {Card, CardBody, CardHeader, CardSubtitle} from 'reactstrap'
import {NavLink} from 'react-router-dom'
import './Event.css'
import {SubEventList} from '../Events'
import {
  getDisplayDateTime,
  getShortId,
} from '../Helper'
import {SESSIONS, TASKS_EXAMS} from '../constants'
import {redirect} from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import DocumentReferencesList from '../../documents/common/DocumentReferencesList'

const EventCard = ({ onViewableDocumentClick, event, isAdmin, detail }) => (
    <Card id={`${event.id}`} name={`${event.id}`} className="event-card">
      <CardHeader className="event-card-header-flex">
        <NavLink
          to={redirect(ROUTES.EVENT_ID, [
            { key: 'course_id', value: getShortId(event.courseInstance) },
            { key: 'event_id', value: event.id },
          ])}
          className="subevent-name"
        >
          <div className="event-card-name">
            {event.name} ({event.type})
          </div>
        </NavLink>
        {isAdmin &&
          (SESSIONS.includes(event.type) ||
            TASKS_EXAMS.includes(event.type) ||
            event.type === 'Block') && (
            <NavLink
              to={redirect(ROUTES.EDIT_EVENT_ID, [
                { key: 'course_id', value: getShortId(event.courseInstance) },
                { key: 'event_id', value: event.id },
              ])}
              className="edit-delete-buttons"
            >
              Edit
            </NavLink>
          )}
      </CardHeader>
      <CardBody>
        <div className="event-dates-container">
          <div className="event-dates-col">
            <CardSubtitle className="event-card-subtitle-double">
              <div className="event-subtitle-double">From</div>
              {getDisplayDateTime(event.startDate, true)}
            </CardSubtitle>
          </div>
          <div className="event-dates-col">
            <CardSubtitle className="event-card-subtitle-double">
              <div className="event-subtitle-double">To</div>
              {getDisplayDateTime(event.endDate, true)}
            </CardSubtitle>
          </div>
        </div>
        {/*<CardText className="event-card-text">{event.description}</CardText>*/}
        <CardSubtitle className="event-card-subtitle">Description</CardSubtitle>
        <div className="fake-table">{event.description}</div>
        {event.place && (
          <>
            <CardSubtitle className="event-card-subtitle-one-line">
              <div className="event-subtitle">Location</div>
              <div className="event-one-line-text">{event.place}</div>
            </CardSubtitle>
          </>
        )}
  
        {event.type === 'Block' && !detail && (
          <div className="timeline-sessions-tasks-container">
            <div className="subevents-col-left">
              <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
              <SubEventList events={event.sessions} />
            </div>
            <div className="subevents-col-right">
              <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
              <SubEventList events={event.tasks} />
            </div>
          </div>
        )}
        {event.documentReference && event.documentReference.length > 0 && (
          <>
            <CardSubtitle  className="event-card-table-subtitle">
              <div style={{width: "100%"}} className="event-subtitle">Documents</div>
            </CardSubtitle>
            <DocumentReferencesList
              onViewableDocumentClick={onViewableDocumentClick}
              documentReference={event.documentReference}
            />
          </>
        )}
        {/*{event.materials && event.materials.length > 0 && (*/}
        {/*  <>*/}
        {/*    <CardSubtitle className="event-card-table-subtitle">*/}
        {/*      Materials*/}
        {/*    </CardSubtitle>*/}
        {/*    <Table key={event.id} className="materials-table">*/}
        {/*      <tbody>*/}
        {/*        {event.materials.map(material => (*/}
        {/*          <tr key={material.id} className="event-list-group-item">*/}
        {/*            <td className="materials-td">*/}
        {/*              {getIcon('Material')}*/}
        {/*              <div className="material-name">{material.name}</div>*/}
        {/*            </td>*/}
        {/*          </tr>*/}
        {/*        ))}*/}
        {/*      </tbody>*/}
        {/*    </Table>*/}
        {/*  </>*/}
        {/*)}*/}
      </CardBody>
    </Card>
)

export { EventCard }