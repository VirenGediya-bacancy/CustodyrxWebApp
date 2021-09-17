import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Input from "../../commonComponents/Input";
import Multiselect from "multiselect-react-dropdown";
import DragAndDrop from "../../commonComponents/DragAndDrop";
import drugsService from ".././../service/DrugsService";

import ProductServices from '.././../service/CommonServices';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Title from "commonComponents/Title";

function AddDrug(props) {
  // const options = [{name: 'Option 1', id: 1},{name: 'Option 2️', id: 2}]
  const options =
    props.categories.length > 0
      ? props.categories.map((i) => {
          return { name: i.name, id: i.id };
        })
      : [];
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [EAN, setEAN] = useState("");
  const [UNSPSC, setUNSPSC] = useState("");
  const [NDC, setNDC] = useState("");
  const [dosage, setDosage] = useState("");
  const [strength, setStrength] = useState("");
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMatched, setIsMatched] = useState(false);
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setForm] = useState(false);

  /**
   * Return the selected category
   * @param {*} selectedList
   * @param {*} selectedItem
   */
  const onSelect = (selectedList, selectedItem) => {
    setCategories(selectedList);
  };

  useEffect(() => {
    props.getAllCategory();
  }, []);

  const validateForm = () => {
    if (
      name !== "" &&
      manufacturer !== "" &&
      description !== "" &&
      dosage !== "" &&
      strength !== "" &&
      content !== "" &&
      EAN !== "" &&
      UNSPSC !== "" &&
      // categories.length
      //   ? categories[0].name
      //   : "" !== "" &&
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

  const onSubmit = () => {
    const isValidForm = validateForm();
    //   const drugObj = {
    //       "name": name,
    //       "image": '',
    //       "description": description,
    //       "productCode": EAN,
    //       "unspsccode": UNSPSC,
    //       "ndc": NDC,
    //       "dossage": dosage,
    //       "strength": strength,
    //       "netContent": content,
    //       "category": categories.length ? categories.map(item => item.name) : '',
    //       "expiryDate":  '2023-12-04',
    //       "manufacturer": manufacturer,
    //       "productType": 'drug'
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
    if(categories.length > 0){
        for (var i = 0; i < categories.length; i++) {
        drugObj.append(`category[${i}]`, categories[i].name);
      }
    }
    // drugObj.append("expiryDate", "2023-12-04");
    drugObj.append("manufacturer", manufacturer);
    drugObj.append("productType", "drug");
    image !== "" && drugObj.append("image", image);

    if (isValidForm) {
      props
        .addDrug(drugObj, "drug")
        .then((res) => {
          if (res) {
            if(res.isError){
              toast.error(res.msg)
            }else{
              // toast.success(res.msg)
            }
            setTimeout(() => {
              resetForm();
              props.history.push("/drugs");
            }, 1000);
          }
        })
        .catch(function (error) {
          toast.error(error.response.data?.msg);
        });
    }

    setForm(true);
  };

  const getImage = (file, imageData) => {
    imageData ? setImage(imageData) : "";
  };

  return (
    <div>
      <ToastContainer autoClose={1000}/>
      <Title isActiveFlage={false} title={"New Drug"} />
      <div className="registration_form">
        <div>
          <DragAndDrop imageUpload={getImage}></DragAndDrop>
        </div>
        <Form className="form-group-action" onSubmit={onSubmit}>
          <Input
            label="NAME"
            value={name}
            isInvalid={isFormSubmitted && name === ""}
            type="input"
            placeholder="Enter drug name"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Manufacturer"
            value={manufacturer}
            isInvalid={isFormSubmitted && manufacturer === ""}
            type="input"
            placeholder="Enter manufacturer"
            id="manufacturer"
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <Input
            label="EAN/UPC/GTIN"
            value={EAN}
            isInvalid={isFormSubmitted && EAN === ""}
            type="input"
            placeholder="Enter EAN/UPC/GTIN"
            id="ean"
            onChange={(e) => setEAN(e.target.value)}
          />
          <Input
            label="UNSPSC Code"
            value={UNSPSC}
            isInvalid={isFormSubmitted && UNSPSC === ""}
            type="input"
            placeholder="Enter UNPSC Code"
            id="unpsc"
            onChange={(e) => setUNSPSC(e.target.value)}
          />
          <Input
            label="NDC"
            value={NDC}
            isInvalid={isFormSubmitted && NDC === ""}
            type="input"
            placeholder="Enter NDC"
            id="model"
            onChange={(e) => setNDC(e.target.value)}
          />
          <Input
            label="Dosage"
            value={dosage}
            isInvalid={isFormSubmitted && dosage === ""}
            type="input"
            placeholder="Enter Dosage"
            id="brand"
            onChange={(e) => setDosage(e.target.value)}
          />
          <Input
            label="Strength"
            value={strength}
            isInvalid={isFormSubmitted && strength === ""}
            type="input"
            placeholder="Enter Strength"
            id="brand"
            onChange={(e) => setStrength(e.target.value)}
          />
          <Input
            label="Net Content"
            value={content}
            isInvalid={isFormSubmitted && content === ""}
            type="input"
            placeholder="Enter net content"
            id="content"
            onChange={(e) => setContent(e.target.value)}
          />
          <Form.Group>
            <Form.Label column sm="2">
              Categories <span className="dropdown_header">(Optional)</span>
            </Form.Label>
            <Col sm="6">
              <Multiselect
                options={options}
                selectedValues={categories.length > 0 ? categories : ""}
                onSelect={onSelect}
                onRemove={onSelect}
                placeholder={categories.length > 0 ? "" : "Select Category"}
                displayValue="name"
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
    </div>
  );
}

const mapStateToProps = (state) => {
  const { categories } = state.drugsReducer;
  return {
    categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addDrug: (drugObj, productType) => dispatch(ProductServices.addProduct(drugObj, productType)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddDrug)
);
