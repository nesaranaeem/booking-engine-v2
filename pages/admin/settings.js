// pages/admin/settings.js
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { FiLock } from "react-icons/fi";
import Head from "next/head";

const AdminSettings = () => {
  const [admin, setAdmin] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { addToast } = useToast();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchAdminDetails();
    }
  }, [token]);

  const fetchAdminDetails = async () => {
    try {
      const res = await axios.get("/api/admin/details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin((prev) => ({
        ...prev,
        username: res.data.username ?? "",
      }));
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch admin details.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = admin;

    if (password !== confirmPassword) {
      addToast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
      });
      return;
    }

    try {
      const res = await axios.put(
        "/api/admin/settings",
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        addToast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
        });
        setAdmin((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Admin Settings</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={admin.username}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={admin.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    value={admin.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center"
                >
                  <FiLock className="mr-2 h-5 w-5" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminSettings;
