import { Col, Form } from "react-bootstrap";

export default function Select({
  label,
  optionValue,
  placeholder,
  id,
  onChange,
  isInvalid,
  value,
  inModal = false,
}) {
  return (
    <div>
      <Form.Group>
        <Form.Label column sm={`${inModal ? 3 : 2}`}>
          {label}
        </Form.Label>
        <Col sm={`${inModal ? 5 : 6}`}>
          <Form.Control as="select" value={value} placeholder={placeholder} id={id} onChange={onChange}>
            {optionValue.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </Form.Control>
        </Col>
        {isInvalid && (
          <span column sm={`${inModal ? 4 : 2}`} className="danger-action">
            {" "}
            {label + " is required field"}
          </span>
        )}
      </Form.Group>
    </div>
  );
}
