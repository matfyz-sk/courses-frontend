import React, { useState } from 'react'
import { Alert } from '@material-ui/lab/'
import { Collapse } from '@material-ui/core/'

export function WarningMessage ({
 text,
 className,
 isOpen,
}) {
    
    return (
        <Collapse in={text && text !== 'ok' ? true : false}>
            <Alert style={{width: "fit-content"}} className = {className} severity="error">
                {text}
            </Alert>
        </Collapse>
    )
}

export default WarningMessage