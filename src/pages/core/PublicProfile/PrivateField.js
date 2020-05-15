import React from 'react'
import { Alert } from 'reactstrap'
import { FiEyeOff } from 'react-icons/fi'

const PrivateField = ({ name, pl, sm, ...props }) => (
  <Alert color="primary" style={sm ? { padding:  '8px 10px' } : null} className="text-center">
    <h3 className="text-center">
      <FiEyeOff className="mb-2" />
    </h3>
    <div>
      {name} {pl ? 'are' : 'is'} marked as <b>private!</b>
    </div>
  </Alert>
)

export default PrivateField
