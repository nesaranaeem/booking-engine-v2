import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteBookingModal = ({ isOpen, onClose, booking, onConfirm }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-2">
                Delete Booking
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this booking? This action cannot
                  be undone.
                </p>
              </div>

              <div className="mt-6 flex justify-center space-x-4 w-full">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onConfirm(booking._id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default DeleteBookingModal;
