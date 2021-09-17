import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

export function EditDisposableItemTag({
  pageSize,
  pageIndex,
  editShow,
  toggleEditModal,
  updateDisposableItemTag,
  itemTagId,
  disposable_id,
  getDisposableItemTagList,
  getDisposableItemTag,
}) {
  const [epc, setEPC] = useState("");
  // const [lastCheckIn, setlastCheckIn] = useState("");
  const [lot, setLot] = useState("");
  const [date, setDate] = useState("");
  const [isFormSubmitted, setForm] = useState(false);

  useEffect(() => {
    if (editShow) {
      getDisposableItemTag(itemTagId).then((tag) => {
        setEPC(tag.itemEPC);
        // setlastCheckIn(tag.lastCheckIn);
        setLot(tag.lotNumber);
        // setDate(moment(tag.expirationDate).format("YYYY-MM-DD[T]HH:mm"));
        setDate(moment(tag.expirationDate).utc().format("YYYY-MM-DD"));
      });
    }
  }, [itemTagId, editShow]);

  const validateForm = () => {
    if (epc !== "" && lot !== "" && date !== "") {
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    const isValidForm = validateForm();
    const disposableObj = {
      itemEPC: epc,
      // lastCheckIn: lastCheckIn,
      lotNumber: lot,
      expirationDate: date,
      status: "active",
      productId: disposable_id,
    };

    setForm(true);
    if (isValidForm) {
      updateDisposableItemTag(disposableObj, itemTagId)
        .then(async(res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            // toast.success(res.msg);
          }
            setForm(false);
            setEPC("");
            // setlastCheckIn(""); 
            setLot("");
            setTimeout(async() => {
              await getDisposableItemTag(itemTagId, "disposable");
              toggleEditModal();
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
        title={"Edit Disposable item"}
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
        {/* <Input
          inModal
          value={lastCheckIn}
          isInvalid={isFormSubmitted && lastCheckIn === ""}
          label="Last Check-In"
          type="input"
          placeholder="Enter Last Check-In number"
          id="lastCheckIn"
          onChange={(e) => setlastCheckIn(e.target.value)}
        ></Input> */}
        <Input
          inModal
          value={lot}
          isInvalid={isFormSubmitted && lot === ""}
          label="Lot/Batch Number"
          type="input"
          placeholder="Enter Lot/Batch number"
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

export default EditDisposableItemTag;
