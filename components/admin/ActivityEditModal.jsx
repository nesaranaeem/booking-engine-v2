import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FiX, FiPlus, FiTrash } from "react-icons/fi";

const ActivityEditModal = ({ isOpen, onClose, activity, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    description: activity?.description || "",
    operatingDays: activity?.operatingDays || [],
    packages: activity?.packages || []
  });

  const [newPackage, setNewPackage] = useState({
    name: "",
    adultPrice: "",
    childPrice: "",
    inclusions: ""
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.adultPrice || !newPackage.childPrice) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { ...newPackage, _id: Date.now() }]
    }));
    setNewPackage({
      name: "",
      adultPrice: "",
      childPrice: "",
      inclusions: ""
    });
  };

  const handleRemovePackage = (packageId) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter(pkg => pkg._id !== packageId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
              >
                Edit Activity
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                <div>
                  <Label>Activity Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Operating Days</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.operatingDays.includes(day)}
                          onChange={() => handleDayToggle(day)}
                          className="rounded border-gray-300"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Packages</Label>
                  <div className="space-y-4 mt-2">
                    {formData.packages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="border rounded p-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemovePackage(pkg._id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <FiTrash className="h-5 w-5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Package Name</Label>
                            <Input
                              value={pkg.name}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  packages: prev.packages.map(p =>
                                    p._id === pkg._id
                                      ? { ...p, name: e.target.value }
                                      : p
                                  )
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Adult Price</Label>
                            <Input
                              type="number"
                              value={pkg.adultPrice}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  packages: prev.packages.map(p =>
                                    p._id === pkg._id
                                      ? { ...p, adultPrice: e.target.value }
                                      : p
                                  )
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Child Price</Label>
                            <Input
                              type="number"
                              value={pkg.childPrice}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  packages: prev.packages.map(p =>
                                    p._id === pkg._id
                                      ? { ...p, childPrice: e.target.value }
                                      : p
                                  )
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Inclusions</Label>
                            <Textarea
                              value={pkg.inclusions}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  packages: prev.packages.map(p =>
                                    p._id === pkg._id
                                      ? { ...p, inclusions: e.target.value }
                                      : p
                                  )
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border rounded p-4">
                      <h4 className="font-medium mb-4">Add New Package</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Package Name</Label>
                          <Input
                            value={newPackage.name}
                            onChange={(e) =>
                              setNewPackage({
                                ...newPackage,
                                name: e.target.value
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Adult Price</Label>
                          <Input
                            type="number"
                            value={newPackage.adultPrice}
                            onChange={(e) =>
                              setNewPackage({
                                ...newPackage,
                                adultPrice: e.target.value
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Child Price</Label>
                          <Input
                            type="number"
                            value={newPackage.childPrice}
                            onChange={(e) =>
                              setNewPackage({
                                ...newPackage,
                                childPrice: e.target.value
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Inclusions</Label>
                          <Textarea
                            value={newPackage.inclusions}
                            onChange={(e) =>
                              setNewPackage({
                                ...newPackage,
                                inclusions: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddPackage}
                        className="mt-4"
                      >
                        <FiPlus className="mr-2" /> Add Package
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ActivityEditModal;
