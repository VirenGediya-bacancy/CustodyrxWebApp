import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import ProductServices from "../../service/CommonServices";

function AddDisposableItemTag(props) {
  const {
    show,
    toggleModal,
    disposable_id,
    getAllLotNumber,
    getDisposableItems,
    pageSize,
    pageIndex,
  } = props;
  const [epc, setEPC] = useState("");
  const [lot, setLot] = useState("");
  const [date, setDate] = useState("");
  const [isFormSubmitted, setForm] = useState(false);

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
      // lastCheckInNumber: lastCheckIn,
      lotNumber: lot,
      // location: "Add1",
      expirationDate: date,
      status: "active",
      productGuid: disposable_id,
    };

    setForm(true);

    if (isValidForm) {
      props
        .addProductItemTag(disposableObj, "disposable")
        .then((res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            // toast.success(res.msg);
          }
          setForm(false);
          setEPC("");
          setLot("");
          setDate("");
          setTimeout(() => {
            toggleModal();
            getDisposableItems();
            props.getDisposable(disposable_id,"disposable");
            getAllLotNumber(disposable_id);
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
        title={"Add Disposable item"}
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
        ></Input>
        {/* <Input inModal value={lastCheckIn} isInvalid={isFormSubmitted && lastCheckIn === ''} label='Last Check-In Number' type='input' placeholder='Enter Last Check-In number' id='lastCheckIn' onChange={(e) => setlastCheckIn(e.target.value)}></Input> */}
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

const mapStateToProps = (state) => {
  const { lotNumber } = state.lotNumberReducer;
  return {
    lotNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllLotNumber: (id) => dispatch(ProductServices.getAllLotNumber(id)),
    addProductItemTag: (obj, productType) =>
      dispatch(ProductServices.addProductItemTag(obj, productType)),
    getDisposable: (id, productType) => dispatch(ProductServices.getProductByID(id, productType))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDisposableItemTag);
