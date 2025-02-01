// pages/api/admin/packages/index.js
import dbConnect from "../../../../lib/dbConnect";
import Package from "../../../../models/Package";
import Activity from "../../../../models/Activity";
import { authMiddleware } from "../../../../middleware/auth";

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { activityId, name, adultPrice, childPrice, inclusions } =
          req.body;

        // Basic validation
        if (
          !activityId ||
          !name ||
          adultPrice === undefined ||
          childPrice === undefined
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify that the Activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
          return res.status(404).json({ message: "Activity not found" });
        }

        // Create the Package
        const packageDoc = await Package.create({
          activity: activityId,
          name: name.trim(),
          adultPrice: Number(adultPrice),
          childPrice: Number(childPrice),
          inclusions: inclusions?.trim() || "",
        });

        // Add the Package reference to the Activity
        activity.packages.push(packageDoc._id);
        await activity.save();

        res
          .status(201)
          .json({
            message: "Package created successfully",
            package: packageDoc,
          });
      } catch (error) {
        console.error("POST /api/admin/packages error:", error);
        res
          .status(500)
          .json({ message: "Failed to create package", error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default authMiddleware(handler);
