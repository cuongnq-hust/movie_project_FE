import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const ReviewForm = ({ handleSubmit, revText, labelText, defaultValue }) => {
  const [movie, setMovie] = useState("");
  // console.log("movie moi la", movie);
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>{labelText}</Form.Label>
        <Form.Control
          ref={revText}
          as="textarea"
          rows={3}
          defaultValue={defaultValue}
        />
        {/* <input
          className="inputext"
          value={movie}
          onChange={(e) => {
            setMovie(e.target.value);
          }}
          ref={revText}
        /> */}
      </Form.Group>
      <Button variant="outline-info" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;
