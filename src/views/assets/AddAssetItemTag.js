import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "commonComponents/Select";
import { assetStatusOption } from "Constant/Column";
import { connect } from 'react-redux';
import ProductServices from "../../service/CommonServices";

function AddAssetItemTag(props) {
  const {
    pageSize,
    pageIndex,
    show,
    toggleModal,
    asset_id,
    getAllLotNumber,
    getAssetItems
  } = props;
  const [epc, setEPC] = useState("");
  const [assetId, setAssetId] = useState("");
  const [serial, setSerial] = useState("");
  const [lot, setLot] = useState("");
  const [vendor, setVendor] = useState("");
  const [department, setDepartment] = useState("");
  const [vendorNumber, setVendorNumber] = useState("");
  const [date, setDate] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [status, setStatus] = useState("");
  const [isFormSubmitted, setForm] = useState(false);

  const validateForm = () => {
    if (
      epc !== "" &&
      assetId !== "" &&
      department !== "" &&
      vendor !== "" &&
      vendorNumber !== "" &&
      manufactureDate !== "" &&
      purchaseDate !== "" &&
      serial !== "" &&
      status !== "" &&
      lot !== "" &&
      date !== ""
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    const { addProductItemTag} = props;
    const isValidForm = validateForm();
    const assetObj = {
      itemEPC: epc,
      assetId: assetId,
      serialNumber: serial,
      manufactureDate: manufactureDate,
      purchaseDate: purchaseDate,
      lotNumber: lot,
      vendorNumber: vendorNumber,
      expirationDate: date,
      department: department,
      vendor: vendor,
      status: status,
      productGuid : asset_id,
    };

    setForm(true);
    if (isValidForm) {
      addProductItemTag(assetObj, "asset")
        .then((res) => {
          if(res.isError){
            toast.error(res.msg)
          }else{
            // toast.success(res.msg)
          }
          setForm(false);
          setEPC("");
          setSerial("");
          setAssetId("");
          setDepartment("");
          setVendorNumber("");
          setManufactureDate("");
          setPurchaseDate("");
          setDate("");
          setLot("");
          setVendor("");
          setStatus('')
          setTimeout(() => {
            toggleModal();
            getAssetItems()
            props.getAsset(asset_id, "asset");
            getAllLotNumber(asset_id);
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
       <ToastContainer autoClose={1000}/>
      <ModalDialog
        show={show}
        title={"Add Asset item"}
        closeDialog={toggleModal}
        onSubmit={onSubmit}
      >
        <div>
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
            value={assetId}
            isInvalid={isFormSubmitted && assetId === ""}
            label="Asset ID"
            type="input"
            placeholder="Enter Asset Id"
            id="assetId"
            onChange={(e) => setAssetId(e.target.value)}
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
            value={vendor}
            isInvalid={isFormSubmitted && vendor === ""}
            label="Vendor"
            type="input"
            placeholder="Enter Vendor"
            id="vendor"
            onChange={(e) => setVendor(e.target.value)}
          ></Input>
          <Input
            inModal
            value={vendorNumber}
            isInvalid={isFormSubmitted && vendorNumber === ""}
            label="Vendor Number"
            type="input"
            placeholder="Enter Vendor number"
            id="vendorNumber"
            onChange={(e) => setVendorNumber(e.target.value)}
          ></Input>
          <Input
            inModal
            value={department}
            isInvalid={isFormSubmitted && department === ""}
            label="Department"
            type="input"
            placeholder="Enter Department"
            id="department"
            onChange={(e) => setDepartment(e.target.value)}
          ></Input>
          <Input
            inModal
            value={manufactureDate}
            isInvalid={isFormSubmitted && manufactureDate === ""}
            label="Manufacture Date"
            type="date"
            placeholder="Enter Manufacture Date"
            id="manufactureDate"
            onChange={(e) => setManufactureDate(e.target.value)}
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
          <Input
            inModal
            value={purchaseDate}
            isInvalid={isFormSubmitted && purchaseDate === ""}
            label="Purchase date"
            type="date"
            placeholder="Enter Purchase date"
            id="purchaseDate"
            onChange={(e) => setPurchaseDate(e.target.value)}
          ></Input>
          <Select
            inModal
            value={status}
            isInvalid={isFormSubmitted && status === ""}
            label="Status"
            optionValue={assetStatusOption}
            placeholder="Enter Status"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
          ></Select>
        </div>
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
      getAsset: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType)),
      addProductItemTag: (obj, productType) => dispatch(ProductServices.addProductItemTag(obj, productType))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(AddAssetItemTag);
