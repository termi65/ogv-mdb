import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Dialog({show, title, text, nurOK, handleClose, handleOK}) {

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
            {nurOK ?
                <Button variant="secondary" onClick={handleClose}>OK</Button>
                :
                <div>
                    <Button variant="primary" onClick={handleOK}>OK</Button> &nbsp;
                    <Button variant="secondary" onClick={handleClose}>Abbrechen</Button>
                </div>
            }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dialog;
