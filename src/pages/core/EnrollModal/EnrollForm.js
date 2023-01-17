import React, { useState } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap'
import './EnrollModal.css'
import { authHeader, getUser, setUserProfile } from '../../../components/Auth'
import { axiosRequest } from '../AxiosRequests'
import { BASE_URL, USER_URL } from '../constants'
import { Redirect } from 'react-router-dom'
import { BACKEND_URL } from "../../../constants";
import { useNewCoursePersonalSettingsMutation, useUpdateCourseInstanceMutation } from 'services/course'
import { useUpdateUserMutation } from 'services/user'

function EnrollForm(props) {
    const [termsAndConditions, setTermsAndConditions] = useState(false)
    const [redirect, setRedirect] = useState(null)
    const [errors, setErrors] = useState([])
    const [globalPrivacy, setGlobalPrivacy] = useState(true)
    const [specificNickname, setSpecificNickname] = useState('')

    const requestEnrollment = () => {
        const {user, courseInstance} = props
    
        if(user) {
          const newRequests = user.requests.map(userRequestedCourse => {
            return userRequestedCourse['@id']
          })
          newRequests.push(courseInstance.fullId)
    
          const [updateUser, result] = useUpdateUserMutation()
          
          updateUser({
            id: user.id,
            patch: {requests: newRequests},
          }).unwrap().then(response => {
            const newRequest = {'@id': courseInstance.fullId}
            user.requests.push(newRequest)
            setUserProfile(user)
            setRedirect('/courses')
          }).catch(error => {
            const new_errors = []
            new_errors.push(
                'There was a problem with server while sending your request. Try again later.'
            )
            setErrors(new_errors)
          })
        }
    }

    // eslint-disable-next-line react/sort-comp
    const assignPrivacyToCourse = (iri) => {
        const {courseInstance} = props
        const personalSettings = []
        for(let i = 0; i < courseInstance.hasPersonalSettings.length; i++) {
          personalSettings.push(courseInstance.hasPersonalSettings[i]['@id'])
        }
        personalSettings.push(iri)
        
        const [updateCourseInstance, result] = useUpdateCourseInstanceMutation()

        updateCourseInstance({
            id: courseInstance.id,
            patch: {hasPersonalSettings: personalSettings},
        }).unwrap().then(response => {
            requestEnrollment()
        }).catch(error => {
            const new_errors = []
            new_errors.push(
                'There was a problem with server while sending your request. Try again later.'
            )
            setErrors(new_errors)
        })
    }

    const requestPrivacy = () => {
        if(!globalPrivacy) {
          const post = {
            hasUser: getUser().fullURI,
            nickName: specificNickname,
          }
          const [newCoursePersonalSettings, result] = useNewCoursePersonalSettingsMutation()

          newCoursePersonalSettings(post).unwrap().then(response => {
            const {iri} = data.resource
            assignPrivacyToCourse(iri)
          }).catch(error => {
            const new_errors = []
            new_errors.push(
                'There was a problem with server while sending your request. Try again later.'
            )
            setErrors(new_errors)
          })
        } else {
          requestEnrollment()
        }
    }

    const onSubmit = event => {
        event.preventDefault()
        const new_errors = validate(
          termsAndConditions,
          globalPrivacy,
          specificNickname
        )
        if(new_errors.length > 0) {
          setErrors(new_errors)
          event.preventDefault()
          return
        }
        requestPrivacy()
    }
    
    if(redirect) {
        return <Redirect to={ redirect }/>
    }

    const isInvalid = termsAndConditions === false
    return (
        <>
            { errors.map(error => (
            <Alert color="danger" key={ error }><b>Error:</b> { error }</Alert>
            )) }
            <Form onSubmit={ onSubmit } className="enroll-form-modal">
            <FormGroup check>
                <Label for="useGlobal">
                <Input
                    name="useGlobal"
                    id="useGlobal"
                    checked={ globalPrivacy }
                    onChange={ () => setGlobalPrivacy(!globalPrivacy)}
                    type="checkbox"
                />{ ' ' }
                I wish to use my global privacy settings.
                </Label>
            </FormGroup>
            <FormGroup check>
                <Label for="useSpecific">
                <Input
                    name="useSpecific"
                    id="useSpecific"
                    onChange={ () => setGlobalPrivacy(!globalPrivacy)}
                    checked={ !globalPrivacy }
                    type="checkbox"
                />{ ' ' }
                I wish to use specific nickname in this course.
                </Label>
            </FormGroup>
            { !globalPrivacy ? (
                <FormGroup>
                <Input
                    name="specificNickname"
                    id="specificNickname"
                    placeholder="My specific nickname"
                    value={ specificNickname }
                    onChange={ e => setSpecificNickname(e.target.value)}
                    type="text"
                />
                </FormGroup>
            ) : null }
            <FormGroup check>
                <Label for="termsAndConditions">
                <Input
                    name="termsAndConditions"
                    id="termsAndConditions"
                    onChange={ e => setTermsAndConditions(e.target.value) }
                    type="checkbox"
                />{ ' ' }
                I acknowledge that I have read, and do hereby accept the terms and
                conditions.
                </Label>
            </FormGroup>
            <Button
                disabled={ isInvalid }
                type="submit"
                className="enroll-button-modal"
            >
                Enroll
            </Button>
            </Form>
        </>
    )
}

const validate = (termsAndConditions, globalPrivacy, specificNickname) => {
    const errors = []
    if(!termsAndConditions) {
        errors.push(
        'You must accept the terms and conditions to enroll in course.'
        )
    }
    if(!globalPrivacy && specificNickname.length < 4) {
        errors.push('Specific nickname must cointain at least 4 characters.')
    }
    return errors
}

export { EnrollForm }