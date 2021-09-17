import ModalDialog from '../../commonComponents/ModalDialog'
import Input from '../../commonComponents/Input'
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import moment from 'moment'
import {Col, Row} from 'react-bootstrap';
import { getFullDateTime } from 'commonMethod/common';

export function EditAssetServiceHistory({ editShow, toggleEditModal, updateAssetServiceEvent, itemTagId, asset_id ,getAllServiceEventList, getOneAssetServiceEvent}) {
    const [serviceTech, setServiceTech] = useState('');
    const [comments, setComments] = useState('');
    const [cost, setCost] = useState('');
    const [attachment, setAttachment] = useState([]);
    const [eventTime, setEventTime] = useState('');
    const [isFormSubmitted, setForm] = useState(false);

    useEffect(() => {
        if(editShow){
            getOneAssetServiceEvent(itemTagId).then((tag) => {
                setServiceTech(tag.serviceTechnician);
                setComments(tag.comments);
                setCost(tag.cost);
                setAttachment([...tag.attachments]);
                // setEventTime(moment.utc(tag.eventTime).format('YYYY-MM-DD[T]HH:mm'));
                setEventTime(getFullDateTime(tag.eventTime));
            })
        }
    }, [])

    const validateForm = () => {
        if (serviceTech !== '' && comments !== '' && cost !== '' && eventTime !== '') {
            return true;
        }
        return false;
    }

    const handleUploadImage = (e) => {
        if(e.target.files){
            const Data = Array.from(e.target.files)
            setAttachment([...attachment, ...Data])
        }
    }

    const getFileName = url => {
        return url.substring(url.lastIndexOf('/')+1);
    }

    // const onSubmitAttachments = () => {
    //     let formData = new FormData();
    //     formData.append("GUID",itemTagId)
    //     for (let i = 0; i < attachment.length; i++) {
    //         formData.append(`attachments`, attachment[i])
    //     }
    //     let obj = {
    //         itemId: asset_id,
    //     }
    //     setForm(true);
    //     updateAttachments(formData).then((res) => {
    //         if(res.isError){
    //             toast.error(res.msg)
    //         }else{
    //         // toast.success(res.msg)
    //         }
    //         setTimeout(() => {
    //             toggleEditModal();
    //             getAllServiceEventList(obj);
    //         }, 1000);
    //     }).catch(
    //         function (error) {
    //             toast.error(error.response.data?.msg);
    //         }
    //     );
    // }

    const onSubmit = () => {
        const isValidForm = validateForm();
        let formData = new FormData();
        for (let i = 0; i < attachment.length; i++) {
            formData.append(`${typeof(attachment[i]) !== "string" ? 'attachments' : `attachments[${i}]`}`, attachment[i])
        }
        
        formData.append('serviceTechnician', serviceTech);
        formData.append('comments', comments);
        formData.append('cost', cost);
        formData.append('eventTime', moment(eventTime).utc());
       
        let obj = {
            itemId: asset_id,
        }

        setForm(true);
        if (isValidForm) {
            updateAssetServiceEvent(itemTagId, formData).then((res) => {
                if(res.isError){
                    toast.error(res.msg)
                  }else{
                    // toast.success(res.msg)
                  }
                setForm(false);
                setServiceTech(''); 
                setComments(''); 
                setCost('');
                setAttachment([]);
                setEventTime();
                setTimeout(() => {
                 toggleEditModal();
                 getAllServiceEventList(obj);
                }, 1000);
            }).catch(
                function (error) {
                    toast.error(error.response.data?.msg);
                }
            )
        }
        setForm(true);
    }

    const handleClearFile = (index) => {
        let attachFile = [...attachment];
        attachFile.splice(index,1);
        setAttachment(attachFile);
    }

    const handleDownload = async (url,name) => {
        const blobImage = await fetch(url)
           .then(r => r.blob())
           .catch((error) => console.log(error));
           
           if(blobImage)
           saveAs(blobImage, name);
    }

    return(
        <div>
            <ToastContainer autoClose={1000}/>
            <ModalDialog
                show={editShow}
                title={'Service Event'}
                closeDialog={toggleEditModal}
                onSubmit={onSubmit}>

                <Input inModal  value={eventTime} isInvalid={isFormSubmitted && eventTime === ''} 
                label='Event Time' type='datetime-local' placeholder='Enter Event Time' id='eventTime' 
                onChange={(e) => setEventTime(e.target.value)}></Input>
                <>
                    <Input inModal value={serviceTech}
                        isInvalid={isFormSubmitted && serviceTech === ''}
                        label='Service Technician' type='input'
                        placeholder='Enter Service Technician' id='serviceTech'
                        onChange={(e) => setServiceTech(e.target.value)} 
                    />
                    <Input inModal value={comments} isInvalid={isFormSubmitted && comments === ''} label='Comments' type='input' placeholder='Enter Comments' id='comments' onChange={(e) => setComments(e.target.value)}></Input>
                    <Input inModal value={cost} isInvalid={isFormSubmitted && cost === ''} label='Cost' type='input' placeholder='Enter Cost' id='cost' onChange={(e) => setCost(e.target.value)}></Input>
                </>
                <>
                    <Input inModal multiple={true} isInvalid={isFormSubmitted && attachment === ''} label='Attachment' type='file' id='attachment' onChange={(e) => handleUploadImage(e)}></Input>
                    <aside className="thumbsContainer">
                        {attachment && attachment.length>0 && attachment.map((file,index) => (<div className="thumb">
                            <div className="thumbInner">
                                <li>
                                    <a href={typeof(file) !== "string" && `${URL.createObjectURL(file)}`} onClick={() => {typeof(file) === "string" && handleDownload(file, getFileName(file))}} target="_blank" download >
                                        {(typeof(file) !== "string")
                                            ? file.name
                                            : getFileName(file)}
                                    </a>
                                    <span className="clearFile" value={file.name} onClick={() => handleClearFile(index)}><i className="fas fa-times-circle"></i></span>
                                </li>
                            </div>
                        </div>))}
                    </aside>
                </>

            </ModalDialog>
        </div>
    )
}

export default EditAssetServiceHistory;