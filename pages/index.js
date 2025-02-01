// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Home = ({ activities }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBookNow = (activityId, e) => {
    e.preventDefault();
    setLoading(true);
    router.push(`/booking/${activityId}`);
  };

  return (
    <>
      <Head>
        <title>Available Activities</title>
      </Head>

      {loading && <LoadingSpinner />}

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10">
          Available Activities
        </h1>
        {activities.length === 0 ? (
          <p className="text-gray-600 text-center">
            No activities found. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card
                key={activity._id}
                className="border border-gray-200 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="p-0">
                  <Image
                    src="/images/placeholder-activity.jpg"
                    alt={activity.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {activity.name}
                  </CardTitle>
                  <CardDescription className="text-gray-500 mb-4">
                    {activity.shortDescription || "Explore more details!"}
                  </CardDescription>
                  <p className="text-gray-700 text-sm">
                    {activity.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-end">
                  <Button
                    onClick={(e) => handleBookNow(activity._id, e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  await dbConnect();
  const activities = await Activity.find({}).lean();
  return {
    props: {
      activities: JSON.parse(JSON.stringify(activities)),
    },
  };
}

export default Home;
