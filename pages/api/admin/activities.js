import dbConnect from "../../../lib/dbConnect";
import Activity from "../../../models/Activity";
import Package from "../../../models/Package"; // Import Package model
import { authMiddleware } from "../../../middleware/auth";

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const activities = await Activity.find({})
          .populate("packages") // Populate the packages for activities
          .lean();

        res.status(200).json({ activities });
      } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Failed to fetch activities" });
      }
      break;

    case "POST":
      try {
        const { name, description, operatingDays, packages } = req.body;

        if (!name || !description || !operatingDays) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Create new activity
        const activity = new Activity({
          name,
          description,
          operatingDays,
        });

        // Save packages and associate them with the activity
        if (Array.isArray(packages) && packages.length > 0) {
          const createdPackages = await Package.insertMany(
            packages.map((pkg) => ({
              ...pkg,
              activity: activity._id,
            }))
          );
          activity.packages = createdPackages.map((pkg) => pkg._id);
        }

        await activity.save();

        res.status(201).json({ message: "Activity created", activity });
      } catch (error) {
        console.error("Error creating activity:", error);
        res.status(500).json({ message: "Failed to create activity" });
      }
      break;

    case "DELETE":
      try {
        if (!id) {
          return res.status(400).json({ message: "Activity ID is required" });
        }

        // Delete associated packages
        await Package.deleteMany({ activity: id });

        // Delete activity
        await Activity.findByIdAndDelete(id);

        res.status(200).json({ message: "Activity deleted" });
      } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ message: "Failed to delete activity" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
};

export default authMiddleware(handler);
