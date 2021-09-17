import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import {Button,Form, Col} from 'react-bootstrap';

function ModalDialog(props) {
  const { show, closeDialog, title, children, onSubmit } = props;
    const [abc, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>  
        <Modal show={show} onHide={closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="primary" onClick={onSubmit}>
                Save
              </Button>
            </div>
            <div>
              <Button variant="secondary" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default ModalDialog