// pages/admin/activities.js

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import ExistingActivities from "@/components/admin/ExistingActivities";
import PackageModal from "@/components/admin/PackageModal";
import Head from "next/head";

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    operatingDays: [],
    packages: [],
  });
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchActivities();
    }
  }, [token]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data.activities ?? []);
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch activities.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const { name, description, operatingDays, packages } = newActivity;

    if (packages.length === 0) {
      addToast({
        variant: "destructive",
        title: "Error",
        description: "At least one package is required to create an activity.",
      });
      return;
    }

    try {
      const res = await axios.post(
        "/api/admin/activities",
        { name, description, operatingDays, packages },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        addToast({
          title: "Activity Added",
          description: "New activity has been added successfully.",
        });
        setNewActivity({
          name: "",
          description: "",
          operatingDays: [],
          packages: [],
        });
        fetchActivities();
      }
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add activity.",
      });
    }
  };

  const handleEditActivity = (activity) => {
    setCurrentActivity(activity);
    setIsPackageModalOpen(true);
  };

  const handleUpdateActivity = async () => {
    if (!currentActivity) return;

    try {
      const res = await axios.put(
        `/api/admin/activities/${currentActivity._id}`,
        currentActivity,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        addToast({
          title: "Activity Updated",
          description: "The activity has been updated successfully.",
        });
        fetchActivities();
        setIsPackageModalOpen(false);
        setCurrentActivity(null);
      }
    } catch (error) {
      console.error("Failed to update activity:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the activity.",
      });
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`/api/admin/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast({
        title: "Activity Deleted",
        description: "The activity has been deleted successfully.",
      });
      fetchActivities();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the activity.",
      });
    }
  };

  const handleRemovePackage = (index) => {
    setCurrentActivity((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const handleAddPackage = (packageData) => {
    setCurrentActivity((prev) => ({
      ...prev,
      packages: [...prev.packages, { ...packageData, _id: uuidv4() }],
    }));
  };

  return (
    <>
      <Head>
        <title>Activities</title>
      </Head>
      <AdminLayout>
        {isLoading && <LoadingSpinner />}
        {/* Add New Activity */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Add New Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddActivity} className="space-y-4">
              {/* Activity Name */}
              <div>
                <Label htmlFor="name">Activity Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter activity name"
                  value={newActivity.name}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Activity Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter activity description"
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Operating Days */}
              <div className="border p-4 rounded-md bg-gray-50">
                <Label>Operating Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={day}
                        checked={newActivity.operatingDays.includes(day)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setNewActivity((prev) => ({
                            ...prev,
                            operatingDays: checked
                              ? [...prev.operatingDays, value]
                              : prev.operatingDays.filter((d) => d !== value),
                          }));
                        }}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div className="border p-4 rounded-md bg-gray-50">
                <Label>Packages</Label>
                {newActivity.packages.length === 0 ? (
                  <p className="text-gray-500">No packages added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {newActivity.packages.map((pkg, index) => (
                      <div
                        key={pkg.id}
                        className="flex justify-between items-center border p-2 rounded-md bg-gray-50"
                      >
                        <div>
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <p>Adult Price: {pkg.adultPrice} THB</p>
                          <p>Child Price: {pkg.childPrice} THB</p>
                          <p>Inclusions: {pkg.inclusions}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setNewActivity((prev) => ({
                              ...prev,
                              packages: prev.packages.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Package Form to Add a New Package */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">
                    Add New Package
                  </h4>
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="Package Name"
                      value={newActivity.packageName || ""}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          packageName: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Adult Price"
                      value={newActivity.packageAdultPrice || ""}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          packageAdultPrice: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Child Price"
                      value={newActivity.packageChildPrice || ""}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          packageChildPrice: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="Inclusions"
                      value={newActivity.packageInclusions || ""}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          packageInclusions: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const {
                          packageName,
                          packageAdultPrice,
                          packageChildPrice,
                          packageInclusions,
                        } = newActivity;
                        if (
                          !packageName ||
                          !packageAdultPrice ||
                          !packageChildPrice
                        ) {
                          addToast({
                            variant: "destructive",
                            title: "Error",
                            description:
                              "Package name, adult price, and child price are required.",
                          });
                          return;
                        }

                        setNewActivity((prev) => ({
                          ...prev,
                          packages: [
                            ...prev.packages,
                            {
                              id: uuidv4(),
                              name: packageName,
                              adultPrice: parseFloat(packageAdultPrice),
                              childPrice: parseFloat(packageChildPrice),
                              inclusions: packageInclusions || "",
                            },
                          ],
                          packageName: "",
                          packageAdultPrice: "",
                          packageChildPrice: "",
                          packageInclusions: "",
                        }));

                        addToast({
                          title: "Package Added",
                          description: "A new package has been added.",
                        });
                      }}
                    >
                      Add Package
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit">Add Activity</Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Activities */}
        <ExistingActivities
          activities={activities}
          fetchActivities={fetchActivities}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
        />

        {/* Edit Activity Modal */}
        {isPackageModalOpen && currentActivity && (
          <PackageModal
            isOpen={isPackageModalOpen}
            onClose={() => setIsPackageModalOpen(false)}
            activityForm={currentActivity}
            setActivityForm={setCurrentActivity}
            handleUpdateActivity={handleUpdateActivity}
            handleAddPackage={handleAddPackage}
            handleRemovePackage={handleRemovePackage}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default AdminActivities;
