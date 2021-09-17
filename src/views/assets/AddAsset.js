import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import Input from '../../commonComponents/Input';
import Multiselect from 'multiselect-react-dropdown';
import { ToastContainer, toast } from "react-toastify";
import DragAndDrop from '../../commonComponents/DragAndDrop';
import AssetsService from '../../service/AssetsService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductServices from 'service/CommonServices';
import Title from "commonComponents/Title";

function AddAsset(props) {
  const { assetsList, asset } = props;
  const editAssetId = props && props.location && props.location.pathname && props.location.pathname.split('/').length>2 && props.location.pathname.split('/')[props.location.pathname.split('/').length - 1]
  const isEditPage = props && props.location && props.location.pathname && props.location.pathname.split('/').length>2
  const options = props.categories.length > 0 ? props.categories.map((i) => {return { name : i.name, id: i.id}}) : [];
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [EAN, setEAN] = useState('');
  const [UNSPSC, setUNSPSC] = useState('');
  const [brandName, setBrandName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [categories, setCategories] = useState([]);
  const [isMatched, setIsMatched] = useState(false);
  const [description, setDescription] = useState('');
  const [isFormSubmitted, setForm] = useState(false);
  /**
   * Return the selected category
   * @param {*} selectedList 
   * @param {*} selectedItem 
   */
  const onSelect = (selectedList, selectedItem) => {
    setCategories(selectedList);
  }

  useEffect(async() => {
    if(props.match.params.assetId){
      let { assetId } = props.match.params;
      props.getAsset(assetId, "asset").then((data) => {
        setName(data.name);
        setManufacturer(data.manufacturer);
        setEAN(data.productCode);
        setUNSPSC(data.UNSPSCCode);
        setModelNo(data.modelNumber);
        setBrandName(data.brand);
        setDescription(data.description);
        setImage(data.image);
        setCategories([...data.productCategory.map(item => ({id : item.id, name: item.name}))]);
      });
    }
  }, [props.match.params.assetId]);

  // useEffect( async () => {
  //   // await props.getAllCategory();  
  //   // let newCategories =[];
  //   // if(isEditPage){
  //   //   selectedAsset && selectedAsset.category && selectedAsset.category.length >0 && selectedAsset.category.forEach( i => {
  //   //     let data = props.categories.find(item => item.name === i);
  //   //     if(data){
  //   //         newCategories.push({name : data.name, id : data.id});
  //   //     }
  //   // });
  //   // setCategories(newCategories);} 
  // }, [])

  const validateForm = () => {
    if (name !== '' && brandName !== '' && manufacturer !== '' && description !== '' &&
      EAN !== '' && UNSPSC !== '' && modelNo !== '') {
      return true;
    }
    return false;
  }

  const resetForm = () => {
    setName('');
    setBrandName('');
    setManufacturer('');
    setImage('');
    setEAN('');
    setUNSPSC('');
    setModelNo('');
    setCategories([]);
    setDescription('');
    setForm(false);
  }

    
    const onSubmit = () => {
      const isValidForm = validateForm();
      //   const assetObj = {
      //       "name": name,
      //       "image": '',
      //       "description": description,
      //       "productCode": EAN,
      //       "unspsccode": UNSPSC,
      //       "modelNo": modelNo,
      //       "brand" : brandName,
      //       "category": categories.length ? categories.map(item => item.name) : '',
      //       "expiryDate":  '2023-12-04',
      //       "manufacturer": manufacturer
      // }
      
      const assetObj = new FormData();
      assetObj.append('name', name);
      assetObj.append('description', description);
      assetObj.append('productCode', EAN);
      assetObj.append('UNSPSCCode', UNSPSC);
      assetObj.append('modelNumber', modelNo);
      assetObj.append('brand', brandName);
      // assetObj.append('category', categories.length ? categories.map((item) => item.name) : '');
      if(categories.length > 0){
          for (var i = 0; i < categories.length; i++) {
            assetObj.append(`category[${i}]`, categories[i].name);
        }
      }
      // assetObj.append('expiryDate', '2023-12-04');
      assetObj.append('manufacturer', manufacturer);
      assetObj.append('productType', 'asset');
      image !== "" && assetObj.append("image", image);
        
    if (isValidForm) {
     if(isEditPage){
      props.editAsset(assetObj, editAssetId).then((res) => {
        // resetForm();
        if(res.isError){
          toast.error(res.msg)
        }else{
          // toast.success(res.msg)
        }
        setTimeout(() => {
          props.history.push('/assets')
        }, 1000);
      }).catch(
        function (error) {
          toast.error(error.message)
        }
      )
     }else{ 
       props.addAsset(assetObj,"asset").then((res) => {
        // resetForm();
        if(res.isError){
          toast.error(res.msg)
        }else{
          // toast.success(res.msg)
        }
        setTimeout(() => {
          props.history.push('/assets')
        }, 1000);
      }).catch(
        function (error) {
          toast.error(error.response.data?.msg);
        }
      )}
    }
    setForm(true)
  }

  const onAddCategory = () => {
      let newCategories = [...categories];
      let data = { name : newCategory, id : ""}
      let isMatched = options.find(i => i.name === data.name);
      if(!isMatched || isMatched == undefined){
        newCategories.push(data);
        setCategories(newCategories);
        options.push(data);
        setNewCategory("");
        setIsMatched(false);
      }else{
        setIsMatched(true);
      }
    }

    const getImage = (file, imageData) => {
      imageData ? setImage(imageData) : ""
    }
    const title = props.match.params.assetId ? "Edit Asset" : "New Asset";
    return (
      <div>
        <ToastContainer autoClose={1000}/>
        <Title title={title} isActiveFlage={false} />
        <div className="registration_form">
          <div>
            <DragAndDrop imageUpload={getImage} image={image}></DragAndDrop>
          </div>
          <Form className='form-group-action' onSubmit={onSubmit}>
            <Input label='NAME' value={name} isInvalid={isFormSubmitted && name === ''} type='input' placeholder='Enter Asset name' id='name' onChange={(e) => setName(e.target.value)}></Input>
            <Input label='Manufacturer' value={manufacturer} isInvalid={isFormSubmitted && manufacturer === ''} type='input' placeholder='Enter Manufacturer' id='manufacturer' onChange={(e) => setManufacturer(e.target.value)}></Input>
            <Input label='EAN/UPC/GTIN' value={EAN} isInvalid={isFormSubmitted && EAN === ''} type='input' placeholder='Enter EAN/UPC/GTIN' id='ean' onChange={(e) => setEAN(e.target.value)}></Input>
            <Input label='UNSPSC Code' value={UNSPSC} isInvalid={isFormSubmitted && UNSPSC === ''} type='input' placeholder='Enter UNPSC Code' id='unpsc' onChange={(e) => setUNSPSC(e.target.value)}></Input>
            <Input label='Model/Part Number' value={modelNo} isInvalid={(isFormSubmitted && modelNo === '')} type='input' placeholder='Enter Model/Part Number' id='model' onChange={(e) => setModelNo(e.target.value)}></Input>
            <Input label='Brand' value={brandName} isInvalid={(isFormSubmitted && brandName === '')} type='input' placeholder='Enter brand' id='model' onChange={(e) => setBrandName(e.target.value)}></Input>
            <Form.Group>
              <Form.Label column sm="2">Categories <span className="dropdown_header">(Optional)</span></Form.Label>
              <Col sm="6">
                <Multiselect
                  options={options}
                  selectedValues={categories.length > 0  ? categories : ''}
                  onSelect={onSelect}
                  onRemove={onSelect}
                  placeholder={categories.length > 0  ? '' : 'Select Category'}
                  displayValue="name"
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
                        onChange={(e) => {setNewCategory(e.target.value); setIsMatched(false)}}
                      />
                    { isMatched && <span column sm={`1`}  className='danger-action'> {newCategory + ' is already in categories.'}</span> }
                    </Col>
                    { newCategory !== '' && 
                    <Button variant="primary" onClick={onAddCategory} >
                      Add Category
                    </Button> }
                  </Form.Group>
            <Input label='Description' value={description} isInvalid={isFormSubmitted && description === ''} type='textarea' placeholder='Enter Description' id='description' onChange={(e) => setDescription(e.target.value)}></Input>
            <div className='form-action'>
              <Button variant="primary" onClick={onSubmit} >
                Save
              </Button>
              <Button variant="secondary" className='closeBtn'>
                <Link to='/assets'>Close</Link>
              </Button>
            </div>
          </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { categories, assetsList } = state.assetsReducer;
  const { asset } = state.assetItemReducer;
  return {
      categories,
      assetsList,
      asset
  }   
}

const mapDispatchToProps = (dispatch) => {
  return {
    editAsset: (assetObj, id) => dispatch(ProductServices.updateProduct(assetObj,id)),
    addAsset: (assetObj, productType) => dispatch(ProductServices.addProduct(assetObj, productType)),
    getAsset:  (asset_id, productType) => dispatch(ProductServices.getProductByID(asset_id, productType)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(AddAsset);