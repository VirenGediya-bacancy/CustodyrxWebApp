import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Input from "../../commonComponents/Input";
import Multiselect from "multiselect-react-dropdown";
import DragAndDrop from "../../commonComponents/DragAndDrop";
import disposablesService from "service/DisposablesService";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import ProductServices from 'service/CommonServices';
import Title from "commonComponents/Title";


function AddDisposable(props) {
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
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [modelNo, setModelNo] = useState("");
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
        brandName !== "" &&
        modelNo !== "" &&
        content !== "" &&
        EAN !== "" &&
        UNSPSC !== "" 
        // &&
        // categories.length
        // ? categories[0].name
        // : "" !== ""
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
    setBrandName("");
    setModelNo("");
    setContent("");
    setCategories([]);
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

    const disposableObj = new FormData();
    disposableObj.append('name', name);
    disposableObj.append('description', description);
    disposableObj.append('productCode', EAN);
    disposableObj.append('UNSPSCCode', UNSPSC);
    disposableObj.append('modelNumber', modelNo);
    disposableObj.append('brand', brandName);
    disposableObj.append('netContent', content);
    // disposableObj.append('category', categories.length ? categories.map((item) => item.name) : '');
    if(categories.length > 0){
        for (var i = 0; i < categories.length; i++) {
          disposableObj.append(`category[${i}]`, categories[i].name);
      }
    }
    // disposableObj.append('expiryDate', '2023-12-04');
    disposableObj.append('manufacturer', manufacturer);
    disposableObj.append('productType', 'disposable');
    image !== "" && disposableObj.append("image", image);

    if (isValidForm) {
      props
        .addDisposable(disposableObj, "disposable")
        .then((res) => {
          if (res) {
            if(res.isError){
              toast.error(res.msg)
            }else{
              // toast.success(res.msg)
            }
            // props.history.goBack();
            resetForm()
            setTimeout(() => {
            props.history.push('/disposables')
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
    imageData ? setImage(imageData) : ""
    // file ? localStorage.setItem(imageData.name, file) : ''
  }

  return (
    <div>
      <ToastContainer autoClose={1000}/>
      <Title title={"New Disposable"} isActiveFlage={false}/>
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
            label="Model/Part Number"
            value={modelNo}
            isInvalid={isFormSubmitted && modelNo === ""}
            type="input"
            placeholder="Enter Model/Part Number"
            id="model"
            onChange={(e) => setModelNo(e.target.value)}
          ></Input>
          <Input
            label="Brand"
            value={brandName}
            isInvalid={isFormSubmitted && brandName === ""}
            type="input"
            placeholder="Enter brand"
            id="brand"
            onChange={(e) => setBrandName(e.target.value)}
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
              <Link to="/disposables">Close</Link>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { categories } = state.disposablesReducer;
  return {
    categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addDisposable: (disposableObj, productType) => dispatch(ProductServices.addProduct(disposableObj, productType)), //disposablesService.addDisposable(disposableObj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddDisposable));
