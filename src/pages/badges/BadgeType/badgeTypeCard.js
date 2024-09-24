import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Collapse, CardBody, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Button, Form, FormGroup, Label, Input, Row } from "reactstrap"
import {Card} from "@material-ui/core"
import { useDeleteBadgeTypeMutation, useUpdateBadgeTypeMutation, useDeleteCourseBadgeTypeMutation, useDeleteAwardableBadgeMutation } from "services/badge"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

const BadgeTypeCard = (props) => {
    const [updateBadgeType] = useUpdateBadgeTypeMutation()
    const [deleteBadgeType] = useDeleteBadgeTypeMutation()
    const [deleteCourseBadgeTypes] = useDeleteCourseBadgeTypeMutation()
    const [deleteAwardableBadges] = useDeleteAwardableBadgeMutation()

    const { item, func } = props
    const [modal, setModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isGray, setIsGray] = useState(func == "pick" ? 100 : 0)
    const [style, setStyle] = useState({cursor: "pointer", width: '12rem', margin: '.5rem' , border: "0 solid green"})

    const click = () => {
        if (func == "pick") {
            setIsGray(Math.abs(isGray - 100))
            setStyle(style.border == "0 solid green" ? {...style, border: ".1rem solid green"} : {...style, border: "0 solid green"})
        } 
        else setModal(!modal)
        setEdit(false)
    }
    
    const toggleConfirm = () => {
        setConfirmDelete(!confirmDelete)
    }

    const [img, setImg] = useState([])
    const [ form, setForm ] = useState({
        title: item.title,
        description: item.description,
    })
    const toggleEdit = () => {
        setEdit(!edit)
        setForm({
            title: item.title,
            description: item.description,
        })
        setImg(item.icon ? [item.icon] : [])
    }

    const submitDelete = async (id) => {
        const result = await deleteCourseBadgeTypes({badgeTypeId: id})
        const result2 = await deleteAwardableBadges({badgeTypeId: id, awarded: true})
        if (result && result2) {
            deleteBadgeType(id)
        }
            
        setModal(false)
    }

    const submitUpdate = () => {
        updateBadgeType({id: item._id, body: form, icon: (img.length && img[0] !== item.icon) ? img[0].getFileEncodeDataURL() : img[0]})
        setEdit(false)
    }

    const truncate = (title) => {
        return title.length > 18 ? title.slice(0, 17) + "…" : title
    }

    return (
        <>
        {func === 'pick' ? 
        <Card className="bg-light" onClick={click} title={item.title + ":\n\n" + item.description} style={style}>
            <CardBody style={{padding: '.5rem'}}>
                <Row>
                    <img src={item.icon} width={35} height={35} style={{marginRight: '.5rem', filter: `grayscale(${isGray}%)` }}/>
                    <CardTitle tag="h6" style={{margin: "auto"}}>
                        {truncate(item.title)}
                    </CardTitle>          
                </Row>
            </CardBody>
        </Card>
        :
        <Card className="text-center bg-light" onClick={click} title={item.title + ":\n\n" + item.description} style={{cursor: "pointer", width: '10rem', margin: '.5rem' }}>     
            <CardBody style={{padding: '1rem'}}>
                <img src={item.icon} width={60} height={60} style={{ marginBottom: '.3rem', filter: `grayscale(${isGray}%)` }}/>
                <CardTitle tag="h6" style={{margin: "auto"}}>
                    {truncate(item.title)}
                </CardTitle>
            </CardBody>
        </Card>}
        <Modal isOpen={modal} toggle={click} >
            <ModalHeader toggle={click}>{item.title}</ModalHeader>
            <ModalBody>
                <Collapse className="text-center" isOpen={!edit}>
                    <img src={item.icon} width={80} height={80} style={{ marginBottom: '.3rem', filter: `grayscale(${isGray}%)` }}/>
                    <p>{item.description}</p>
                </Collapse>
                <Collapse isOpen={edit}>
                    <Form>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input 
                                id="title"
                                name="title"
                                defaultValue={item.title}
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
                              defaultValue={item.description}
                              type="textarea"
                              onChange={ e => {
                                setForm({...form, description: e.target.value})
                              }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="icon">Icon</Label>
                            <FilePond
                                files={img}
                                onupdatefiles={setImg}
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                credits={false}
                            />
                        </FormGroup>
                    </Form>
                    <Button color="primary" style={{textAlign: 'right'}} onClick={submitUpdate}>Save</Button>
                </Collapse>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggleEdit}>Edit</Button>
                <Button color="danger" onClick={toggleConfirm}>Delete</Button>
                <Button color="secondary" onClick={click}>Cancel</Button>
            </ModalFooter>
            <Modal isOpen={confirmDelete} toggle={toggleConfirm}>
                <ModalHeader>
                    Delete Confirmation
                </ModalHeader>
                <ModalBody>
                    Deleting this Badge Type will also delete all awarded badges. Do you want to proceed?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => submitDelete(item._id)}>Confirm</Button>
                    <Button color="secondary" onClick={toggleConfirm}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return state
}

export default withRouter(connect(mapStateToProps)(BadgeTypeCard))