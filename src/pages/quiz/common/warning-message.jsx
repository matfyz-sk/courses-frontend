import React from 'react'
import { Alert } from '@material-ui/lab/'
import { Collapse } from '@material-ui/core/'

export function WarningMessage ({
                                  text,
                                  className,
                                }) {

  return (
    <Collapse in={text.length > 0 && text !== 'ok'}>
      <Alert style={{width: "fit-content"}} className = {className} severity="error">
        <span style={{whiteSpace: 'pre', display:'flex', textAlign:'center'}}>{text}</span>
      </Alert>
    </Collapse>
  )
}

export default WarningMessage
