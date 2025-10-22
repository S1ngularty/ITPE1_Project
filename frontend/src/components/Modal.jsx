import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";

 function NamingModal({event,currValue,toClose}) {
  const [openModal, setOpenModal] = useState(event);
  const [name, setName] = useState(currValue || "");
    console.log("modal",event)

  function onCloseModal() {
    toClose()
    setOpenModal(false);
    setName("");
  }

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="analysisName">Analysis name</Label>
              </div>
              <TextInput
                id="analysisName"
                placeholder="analyses name"
                value={currValue.name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button>Save new name</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
 
export default NamingModal