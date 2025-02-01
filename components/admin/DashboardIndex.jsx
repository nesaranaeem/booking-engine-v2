// components/admin/DashboardIndex.jsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FiActivity, FiBook, FiUsers } from "react-icons/fi"; // Importing React Icons
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const DashboardIndex = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const { addToast } = useToast();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalActivities: res.data?.totalActivities ?? 0,
        totalBookings: res.data?.totalBookings ?? 0,
        totalUsers: res.data?.totalUsers ?? 0,
      });
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dashboard statistics.",
      });
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Activities */}
      <Card className="flex items-center p-6 bg-white shadow">
        <FiActivity className="h-8 w-8 text-blue-500 mr-4" />
        <div>
          <CardTitle className="text-lg">Total Activities</CardTitle>
          <p className="text-2xl font-bold">{stats.totalActivities}</p>
        </div>
      </Card>

      {/* Total Bookings */}
      <Card className="flex items-center p-6 bg-white shadow">
        <FiBook className="h-8 w-8 text-green-500 mr-4" />
        <div>
          <CardTitle className="text-lg">Total Bookings</CardTitle>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
      </Card>

      {/* Total Users */}
      <Card className="flex items-center p-6 bg-white shadow">
        <FiUsers className="h-8 w-8 text-yellow-500 mr-4" />
        <div>
          <CardTitle className="text-lg">Total Users</CardTitle>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardIndex;
