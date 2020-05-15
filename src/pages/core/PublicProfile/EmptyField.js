import React from 'react'
import { Alert } from 'reactstrap'
import { FiWind } from 'react-icons/fi'

const EmptyField = ({ name, pl, sm, ...props }) => (
  <Alert color="light" className="text-center">
    <h3 className="text-center">
      <FiWind className="mb-2" />
    </h3>
    <div>Nothing to show right now!</div>
  </Alert>
)

export default EmptyField
