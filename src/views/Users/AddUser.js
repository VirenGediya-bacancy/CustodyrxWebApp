import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Input from "../../commonComponents/Input";
import Select from "commonComponents/Select";
import { ToastContainer, toast } from "react-toastify";
import DragAndDrop from "../../commonComponents/DragAndDrop";
import { connect } from "react-redux";
import ProductServices from "service/CommonServices";
import Title from "commonComponents/Title";
import UserServices from "service/UserServices";
import { systemRoleOption, providerRoleOption } from "Constant/Column";

function AddUser(props) {
  const isEditPage =
    props && props.match && props.match.params && props.match.params.userId
      ? true
      : false;
  const userId =
    props && props.match && props.match.params && props.match.params.userId;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [systemRole, setSystemRole] = useState("");
  const [providerNumber, setProviderNumber] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [providerRole, setProviderRole] = useState("");
  const [signature, setSignature] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [badgeEPC, setBadgeEPC] = useState([]);
  const [isMatched, setIsMatched] = useState(false);
  const [isFormSubmitted, setForm] = useState(false);
  /**
   * Return the selected category
   * @param {*} selectedList
   * @param {*} selectedItem
   */

  useEffect(async () => {
    if (props.match.params.userId) {
      let { userId } = props.match.params;
      props.getUserDetails(userId).then((data) => {
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
        setSystemRole(data.systemRole);
        setProviderNumber(data.providerNumber);
        setPhoneNo(data.phone);
        setProviderRole(data.providerRole);
        setSignature(data.signature);
        setUserName(data.username);
        setPassword(data.password);
        setBadgeEPC(data.badgeEPC && data.badgeEPC.itemEPC);
      });
    }
  }, [props.match.params.userId]);

  const validateForm = () => {
    if (
      name !== "" &&
      email !== "" &&
      systemRole !== "" &&
      phoneNo !== "" &&
      providerRole !== "" &&
      userName !== "" &&
      password !== ""
    ) {
      return true;
    }
    return false;
  };

  const resetForm = () => {
    setForm(false);
    setName("");
    setEmail("");
    setAvatar("");
    setSystemRole("");
    setProviderNumber("");
    setPhoneNo("");
    setProviderRole("");
    setSignature("");
    setUserName("");
    setPassword("");
    setBadgeEPC("");
    setIsMatched("");
  };

  const onSubmit = () => {
    const isValidForm = validateForm();
    const userObj = new FormData();
    userObj.append("name", name);
    userObj.append("email", email);
    userObj.append("systemRole", systemRole);
    userObj.append("phone", phoneNo);
    userObj.append("providerRole", providerRole);
    userObj.append("providerNumber", providerNumber);
    userObj.append("username", userName);
    userObj.append("password", password);
    userObj.append("badgeEPC", badgeEPC);
    typeof avatar !== "string" && userObj.append("avatar", avatar);
    typeof signature !== "string" && userObj.append("signature", signature);
    if (isValidForm) {
      if (isEditPage) {
        props
          .editUser(userObj, userId)
          .then((res) => {
            if (res) {
              if (res.isError) {
                toast.error(res.msg);
              } else {
                // toast.success(res.msg);
              }
              setTimeout(() => {
                resetForm();
                props.history.push("/users");
              }, 1000);
            }
          })
          .catch(function (error) {
            toast.error(error.response.data?.msg);
          });
      } else {
        props
          .addUser(userObj)
          .then((res) => {
            if (res) {
              if (res.isError) {
                toast.error(res.msg);
              } else {
                // toast.success(res.msg);
              }
              setTimeout(() => {
                resetForm();
                props.history.push("/users");
              }, 1000);
            }
          })
          .catch(function (error) {
            toast.error(error.response.data?.msg);
          });
      }
    }
    setForm(true);
  };

  const handleUploadImage = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setSignature(e.target.files[0]);
  };

  const getImage = (file, imageData) => {
    imageData ? setAvatar(imageData) : "";
  };
  const title = isEditPage ? "Edit User" : "New User";
  return (
    <div>
      <ToastContainer autoClose={1000} />
      <Title isActiveFlage={false} title={title} />
      <div className="registration_form">
        <div>
          <DragAndDrop imageUpload={getImage} image={avatar}></DragAndDrop>
        </div>
        <Form className="form-group-action" onSubmit={onSubmit}>
          <Input
            label="Name"
            value={name}
            isInvalid={isFormSubmitted && name === ""}
            type="input"
            placeholder="Enter User name"
            id="name"
            onChange={(e) => setName(e.target.value)}
          ></Input>
          <Input
            label="Email"
            value={email}
            isInvalid={isFormSubmitted && email === ""}
            type="email"
            placeholder="Enter Email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <Select
            value={systemRole}
            isInvalid={isFormSubmitted && systemRole === ""}
            label="System Role"
            optionValue={systemRoleOption}
            placeholder="Select System Role"
            id="systemRole"
            onChange={(e) => setSystemRole(e.target.value)}
          ></Select>
          <Input
            label="Phone"
            value={phoneNo}
            isInvalid={isFormSubmitted && phoneNo === ""}
            type="input"
            placeholder="Enter phone"
            id="phoneNo"
            onChange={(e) => setPhoneNo(e.target.value)}
          ></Input>
          <Select
            value={providerRole}
            isInvalid={isFormSubmitted && providerRole === ""}
            label="Provider Role"
            optionValue={providerRoleOption}
            placeholder="Select System Role"
            id="providerRole"
            onChange={(e) => setProviderRole(e.target.value)}
          ></Select>
          <Input
            label="License/Serial Number"
            value={providerNumber}
            isInvalid={isFormSubmitted && providerNumber === ""}
            type="input"
            placeholder="Enter License/Serial Number"
            id="providerNumber"
            onChange={(e) => setProviderNumber(e.target.value)}
          ></Input>
          <Input
            label="Username"
            value={userName}
            isInvalid={isFormSubmitted && userName === ""}
            type="input"
            placeholder="Enter Username"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
          ></Input>
          <Input
            label="Signature Image"
            type="file"
            id="signature"
            value={signature}
            onChange={(e) => handleUploadImage(e)}
          ></Input>
          <Input
            label="Password"
            value={password}
            isInvalid={isFormSubmitted && password === ""}
            type="password"
            placeholder="Enter password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Input
            label="Badge EPC"
            value={badgeEPC}
            // isInvalid={isFormSubmitted && badgeEPC === ""}
            type="input"
            placeholder="Enter Badge EPC"
            id="badgeEPC"
            onChange={(e) => setBadgeEPC(e.target.value)}
          ></Input>
          <div className="form-action">
            <Button variant="primary" onClick={onSubmit}>
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => props.history.push("/users")}
              className="closeBtn"
            >
              {" "}
              Close
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { categories, assetsList } = state.assetsReducer;
  const { asset } = state.assetItemReducer;
  return {
    categories,
    assetsList,
    asset,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editUser: (userObj, userId) =>
      dispatch(UserServices.updateUser(userObj, userId)),
    addUser: (userObj) => dispatch(UserServices.addUser(userObj)),
    getUserDetails: (userId) => dispatch(UserServices.getUserDetails(userId)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
