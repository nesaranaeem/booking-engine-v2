import { useState, useEffect } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // New state for handling errors

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const token = localStorage.getItem("userToken") || getCookie("userToken");
      console.log("Retrieved token:", token); // Debugging

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile response:", response.data); // Debugging

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || error.message);
      addToast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Optional: Show a loading indicator for the password update
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }

      const token = localStorage.getItem("userToken") || getCookie("userToken");
      console.log("Token for password change:", token); // Debugging

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        "/api/user/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      addToast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Display loading spinner while fetching data
  if (isLoading) {
    return (
      <UserLayout>
        <LoadingSpinner />
      </UserLayout>
    );
  }

  // Display error message if there's an error
  if (error) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </UserLayout>
    );
  }

  // Display profile content once user data is fetched
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Profile;
