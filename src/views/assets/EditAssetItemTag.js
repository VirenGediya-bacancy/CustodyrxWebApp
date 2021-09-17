import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ModalDialog from "../../commonComponents/ModalDialog";
import Input from "../../commonComponents/Input";
import moment from "moment";
import Select from "commonComponents/Select";
import { assetStatusOption } from "Constant/Column";

export function EditAssetItemTag({
  pageSize,
  pageIndex,
  editShow,
  toggleEditModal,
  updateAssetItemTag,
  itemTagId,
  asset_id,
  getAssetItemTagList,
  getAssetItemTag,
}) {
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

  useEffect(() => {
    if(editShow){
      getAssetItemTag(itemTagId).then((tag) => {
      setEPC(tag.itemEPC);
      setSerial(tag.serialNumber);
      setLot(tag.lotNumber);
      setAssetId(tag.assetId);
      setVendor(tag.vendor);
      setStatus(tag.status);
      setVendorNumber(tag.vendorNumber);
      setManufactureDate(
        // moment(tag.manufactureDate).format("YYYY-MM-DD[T]HH:mm")
        moment(tag.manufactureDate).utc().format("YYYY-MM-DD")
      );
      setDepartment(tag.department);
      // setPurchaseDate(moment(tag.purchaseDate).format("YYYY-MM-DD[T]HH:mm"));
      setPurchaseDate(moment(tag.purchaseDate).utc().format("YYYY-MM-DD"));
      // setDate(moment(tag.expirationDate).format("YYYY-MM-DD[T]HH:mm"));
      setDate(moment(tag.expirationDate).utc().format("YYYY-MM-DD"));
    });
  }
  }, [itemTagId, editShow]);

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
      productId: asset_id,
    };

    setForm(true);

    if (isValidForm) {
      updateAssetItemTag(assetObj, itemTagId)
        .then((res) => {
          if(res.isError){
            toast.error(res.msg)
          }else{
            // toast.success(res.msg)
          }
          setForm(false);
          setEPC("");
          setAssetId("");
          setSerial("");
          setVendorNumber("");
          setManufactureDate("");
          setPurchaseDate("");
          setStatus("");
          setDate("");
          setLot("");
          setVendor("");
          setDepartment("");
          setTimeout(async() => {
            await getAssetItemTag(itemTagId, "asset");
            toggleEditModal();
          }, 1000);
          // getAssetItemTagList(obj);
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
        show={editShow}
        title={"Edit Asset item"}
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
        />
        <Input
          inModal
          value={assetId}
          isInvalid={isFormSubmitted && assetId === ""}
          label="Asset ID"
          type="input"
          placeholder="Enter Last Check-in"
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
          // disabled={true}
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
      </ModalDialog>
    </div>
  );
}

export default EditAssetItemTag;
