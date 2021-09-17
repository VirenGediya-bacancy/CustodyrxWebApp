import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import Input from '../../commonComponents/Input';
import Multiselect from 'multiselect-react-dropdown';
import DragAndDrop from '../../commonComponents/DragAndDrop';
import disposablesService from 'service/DisposablesService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ProductServices from "service/CommonServices";

function EditDisposable(props) {
    // const options = [{ name: 'Option 1', id: 1 }, { name: 'Option 2️', id: 2 }]
    const options = props.categories.length > 0 ? props.categories.map((i) => { return { name: i.name, id: i.id } }) : [];
    const [image, setImage] = useState(props.disposable.image ? props.disposable.image : '');
    const [name, setName] = useState(props.disposable.name);
    const [manufacturer, setManufacturer] = useState(props.disposable.manufacturer);
    const [EAN, setEAN] = useState(props.disposable.productCode);
    const [UNSPSC, setUNSPSC] = useState(props.disposable.UNSPSCCode);
    const [brandName, setBrandName] = useState(props.disposable.brand);
    const [modelNo, setModelNo] = useState(props.disposable.modelNumber);
    const [content, setContent] = useState(props.disposable.netContent);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isMatched, setIsMatched] = useState(false);
    const [description, setDescription] = useState(props.disposable.description);
    const [isFormSubmitted, setForm] = useState(false);

    useEffect(async () => {
        await props.getAllCategory();
        await props.getDisposable(props.match.params.disposable_id).then((data) => {
            setName(data.name);
            setManufacturer(data.manufacturer);
            setEAN(data.productCode);
            setUNSPSC(data.UNSPSCCode);
            setModelNo(data.modelNumber);
            setBrandName(data.brand);
            setContent(data.netContent);
            setDescription(data.description);
            setImage(data.image);
            setCategories([...data.productCategory.map(item => ({id : item.id, name: item.name}))]);
        });
    }, [props.match.params.disposable_id])

    // useEffect(async () => {
    //     await props.getAllCategory();
    //     let newCategories = [];
    //     props.disposable.category && props.disposable.category.length > 0 && props.disposable.category.forEach(i => {
    //         let data = props.categories.find(item => item.name === i);
    //         if (data) {
    //             newCategories.push({ name: data.name, id: data.id });
    //         }
    //     });
    //     setCategories(newCategories);
    // }, []);


    /**
     * Return the selected category
     * @param {*} selectedList 
     * @param {*} selectedItem 
     */
    const onSelect = (selectedList, selectedItem) => {
        setCategories(selectedList);
    }

    const validateForm = () => {
        if (
            content !== "" &&
            name !== "" &&
            manufacturer !== "" &&
            description !== "" &&
            brandName !== "" &&
            modelNo !== "" &&
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
        let data = { name: newCategory, id: "" }
        let isMatched = options.find(i => i.name === newCategory);
        if (!isMatched) {
            newCategories.push(data);
            setCategories(newCategories);
            options.push(data);
            setNewCategory("");
            setIsMatched(false);
        } else {
            setIsMatched(true);
        }
    }


    const onSubmit = () => {
        const isValidForm = validateForm();
        // const disposableObj = {
        //     "name": name,
        //     "image": '',
        //     "description": description,
        //     "productCode": EAN,
        //     "unspsccode": UNSPSC,
        //     "ndc": NDC,
        //     "dossage": dosage,
        //     "strength": strength,
        //     "netContent": content,
        //     "category": categories.length ? categories.map(item => item.name) : '',
        //     "expiryDate": '2023-12-04',
        //     "manufacturer": manufacturer,
        //     "productType": 'disposable'
        // }

        const disposableObj = new FormData();
        disposableObj.append('name', name);
        disposableObj.append('description', description);
        disposableObj.append('productCode', EAN);
        disposableObj.append('UNSPSCCode', UNSPSC);
        disposableObj.append('modelNo', modelNo);
        disposableObj.append('brand', brandName);
        disposableObj.append('netContent', content);
        if(categories.length > 0){
            for (var i = 0; i < categories.length; i++) {
                disposableObj.append(`category[${i}]`, categories[i].name);
            }
        }
        disposableObj.append('expiryDate', '2023-12-04');
        disposableObj.append('manufacturer', manufacturer);
        disposableObj.append('productType', 'disposable');
        disposableObj.append('image', image);
       
        if (isValidForm) {
            props.editDisposable(disposableObj, props.disposable.GUID).then((res) => {
                if (res) {
                    // props.history.goBack();
                    if(res.isError){
                        toast.error(res.msg)
                      }else{
                        // toast.success(res.msg)
                      }
                      setTimeout(() => {
                        props.history.push('/disposables')
                      }, 1000);
                }
            }).catch(
                function (error) {
                    toast.error(error.response.data?.msg);
                }
            )

        }

        setForm(true)
    }

    const getImage = (file, imageData) => {
        imageData ? setImage(imageData) : ''
        
    }
    return (
        <div>
            <ToastContainer autoClose={1000} />
            <div>
                <DragAndDrop imageUpload={getImage} {...props.disposable}></DragAndDrop>
            </div>
            <Form className='form-group-action' onSubmit={onSubmit}>
                <Input
                    label='NAME'
                    value={name}
                    isInvalid={isFormSubmitted && name === ''}
                    type='input' placeholder='Enter disposable name'
                    id='name' onChange={(e) => setName(e.target.value)}
                ></Input>
                <Input
                    label='Manufacturer'
                    value={manufacturer}
                    isInvalid={isFormSubmitted && manufacturer === ''}
                    type='input'
                    placeholder='Enter manufacturer'
                    id='manufacturer'
                    onChange={(e) => setManufacturer(e.target.value)}
                ></Input>
                <Input
                    label='EAN/UPC/GTIN'
                    value={EAN}
                    isInvalid={isFormSubmitted && EAN === ''}
                    type='input'
                    placeholder='Enter EAN/UPC/GTIN'
                    id='ean'
                    onChange={(e) => setEAN(e.target.value)}
                ></Input>
                <Input
                    label='UNSPSC Code'
                    value={UNSPSC}
                    isInvalid={isFormSubmitted && UNSPSC === ''}
                    type='input'
                    placeholder='Enter UNPSC Code'
                    id='unpsc'
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
                    label='Net Content'
                    value={content}
                    isInvalid={(isFormSubmitted && content === '')} //(isNaN(content) || content === '')
                    type='input'
                    placeholder='Enter net content'
                    id='content'
                    onChange={(e) => setContent(e.target.value)}
                ></Input>
                <Form.Group >
                    <Form.Label column sm="2">Categories  <span className="dropdown_header">(Optional)</span></Form.Label>
                    <Col sm="6">
                        <Multiselect
                            options={options}
                            onSelect={onSelect}
                            onRemove={onSelect}
                            displayValue="name"
                            placeholder={categories.length > 0 ? "" : "Select Category"}
                            selectedValues={categories.length > 0 ?
                                categories//.map(i => i.name)
                                : []}
                        />
                    </Col>
                    {/* {(isFormSubmitted && !categories.length) && <i className="fas fa-exclamation-circle"></i>} */}
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
                            onChange={(e) => { setNewCategory(e.target.value); setIsMatched(false) }}
                        />
                        {isMatched && <span column sm={`1`} className='danger-action'> {newCategory + ' is already in categories.'}</span>}
                    </Col>
                    {newCategory !== '' &&
                        <Button variant="primary" onClick={onAddCategory} >
                            Add Category
                        </Button>}
                </Form.Group>
                <Input label='Description' value={description} isInvalid={isFormSubmitted && description === ''} type='textarea' placeholder='Enter Description' id='description' onChange={(e) => setDescription(e.target.value)}></Input>
                <div className='form-action'>
                    <Button variant="primary" onClick={onSubmit} >
                        Save
                    </Button>
                    <Button variant="secondary" className='closeBtn'>
                        <Link to='/disposables'>Close</Link>
                    </Button>
                </div>
            </Form>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { categories } = state.disposablesReducer;
    return {
        disposable: state.disposableItemReducer.disposable,
        categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editDisposable: (disposableObj, id) => dispatch(ProductServices.updateProduct(disposableObj,id)),//dispatch(disposablesService.updateDisposable(disposableObj, id)),
        getDisposable: (id, productType) =>  dispatch(ProductServices.getProductByID(id, productType)),//dispatch(disposablesService.getDisposable(id, productType)),
        getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(EditDisposable);