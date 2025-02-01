import React, { useEffect, useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";

const Dashboard = React.forwardRef(({ className }, ref) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    lastBooking: null,
    upcomingBookings: 0,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const router = useRouter();
  const [token, setToken] = useState(null);

  const getCookie = (name) => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem("userToken") || getCookie("userToken");
    if (!storedToken) {
      addToast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in to continue.",
      });
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [addToast, router]);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("userToken");
        addToast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to continue.",
        });
        router.push("/login");
      } else {
        addToast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your statistics.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout as="div" className={className} ref={ref}>
      <Head>
        <title>Dashboard</title>
      </Head>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">
            Welcome, {stats.user?.name || "there"}!
          </h1>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSpent.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.upcomingBookings.count}
                  </div>
                  {stats.upcomingBookings.nextBooking && (
                    <div className="text-sm text-gray-500 mt-1">
                      Next in: {stats.upcomingBookings.nextBooking.timeLeft}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Last Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg">
                  {stats.lastBooking ? (
                    <>
                      <div className="font-semibold">
                        {stats.lastBooking.activityName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(stats.lastBooking.createdAt), "PP")}
                      </div>
                    </>
                  ) : (
                    "No bookings yet"
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/bookings")}
              >
                View All Bookings
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/profile")}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </UserLayout>
  );
}); // <-- Added closing parenthesis here

export default Dashboard;
