// components/admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  FiMenu,
  FiX,
  FiHome,
  FiActivity,
  FiBook,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { Transition } from "@headlessui/react";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { addToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      addToast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please log in to access the admin panel.",
      });
      router.push("/admin/login");
    } else {
      setToken(storedToken);
    }
  }, [router, addToast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    addToast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
    router.push("/admin/login");
  };

  if (!token) {
    return null; // Optionally, render a loading spinner here
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white flex items-center justify-between p-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <span className="text-lg font-semibold">Admin Panel</span>
        <div></div>
      </header>

      {/* Sidebar for Desktop */}
      <div className="flex flex-1 relative">
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="p-4 bg-indigo-600">
              <Card className="bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Admin Panel
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                href="/admin"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/activities"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiActivity className="mr-3 h-5 w-5" />
                Activities
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiBook className="mr-3 h-5 w-5" />
                Bookings
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiUsers className="mr-3 h-5 w-5" />
                Users
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
            <div className="p-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full text-white border-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </div>
            <footer className="p-4 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Nesar
            </footer>
          </div>
        </aside>

        {/* Sidebar for Mobile */}
        <Transition
          show={isSidebarOpen}
          as={React.Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col z-50 md:hidden">
            <div className="flex items-center justify-between p-4 bg-indigo-600">
              <Card className="bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Admin Panel
                  </CardTitle>
                </CardHeader>
              </Card>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                href="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/activities"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiActivity className="mr-3 h-5 w-5" />
                Activities
              </Link>
              <Link
                href="/admin/bookings"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiBook className="mr-3 h-5 w-5" />
                Bookings
              </Link>
              <Link
                href="/admin/users" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiUsers className="mr-3 h-5 w-5" />
                Users
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
            <div className="p-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full text-white border-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </div>
            <footer className="p-4 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Nesar
            </footer>
          </aside>
        </Transition>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
