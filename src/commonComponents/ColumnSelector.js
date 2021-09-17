import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Form, Col } from 'react-bootstrap';

function ColumnSelector(props) {
    const { show, closeDialog, title, columns } = props;
    let [selectedColumns, setSelectedColumns] = useState(columns);

    const onSubmit = () => {
        props.getColumns(selectedColumns);
        closeDialog(false);
    }

    const handleCheckedEvent = (e) => {
        let newColumn = [...selectedColumns];
        let name = e.target.name;
        let index = newColumn.findIndex(item => item.accessor === name);
        // newColumn[index].checked = e.target.checked;
        index === 0 ? newColumn[index].checked = true : newColumn[index].checked = e.target.checked;
        setSelectedColumns(newColumn);
    }

    return (
        <div>
            <Modal show={show} onHide={closeDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col lg='6' md='6' sm='12'>
                        <Form onSubmit={onSubmit}>
                            {
                                columns.map((item, i) => {
                                    let { header, accessor, checked } = item;
                                    return accessor === 'name' ? <Form.Check
                                        key={i}
                                        type="checkbox"
                                        label={header}
                                        value={header}
                                        name={accessor}
                                        onChange={(e) => handleCheckedEvent(e)}
                                        checked={true}
                                    /> :
                                        <Form.Check
                                            key={i}
                                            type="checkbox"
                                            label={header}
                                            value={header}
                                            name={accessor}
                                            onChange={(e) => handleCheckedEvent(e)}
                                            checked={checked}
                                        />
                                })
                            }
                        </Form>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant="secondary" onClick={closeDialog}>
                            Close
                        </Button>
                    </div>
                    <div>
                        <Button variant="primary" onClick={onSubmit}>
                            Apply
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ColumnSelector;