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
  FiBook,
  FiUser,
  FiSettings,
  FiDownload,
  FiLoader,
} from "react-icons/fi";
import { Transition } from "@headlessui/react";

const UserLayout = React.forwardRef(({ children, className }, ref) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { addToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem("userToken") || getCookie("userToken");

    if (!storedToken) {
      addToast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again to continue.",
      });
      router.push("/login");
      return;
    }

    setToken(storedToken); // Set token state immediately

    // Verify token validity
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) {
          localStorage.removeItem("userToken");
          addToast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to continue.",
          });
          router.push("/login");
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("userToken");
        addToast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred. Please log in again.",
        });
        router.push("/login");
      }
    };

    verifyToken();
  }, [router, addToast]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    document.cookie =
      "userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    addToast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    router.push("/login");
  };

  if (!token) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col h-screen bg-gray-100 ${className || ""}`}
    >
      {/* Header for Mobile */}
      <header className="bg-gray-800 text-white flex items-center justify-between p-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <span className="text-lg font-semibold">User Dashboard</span>
        {/* Placeholder for alignment */}
        <div></div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="p-4 bg-indigo-600">
              <Card className="bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    User Dashboard
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiBook className="mr-3 h-5 w-5" />
                My Bookings
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
              >
                <FiUser className="mr-3 h-5 w-5" />
                Profile
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
          </div>
        </aside>

        {/* Sidebar for Mobile */}
        <Transition show={isSidebarOpen} as={React.Fragment}>
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay */}
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setIsSidebarOpen(false)}
              />
            </Transition.Child>

            {/* Sidebar */}
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                {/* Close button */}
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                  >
                    <FiX className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Sidebar content */}
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 px-2 space-y-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-2 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700"
                    >
                      <FiHome className="mr-4 h-6 w-6" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center px-2 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700"
                    >
                      <FiBook className="mr-4 h-6 w-6" />
                      My Bookings
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-2 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700"
                    >
                      <FiUser className="mr-4 h-6 w-6" />
                      Profile
                    </Link>
                  </nav>
                </div>

                {/* Logout button */}
                <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full text-white border-red-500 hover:bg-red-600"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Transition>

        {/* Main Content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}); // Correct closure for React.forwardRef

export default UserLayout;
