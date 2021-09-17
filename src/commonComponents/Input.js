import { Col, Form } from "react-bootstrap";

export default function Input({
  label,
  type,
  placeholder,
  className,
  disabled,
  dateClassName,
  multiple,
  id,
  onChange,
  isInvalid,
  value,
  inModal = false,
}) {
  return (
    <div>
      <Form.Group className={className}>
        <Form.Label column sm={`${inModal ? 3 : 2}`}>
          {label}
        </Form.Label>
        <Col sm={`${inModal ? 5 : 6}`}>
          <Form.Control
            value={type !== "file" ? value : ""}
            disabled={disabled}
            className={dateClassName}
            multiple={multiple}
            isInvalid={isInvalid}
            type={type}
            placeholder={placeholder}
            id={id}
            onChange={onChange}
          />
        </Col>
        {isInvalid && (
          <span column sm={`${inModal ? 4 : 2}`} className="danger-action">
            {" "}
            {label + " is required field"}
          </span>
        )}
        {type === "file" && value && (
          <img
            className="img_preview"
            src={typeof value === "object" ? URL.createObjectURL(value) : value}
          />
        )}
      </Form.Group>
    </div>
  );
}
