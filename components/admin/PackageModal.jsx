// components/PackageModal.jsx

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiX, FiTrash2, FiPlus } from "react-icons/fi";

const PackageModal = ({
  isOpen,
  onClose,
  activityForm,
  setActivityForm,
  handleUpdateActivity,
  handleAddPackage,
  handleRemovePackage,
}) => {
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    adultPrice: "",
    childPrice: "",
    inclusions: "",
  });

  const resetPackageForm = () => {
    setPackageForm({
      name: "",
      adultPrice: "",
      childPrice: "",
      inclusions: "",
    });
    setIsEditingPackage(false);
    setEditingPackageIndex(null);
  };

  const handleEditPackage = (index) => {
    setPackageForm({ ...activityForm.packages[index] });
    setEditingPackageIndex(index);
    setIsEditingPackage(true);
  };

  const savePackage = () => {
    const updatedPackages = [...activityForm.packages];
    if (editingPackageIndex !== null) {
      updatedPackages[editingPackageIndex] = packageForm;
    } else {
      updatedPackages.push(packageForm);
    }
    setActivityForm({ ...activityForm, packages: updatedPackages });
    resetPackageForm();
  };

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
          {/* Modal Content */}
          <div className="relative w-11/12 sm:w-4/5 lg:w-3/5 xl:w-2/5 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {isEditingPackage
                  ? editingPackageIndex !== null
                    ? "Edit Package"
                    : "Add Package"
                  : activityForm?._id
                  ? "Edit Activity"
                  : "Add New Activity"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {!isEditingPackage ? (
                <div className="space-y-6">
                  {/* Activity Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Activity Details
                    </h4>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label
                          htmlFor="activityName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Activity Name
                        </label>
                        <Input
                          id="activityName"
                          value={activityForm.name}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter activity name"
                          className="w-full mt-1"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="activityDescription"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <Textarea
                          id="activityDescription"
                          value={activityForm.description}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter activity description"
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Package List */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Packages</h4>
                    <div className="space-y-4 mt-4">
                      {activityForm.packages &&
                      activityForm.packages.length > 0 ? (
                        activityForm.packages.map((pkg, index) => (
                          <div
                            key={pkg._id || index}
                            className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-md bg-gray-50"
                          >
                            <div>
                              <h4 className="font-semibold">{pkg.name}</h4>
                              <p>Adult Price: {pkg.adultPrice}</p>
                              <p>Child Price: {pkg.childPrice}</p>
                              <p>Inclusions: {pkg.inclusions}</p>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                              <Button
                                size="sm"
                                onClick={() => handleEditPackage(index)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemovePackage(index)}
                              >
                                <FiTrash2 />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No packages added yet.</p>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingPackage(true)}
                        className="flex items-center mt-2"
                      >
                        <FiPlus className="mr-2" /> Add Package
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Package Form */}
                  <h4 className="font-medium text-gray-900">
                    {editingPackageIndex !== null
                      ? "Edit Package"
                      : "Add Package"}
                  </h4>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label
                        htmlFor="packageName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Package Name
                      </label>
                      <Input
                        id="packageName"
                        value={packageForm.name}
                        onChange={(e) =>
                          setPackageForm({
                            ...packageForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Package Name"
                        className="w-full mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="adultPrice"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Adult Price
                        </label>
                        <Input
                          id="adultPrice"
                          type="number"
                          value={packageForm.adultPrice}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              adultPrice: e.target.value,
                            })
                          }
                          placeholder="Adult Price"
                          className="w-full mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="childPrice"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Child Price
                        </label>
                        <Input
                          id="childPrice"
                          type="number"
                          value={packageForm.childPrice}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              childPrice: e.target.value,
                            })
                          }
                          placeholder="Child Price"
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="inclusions"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Inclusions
                      </label>
                      <Textarea
                        id="inclusions"
                        value={packageForm.inclusions}
                        onChange={(e) =>
                          setPackageForm({
                            ...packageForm,
                            inclusions: e.target.value,
                          })
                        }
                        placeholder="Inclusions"
                        className="w-full mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              {!isEditingPackage ? (
                <>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={handleUpdateActivity} className="ml-2">
                    {activityForm?._id ? "Update Activity" : "Save Activity"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={resetPackageForm}>
                    Back
                  </Button>
                  <Button onClick={savePackage} className="ml-2">
                    {editingPackageIndex !== null
                      ? "Update Package"
                      : "Add Package"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default PackageModal;
