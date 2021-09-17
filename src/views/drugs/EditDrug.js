import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Input from "../../commonComponents/Input";
import Multiselect from "multiselect-react-dropdown";
import DragAndDrop from "../../commonComponents/DragAndDrop";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProductServices from "../../service/CommonServices";

function EditDrug(props) {
  const { drug, match } = props;
  const options =
    props.categories.length > 0
      ? props.categories.map((i) => {
          return { name: i.name, id: i.id };
        })
      : [];
  const selectCategory = drug.productCategory
    ? drug.productCategory.map((item) => item.name)
    : [];
  const [name, setName] = useState(drug.name);
  const [image, setImage] = useState(drug.image ? drug.image : "");
  const [manufacturer, setManufacturer] = useState(drug.manufacturer);
  const [EAN, setEAN] = useState(drug.productCode);
  const [UNSPSC, setUNSPSC] = useState(drug.UNSPSCCode);
  const [NDC, setNDC] = useState(drug.ndc);
  const [dosage, setDosage] = useState(drug.dossage);
  const [strength, setStrength] = useState(drug.strength);
  const [content, setContent] = useState(drug.netContent);
  const [categories, setCategories] = useState(
    selectCategory.length > 0 ? selectCategory : []
  );
  const [description, setDescription] = useState(drug.description);
  const [isFormSubmitted, setForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isMatched, setIsMatched] = useState(false);

  useEffect(async () => {
    await props.getAllCategory();
    await props.getDrug(match.params.drug_id, "drug").then((data) => {
      setName(data.name);
      setManufacturer(data.manufacturer);
      setEAN(data.productCode);
      setUNSPSC(data.UNSPSCCode);
      setNDC(data.ndc);
      setDosage(data.dossage);
      setStrength(data.strength);
      setContent(data.netContent);
      setDescription(data.description);
      setCategories([
        ...data.productCategory.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      ]);
    });
  }, [match.params.drug_id]);


  /**
   * Return the selected category
   * @param {*} selectedList
   * @param {*} selectedItem
   */
  const onSelect = (selectedList, selectedItem) => {
    setCategories(selectedList);
  };

  const validateForm = () => {
    if (
      content !== "" &&
      name !== "" &&
      manufacturer !== "" &&
      description !== "" &&
      dosage !== "" &&
      strength !== "" &&
      EAN !== "" &&
      UNSPSC !== "" &&
      // categories.length &&
      // categories[0].name !== "" &&
      NDC !== ""
    ) {
      return true;
    }
    return false;
  };

  const resetForm = () => {
    setName("");
    setManufacturer("");
    setEAN("");
    setUNSPSC("");
    setNDC("");
    setDosage("");
    setStrength("");
    setContent("");
    // setCategories([]);
    setDescription("");
    setForm(false);
  };

  const onSubmit = () => {
    const isValidForm = validateForm();
    // const drugObj = {
    //     "name": name,
    //     "image": '',
    //     "description": description,
    //     "productCode": EAN,
    //     "unspsccode": UNSPSC,
    //     "ndc": NDC,
    //     "dossage": dosage,
    //     "strength": strength,
    //     "netContent": content,
    //     "category": categories.length ? categories.map(i => i.name): '',
    //     "expiryDate":  '2023-12-04',
    //     "manufacturer": manufacturer,
    //     "productType": 'drug'
    // }
    const drugObj = new FormData();
    drugObj.append("name", name);
    drugObj.append("description", description);
    drugObj.append("productCode", EAN);
    drugObj.append("UNSPSCCode", UNSPSC);
    drugObj.append("ndc", NDC);
    drugObj.append("dossage", dosage);
    drugObj.append("strength", strength);
    drugObj.append("netContent", content);
    // drugObj.append('category', selectedCategory);
    if(categories.length > 0){
      for (var i = 0; i < categories.length; i++) {
        drugObj.append(`category[${i}]`, categories[i].name);
      }
    }
    drugObj.append("expiryDate", "2023-12-04");
    drugObj.append("manufacturer", manufacturer);
    drugObj.append("productType", "drug");
    drugObj.append("image", image);

    if (isValidForm) {
      props
        .editDrug(drugObj, drug.GUID)
        .then((res) => {
          if (res.isError) {
            toast.error(res.msg);
          } else {
            // toast.success(res.msg);
          }
          setTimeout(() => {
            resetForm();
            props.history.push("/drugs");
          }, 1000);
        })
        .catch(function (error) {
          toast.error(error.response.data?.msg);
        });
    }

    setForm(true);
  };

  const onAddCategory = () => {
    let newCategories = [...categories];
    let data = { name: newCategory, id: "" };
    let isMatched = options.find((i) => i.name === newCategory);
    if (!isMatched) {
      newCategories.push(data);
      setCategories(newCategories);
      options.push(data);
      setNewCategory("");
      setIsMatched(false);
    } else {
      setIsMatched(true);
    }
  };

  const getImage = (file, imageData) => {
    imageData ? setImage(props.image ? props.image : imageData) : "";
  };

  return (
    <div>
      <ToastContainer autoClose={1000} />
      <div>
        <DragAndDrop imageUpload={getImage} {...props.drug}></DragAndDrop>
      </div>
      <Form className="form-group-action" onSubmit={onSubmit}>
        <Input
          label="NAME"
          value={name}
          isInvalid={isFormSubmitted && name === ""}
          type="input"
          placeholder="Enter disposable name"
          id="name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
        <Input
          label="Manufacturer"
          value={manufacturer}
          isInvalid={isFormSubmitted && manufacturer === ""}
          type="input"
          placeholder="Enter manufacturer"
          id="manufacturer"
          onChange={(e) => setManufacturer(e.target.value)}
        ></Input>
        <Input
          label="EAN/UPC/GTIN"
          value={EAN}
          isInvalid={isFormSubmitted && EAN === ""}
          type="input"
          placeholder="Enter EAN/UPC/GTIN"
          id="ean"
          onChange={(e) => setEAN(e.target.value)}
        ></Input>
        <Input
          label="UNSPSC Code"
          value={UNSPSC}
          isInvalid={isFormSubmitted && UNSPSC === ""}
          type="input"
          placeholder="Enter UNPSC Code"
          id="unpsc"
          onChange={(e) => setUNSPSC(e.target.value)}
        ></Input>
        <Input
          label="NDC"
          value={NDC}
          isInvalid={isFormSubmitted && NDC === ""}
          type="input"
          placeholder="Enter NDC"
          id="model"
          onChange={(e) => setNDC(e.target.value)}
        ></Input>
        <Input
          label="Dosage"
          value={dosage}
          isInvalid={isFormSubmitted && dosage === ""}
          type="input"
          placeholder="Enter Dosage"
          id="brand"
          onChange={(e) => setDosage(e.target.value)}
        ></Input>
        <Input
          label="Strength"
          value={strength}
          isInvalid={isFormSubmitted && strength === ""}
          type="input"
          placeholder="Enter Strength"
          id="brand"
          onChange={(e) => setStrength(e.target.value)}
        ></Input>
        <Input
          label="Net Content"
          value={content}
          isInvalid={isFormSubmitted && content === ""}
          type="input"
          placeholder="Enter net content"
          id="content"
          onChange={(e) => setContent(e.target.value)}
        ></Input>
        <Form.Group>
          <Form.Label column sm="2">
            Categories <span className="dropdown_header">(Optional)</span>
          </Form.Label>
          <Col sm="6">
            <Multiselect
              options={options}
              onSelect={onSelect}
              onRemove={onSelect}
              displayValue="name"
              placeholder={categories.length > 0 ? "" : "Select Category"}
              selectedValues={categories.length > 0 ? categories : ""}
            />
          </Col>
          {/* {isFormSubmitted && !categories.length && (
            <i className="fas fa-exclamation-circle"></i>
          )} */}
        </Form.Group>
        <Form.Group>
          <Form.Label column sm={"2"}></Form.Label>
          <Col sm={"4"}>
            <Form.Control
              value={newCategory}
              type={"input"}
              isInvalid={isMatched}
              placeholder={"Add New Category"}
              id={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setIsMatched(false);
              }}
            />
            {isMatched && (
              <span column sm={`1`} className="danger-action">
                {" "}
                {newCategory + " is already in categories."}
              </span>
            )}
          </Col>
          {newCategory !== "" && (
            <Button variant="primary" onClick={onAddCategory}>
              Add Category
            </Button>
          )}
        </Form.Group>
        <Input
          label="Description"
          value={description}
          isInvalid={isFormSubmitted && description === ""}
          type="textarea"
          placeholder="Enter Description"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
        ></Input>
        <div className="form-action">
          <Button variant="primary" onClick={onSubmit}>
            Save
          </Button>
          <Button variant="secondary" className="closeBtn">
            <Link to="/drugs">Close</Link>
          </Button>
        </div>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { categories } = state.drugsReducer;
  const { drug } = state.drugItemReducer;
  return {
    categories,
    drug,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editDrug: (drugObj, id) =>
      dispatch(ProductServices.updateProduct(drugObj, id)),
    getDrug: (drug_id, productType) =>
      dispatch(ProductServices.getProductByID(drug_id, productType)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDrug);
