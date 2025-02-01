// pages/admin/index.js
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardIndex from "@/components/admin/DashboardIndex";
import withAuth from "@/hoc/withAuth";
import Head from "next/head";

const AdminDashboard = () => (
  <>
    <Head>
      <title>Admin Dashboard - Booking Engine</title>
    </Head>
    <AdminLayout>
      <DashboardIndex />
    </AdminLayout>
  </>
);

export default withAuth(AdminDashboard);
