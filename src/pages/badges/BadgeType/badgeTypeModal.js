import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { useCreateBadgeTypeMutation } from 'services/badge'
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

const BadgeTypeModal = () => {
    const [ form, setForm ] = useState({
        title: '',
        description: '',
    })
    const [createBadgeType, createBadgeTypeResult] = useCreateBadgeTypeMutation()
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [img, setImg] = useState([])
    
    const submitCreate = () => {
        createBadgeType({body: form, icon: img[0].getFileEncodeDataURL()})
        setModal(false)
        setImg([])
    }

    return (
        <>
        <Button color="primary" onClick={toggle}>New Badge</Button>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>New Badge</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input 
                            id="title"
                            name="title"
                            onChange={ e => {
                                setForm({...form, title: e.target.value})
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          type="textarea"
                          onChange={ e => {
                            setForm({...form, description: e.target.value})
                          }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="icon">Icon</Label>
                        <FilePond
                            style={{backgroundColor: "LightGray"}}
                            files={img}
                            onupdatefiles={setImg}
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            credits={false}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={submitCreate}>Create</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </>
        
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(BadgeTypeModal))