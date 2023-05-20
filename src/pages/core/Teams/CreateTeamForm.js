import React from 'react'
import { Button, FormGroup, Input, Label } from 'reactstrap'
import { getUser } from '../../../components/Auth'
import { useNewTeamMutation } from "services/teamGraph"

function CreateTeamForm(props) {
    const {
        course,
        create,
        teamName,
        setTeamName,
        setError,
        appendUserToTeam
    } = props
    const [newTeam, newTeamResult] = useNewTeamMutation()

    const handleInputChange = (event) => {
        const {value} = event.target
        if(value.length <= 30) {
          setTeamName(value)
        }
    }
    
    const handleCreateTeam = async () => {
        if(!create) {
            setError('You cannot create team!')
        } else if(teamName.length < 3) {
            setError('Team name must contain from 3 to 30 characters.')
        } else {
            const post = {
                name: teamName,
                courseInstance: course['_id'],
            }
            newTeam(post).unwrap().then(response => {
                const teamId = response[0]['_id']
                console.log(teamId)
                appendUserToTeam(teamId, getUser().fullURI, true)
            }).catch(error => {
                console.log(error)
                setError('Error has occured during saving process. Please, try again.')
            })
        }
    }

    if (!create) {
        return null
    }
    return (
        <div className="mb-3">
            <FormGroup>
            <Label for="team-name">What is name of your team? *</Label>
            <Input
                type="text"
                name="name"
                id="name"
                placeholder="e.g. Hard workers"
                style={ {maxWidth: 'initial'} }
                value={ teamName }
                max={ 30 }
                onChange={ handleInputChange }
                autoComplete="off"
            />
            </FormGroup>
            <Button color="success" onClick={ handleCreateTeam }>
            Create team
            </Button>
        </div>
    )
}

export { CreateTeamForm }