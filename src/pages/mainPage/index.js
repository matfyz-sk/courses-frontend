import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Row } from 'reactstrap';
import { BACKEND_URL } from "../../constants";
import { authHeader } from '../../components/Auth'
import UserCard from './UserCard'
import { isVisibleUser } from "../../components/Auth/userFunction";

const PER_PAGE = 18

const MainPage = props => {
  const [ users, setUsers ] = useState([])
  const [ page, setPage ] = useState(0)

  function fetchUsers() {
    fetch(`${ BACKEND_URL }/data/user?_orderBy=createdAt`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if(data['@graph'].length > 0) {
          const userData = []
          data['@graph'].reverse().map(item => {
            if(isVisibleUser(item)) {
              userData.push(item)
            }
          })
          setUsers(userData)
        }
      })
  }

  function handlePageClick(e) {
    setPage(e.selected)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const renderUsers = []
  for(let i = page * PER_PAGE; i < ((page + 1) * PER_PAGE < users.length ? (page + 1) * PER_PAGE : users.length); i++) {
    renderUsers.push(
      <UserCard
        user={ users[i] }
        key={ `user-${ i }` }
        privileges={ props.privilegesReducer }
      />
    )
  }

  return (
    <Container>
      <h1 className="mb-5">Welcome to Matfyz.sk</h1>
      <Row>
        { renderUsers }
      </Row>
      <div className="pagination-wrapper text-md-right text-sm-center text-center">
        <ReactPaginate
          pageCount={ Math.ceil(users.length / PER_PAGE) }
          pageRangeDisplayed={ 5 }
          marginPagesDisplayed={ 5 }
          containerClassName="pagination"
          breakClassName="page-item"
          breakLabel={ <span className="page-link">...</span> }
          pageClassName="page-item"
          previousClassName="page-item"
          nextClassName="page-item"
          pageLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          activeClassName="active"
          onPageChange={ handlePageClick }
        />
      </div>
    </Container>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(MainPage))
