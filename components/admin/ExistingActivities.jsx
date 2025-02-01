// components/admin/ExistingActivities.jsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";

const ExistingActivities = ({
  activities,
  fetchActivities,
  onEditActivity,
  onDeleteActivity,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Existing Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Operating Days</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  No activities found.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.operatingDays.join(", ")}</TableCell>
                  <TableCell>{activity.packages.length}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/booking/${activity._id}`} passHref>
                        <Button variant="ghost" size="sm">
                          <FiEye />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditActivity(activity)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteActivity(activity._id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExistingActivities;
