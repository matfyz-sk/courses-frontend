import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Alert,
  Table,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import {
  axiosGetEntities,
  axiosUpdateEntity,
  getShortType,
  getResponseBody,
  getShortID,
  compareByDate,
  compareByName,
} from 'helperFunctions'
import DocumentRow from './DocumentRow'
import { HiSortAscending, HiSortDescending } from 'react-icons/hi'
import { redirect } from '../../constants/redirect'
import * as ROUTES from '../../constants/routes'
import Page404 from '../errors/Page404'

const SORTING_KEY_IS_CREATED_AT = 'createdAt'
const SORTING_KEY_IS_NAME = 'name'

// FIXME style conventionally
const THEAD_COLOR = '#237a23'

function DocumentsManager(props) {
  const [documents, setDocuments] = useState([])
  const [courseId, setCourseId] = useState(props.match.params.course_id)

  const [status, setStatus] = useState(200)
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState(SORTING_KEY_IS_NAME)
  const [sortIsAscending, setSortIsAscending] = useState(true)

  const sortDocuments = items => {
    if (items === []) return []

    let sortedItems = []
    if (sortBy === SORTING_KEY_IS_CREATED_AT) {
      sortedItems = [...items].sort(compareByDate(sortIsAscending))
    } else if (sortBy === SORTING_KEY_IS_NAME) {
      sortedItems = [...items].sort(compareByName(sortIsAscending))
    }
    return sortedItems
  }

  useEffect(() => {
    setLoading(true)
    const entitiesUrl = `courseInstance/${courseId}?_join=hasDocument`
    axiosGetEntities(entitiesUrl)
      .then(response => {
        if (response.failed) {
          console.error("Couldn't fetch documents, try again")
          setLoading(false)
          setStatus(response.response ? response.response.status : 500)
          return
        }
        return getResponseBody(response)
      })
      .then(data => {
        setDocuments(
          sortDocuments(
            data[0].hasDocument.filter(
              doc => doc.isDeleted === props.showingDeleted
            )
          )
        )
        setLoading(false)
      })
  }, [courseId, props.showingDeleted])

  useEffect(() => {
    setDocuments(sortDocuments(documents))
  }, [sortBy, sortIsAscending])

  const invertDeletionFlag = document => {
    const url = `${getShortType(document['@type'])}/${getShortID(
      document['@id']
    )}`

    document.isDeleted = !document.isDeleted // ? is this valid react, check with react strict mode?
    axiosUpdateEntity({ isDeleted: document.isDeleted }, url).then(response => {
      if (response.failed) {
        console.error('Inverting was unsuccessful')
        setStatus(response.response ? response.response.status : 500)
      } else {
        setDocuments(
          documents.filter(
            document => document.isDeleted === props.showingDeleted
          )
        )
      }
    })
  }

  const toggleDropdown = () => setDropdownIsOpen(state => !state)


  if (status === 404) {
    return <Page404 />
  }

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <div
      className="documentManager"
      style={{ maxWidth: '50%', margin: 'auto' }}
    >
      {status !== 200 && (
        <>
          <br/>
          <Alert color="warning">
            There has been a server error, try again please!
          </Alert>
        </>
      )}
      {!props.showingDeleted && (
        <>
          <Link
            to={redirect(ROUTES.DELETED_DOCUMENTS, [
              { key: 'course_id', value: courseId },
            ])}
          >
            <Button>Deleted documents</Button>
          </Link>
          <Dropdown toggle={toggleDropdown} isOpen={dropdownIsOpen}>
            <DropdownToggle caret color="success">
              Create new document
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag={Link}
                to={redirect(ROUTES.CREATE_INTERNAL_DOCUMENT, [
                  { key: 'course_id', value: getShortID(courseId) },
                ])}
              >
                Internal Document
              </DropdownItem>
              <DropdownItem
                tag={Link}
                to={redirect(ROUTES.CREATE_EXTERNAL_DOCUMENT, [
                  { key: 'course_id', value: getShortID(courseId) },
                ])}
              >
                External Document
              </DropdownItem>
              <DropdownItem
                tag={Link}
                to={redirect(ROUTES.CREATE_FILE_DOCUMENT, [
                  { key: 'course_id', value: getShortID(courseId) },
                ])}
              >
                File Document
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
      <br />
      <Table>
        <thead>
          <tr>
            <th>
              <Link
                style={{ color: THEAD_COLOR, textDecoration: 'none' }}
                to="#"
                onClick={() => {
                  if (sortBy === SORTING_KEY_IS_NAME) {
                    setSortIsAscending(prev => !prev)
                  } else {
                    setSortBy(SORTING_KEY_IS_NAME)
                    setSortIsAscending(true)
                  }
                }}
              >
                Name{' '}
                {sortBy === SORTING_KEY_IS_NAME &&
                  (sortIsAscending ? (
                    <HiSortAscending />
                  ) : (
                    <HiSortDescending />
                  ))}
              </Link>
            </th>
            <th>
              <Link
                style={{ color: THEAD_COLOR, textDecoration: 'none' }}
                to={{}}
                onClick={() => {
                  if (sortBy === SORTING_KEY_IS_CREATED_AT) {
                    setSortIsAscending(prev => !prev)
                  } else {
                    setSortBy(SORTING_KEY_IS_CREATED_AT)
                    setSortIsAscending(true)
                  }
                }}
              >
                Last Changed{' '}
                {sortBy === SORTING_KEY_IS_CREATED_AT &&
                  (sortIsAscending ? (
                    <HiSortAscending />
                  ) : (
                    <HiSortDescending />
                  ))}
              </Link>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document, i) => (
            <DocumentRow
              key={i}
              document={document}
              invertDeletionFlag={invertDeletionFlag}
              showingDeleted={props.showingDeleted}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(DocumentsManager))
