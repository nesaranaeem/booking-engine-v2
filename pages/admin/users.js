import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import UserModal from "@/components/admin/UserModal";
import { format } from "date-fns";
import Head from "next/head";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const { addToast } = useToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalMode("view");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/users?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate password if provided
    if (userData.password) {
      if (userData.password.length < 6) {
        addToast({
          variant: "destructive",
          title: "Invalid Password",
          description: "Password must be at least 6 characters long"
        });
        return;
      }
    }

    try {
      await axios.put(`/api/admin/users?id=${selectedUser._id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast({
        title: "Success",
        description: "User updated successfully",
      });
      fetchUsers();
      setModalMode(null);
    } catch (error) {
      console.error("Error updating user:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Manage Users - Admin Dashboard</title>
      </Head>
      <AdminLayout>
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "PPP")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(user)}
                        >
                          <FiEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {modalMode && (
          <UserModal
            isOpen={!!modalMode}
            onClose={() => {
              setModalMode(null);
              setSelectedUser(null);
            }}
            user={selectedUser}
            mode={modalMode}
            onSubmit={handleSubmit}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default AdminUsers;
