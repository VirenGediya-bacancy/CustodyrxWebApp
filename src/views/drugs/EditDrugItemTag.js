import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

export function EditDrugItemTag({
  drugItemTag,
  editShow,
  toggleEditModal,
  updateDrugItemTag,
  itemTagId,
  drug_id,
  getDrugItemTagList,
  getDrugItemTag,
}) {
  const [epc, setEPC] = useState(
    drugItemTag.itemEPC ? drugItemTag.itemEPC : ""
  );
  const [serial, setSerial] = useState(
    drugItemTag.serialNumber ? drugItemTag.serialNumber : ""
  );
  const [lot, setLot] = useState(
    drugItemTag.lotNumber ? drugItemTag.lotNumber : ""
  );
  const [date, setDate] = useState(
    drugItemTag.expirationDate
      // ? moment(drugItemTag.expirationDate).format("YYYY-MM-DD[T]HH:mm")
      ? moment(drugItemTag.expirationDate).utc().format("YYYY-MM-DD")
      : ""
  );
  const [isFormSubmitted, setForm] = useState(false);

  useEffect(() => {
    setEPC(drugItemTag.itemEPC);
    setSerial(drugItemTag.serialNumber);
    setLot(drugItemTag.lotNumber);
    // setDate(moment(drugItemTag.expirationDate).format("YYYY-MM-DD[T]HH:mm"));
    setDate(moment(drugItemTag.expirationDate).utc().format("YYYY-MM-DD"));
  }, [itemTagId, editShow]);

  const validateForm = () => {
    if (epc !== "" && serial !== "" && lot !== "" && date !== "") {
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    const isValidForm = validateForm();
    const drugObj = {
      itemEPC: epc,
      serialNumber: serial,
      lotNumber: lot,
      expirationDate: date,
      status: "active",
      // productId: drug_id,
      // location: "Add11",
    };

    setForm(true);

    if (isValidForm) {
      updateDrugItemTag(drugObj, itemTagId)
        .then(async (res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            // toast.success(res.msg);
          }
          setForm(false);
          setEPC("");
          setSerial("");
          setLot("");
          setTimeout(async () => {
            await getDrugItemTag();
            // await getDrugItemTagList();
            await toggleEditModal();
          }, 1000);
        })
        .catch(function (error) {
          toast.error(error.response.data?.msg);
        });
    }
    setForm(true);
  };

  return (
    <div>
      <ToastContainer autoClose={1000} />
      <ModalDialog
        show={editShow}
        title={"Edit Drug item"}
        closeDialog={toggleEditModal}
        onSubmit={onSubmit}
      >
        <Input
          inModal
          value={epc}
          isInvalid={isFormSubmitted && epc === ""}
          label="Item EPC"
          type="input"
          placeholder="Enter EPC"
          id="EPC"
          onChange={(e) => setEPC(e.target.value)}
        ></Input>
        <Input
          inModal
          value={serial}
          isInvalid={isFormSubmitted && serial === ""}
          label="Serial Number"
          type="input"
          placeholder="Enter serial number"
          id="serial"
          onChange={(e) => setSerial(e.target.value)}
        ></Input>
        <Input
          inModal
          value={lot}
          isInvalid={isFormSubmitted && lot === ""}
          label="Lot Number"
          type="input"
          placeholder="Enter lot number"
          id="lot"
          onChange={(e) => setLot(e.target.value)}
        ></Input>
        <Input
          inModal
          value={date}
          isInvalid={isFormSubmitted && date === ""}
          label="Expiry date"
          type="date"
          placeholder="Enter Expiry date"
          id="date"
          onChange={(e) => setDate(e.target.value)}
        ></Input>
      </ModalDialog>
    </div>
  );
}

export default EditDrugItemTag;
