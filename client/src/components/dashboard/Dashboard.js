import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getCurrentProfile } from '../../actions/profile'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large-text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>has</Fragment>
      ) : (
        <Fragment>
          <p>You have not set up yet a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  )
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
