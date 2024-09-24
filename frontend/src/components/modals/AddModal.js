import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../store/modalSlice";
import { addChannel } from "../../store/channelsSlice";
import { randomKey } from "../../utils/different";

function AddModal() {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.modal.visible);
  const [newName, setNewName] = useState('');

  const handleAddChannel = async () => {
    const newId = randomKey();
    const newChannel = { name: newName, id: newId, removable: true };    
    dispatch(addChannel(newChannel));
    dispatch(hideModal());
    setNewName('');
  };

  const hide = () => {
    dispatch(hideModal());
  };

  return (
    <div>
      <Modal show={visible} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Введите название:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter channel name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hide}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleAddChannel}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddModal;
