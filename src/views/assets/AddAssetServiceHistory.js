import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import moment from "moment";

export function AddAssetServiceHistory({
  pageSize,
  pageIndex,
  show,
  toggleModal,
  addAssetServiceEvent,
  asset_id,
  assetServiceHistoryList,
  getAllServiceEventList,
}) {
  const currentTime = () => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [serviceTech, setServiceTech] = useState("");
  const [comments, setComments] = useState("");
  const [cost, setCost] = useState("");
  const [attachment, setAttachment] = useState([]);
  const [eventTime, setEventTime] = useState(currentTime());
  const [isFormSubmitted, setForm] = useState(false);

  const validateForm = () => {
    if (
      serviceTech !== "" &&
      comments !== "" &&
      cost !== "" &&
      eventTime !== ""
    ) {
      return true;
    }
    return false;
  };

  const handleUploadImage = (e) => {
    if (e.target.files) {
      const Data = Array.from(e.target.files);
      setAttachment([...attachment, ...Data]);
    }
  };

  const onSubmit = () => {
    const isValidForm = validateForm();
    let formData = new FormData();
    for (let i = 0; i < attachment.length; i++) {
      formData.append(`attachments`, attachment[i]);
    }
    formData.append("serviceTechnician", serviceTech);
    formData.append("comments", comments);
    formData.append("cost", cost);
    formData.append("eventTime", moment(eventTime).utc().format());
    formData.append("itemTagGuid", asset_id);
    let obj = {
      itemId: asset_id,
    };

    setForm(true);
    if (isValidForm) {
      addAssetServiceEvent(formData)
        .then((res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            // toast.success(res.msg)
          }
          setForm(false);
          setServiceTech("");
          setComments("");
          setCost("");
          setAttachment([]);
          setEventTime();
          setTimeout(() => {
            toggleModal();
            getAllServiceEventList(obj);
          }, 1000);
        })
        .catch(function (error) {
          toast.error(error.response.data?.msg);
        });
    }
    setForm(true);
  };

  const handleClearFile = (index) => {
    let attachFile = [...attachment];
    attachFile.splice(index, 1);
    setAttachment(attachFile);
  };

  // const handleDownload = async (name) => {
  //     // let url = assetServiceHistoryList[0].attachments.filter(img => img.name === name);
  //     // console.log(url);
  //     // const blobImage = await fetch(url)
  //     //    .then(r => r.blob())
  //     //    .catch((error) => console.log(error));

  //     //    if(blobImage)
  //     //    saveAs(blobImage, name);
  // }

  return (
    <div>
      <ToastContainer autoClose={1000} />
      <ModalDialog
        show={show}
        title={"Service Event"}
        closeDialog={toggleModal}
        onSubmit={onSubmit}
      >
        <Input
          inModal
          value={eventTime}
          isInvalid={isFormSubmitted && eventTime === ""}
          label="Service Time"
          id="eventTime"
          type="datetime-local"
          placeholder="Enter Service Time"
          onChange={(e) => setEventTime(e.target.value)}
        />

        <Input
          inModal
          value={serviceTech}
          isInvalid={isFormSubmitted && serviceTech === ""}
          label="Service Technician"
          type="input"
          placeholder="Enter Service Technician"
          id="serviceTech"
          onChange={(e) => setServiceTech(e.target.value)}
        />
        <Input
          inModal
          value={comments}
          isInvalid={isFormSubmitted && comments === ""}
          label="Comments"
          type="input"
          placeholder="Enter Comments"
          id="comments"
          onChange={(e) => setComments(e.target.value)}
        ></Input>
        <Input
          inModal
          value={cost}
          isInvalid={isFormSubmitted && cost === ""}
          label="Cost"
          type="input"
          placeholder="Enter Cost"
          id="cost"
          onChange={(e) => setCost(e.target.value)}
        ></Input>
        <Input
          inModal
          isInvalid={isFormSubmitted && attachment === ""}
          label="Attachment"
          type="file"
          multiple={true}
          id="attachment"
          onChange={(e) => handleUploadImage(e)}
        ></Input>
        <aside className="thumbsContainer">
          {attachment &&
            attachment.length > 0 &&
            attachment.map((file, index) => (
              <div className="thumb">
                <div className="thumbInner" key={index}>
                  <li>
                    {typeof file !== "string" && file.name}
                    <span
                      className="clearFile"
                      value={file.name}
                      onClick={() => handleClearFile(index)}
                    >
                      <i className="fas fa-times-circle"></i>
                    </span>
                  </li>
                </div>
              </div>
            ))}
        </aside>
      </ModalDialog>
    </div>
  );
}

export default AddAssetServiceHistory;
