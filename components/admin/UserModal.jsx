import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiX } from "react-icons/fi";
import { format } from "date-fns";

const UserModal = ({ isOpen, onClose, user, mode, onSubmit }) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

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
          <div className="relative w-11/12 sm:w-4/5 lg:w-3/5 xl:w-2/5 bg-white rounded-lg shadow-lg">
            <Dialog.Title className="flex justify-between items-center p-4 border-b text-lg font-semibold">
              {isViewMode ? "User Details" : "Edit User"}
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX className="text-2xl" />
              </button>
            </Dialog.Title>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user?.name}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email}
                  disabled={isViewMode}
                  required
                />
              </div>

              {isEditMode && (
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              )}

              {isViewMode && user?.createdAt && (
                <div>
                  <Label>Registration Date</Label>
                  <p>{format(new Date(user.createdAt), "PPP")}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Close
                </Button>
                {isEditMode && (
                  <Button type="submit">
                    Save Changes
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default UserModal;
