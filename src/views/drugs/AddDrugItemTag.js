import ModalDialog from "../../commonComponents/ModalDialog";
import { ToastContainer, toast } from "react-toastify";
import Input from "../../commonComponents/Input";
import React, { useState } from "react";
import { connect } from "react-redux";
import ProductServices from "../../service/CommonServices";

export function AddDrugItemTag(props) {
  const {
    show,
    toggleModal,
    drug_id,
    getDrugItems, 
    getAllLotNumber,
  } = props;
  const [epc, setEPC] = useState("");
  const [serial, setSerial] = useState("");
  const [lot, setLot] = useState("");
  const [date, setDate] = useState("");
  const [isFormSubmitted, setForm] = useState(false);

  const validateForm = () => {
    if (epc !== "" && serial !== "" && lot !== "" && date !== "") {
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    const { addProductItemTag } = props;
    const isValidForm = validateForm();
    const drugObj = {
      itemEPC: epc,
      serialNumber: serial,
      lotNumber: lot,
      // location: "Add1",
      expirationDate: date,
      status: "active",
      productGuid: drug_id,
    };

    setForm(true);
    if (isValidForm) {
      addProductItemTag(drugObj, "drug")
        .then((res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            toast.success(res.msg);
          }
          setForm(false);
          setEPC("");
          setSerial("");
          setLot("");
          setDate("");
          setTimeout(async() => {
            await toggleModal();
            await getDrugItems();
            await getAllLotNumber(drug_id);
            await props.getDrug(drug_id, "drug");
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
        show={show}
        title={"Add Drug item"}
        closeDialog={toggleModal}
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
        />
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
        />
        <Input
          inModal
          value={date}
          isInvalid={isFormSubmitted && date === ""}
          label="Expiry Date"
          type="date"
          id="date"
          onChange={(e) => setDate(e.target.value)}
        ></Input>
      </ModalDialog>
    </div>
  );
}

const mapStateToProps = (state) => {
    const { lotNumber } = state.lotNumberReducer;
    return {
        lotNumber
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllLotNumber: (id) => dispatch(ProductServices.getAllLotNumber(id)),
        getDrug: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType)),
        addProductItemTag: (obj, productType) => dispatch(ProductServices.addProductItemTag(obj, productType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDrugItemTag);
