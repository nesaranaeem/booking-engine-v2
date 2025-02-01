// pages/api/admin/packages/[id].js
import dbConnect from "../../../../lib/dbConnect";
import Package from "../../../../models/Package";
import Activity from "../../../../models/Activity";
import { authMiddleware } from "../../../../middleware/auth";

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const { name, adultPrice, childPrice, inclusions } = req.body;

        // Find the Package
        const packageDoc = await Package.findById(id);
        if (!packageDoc) {
          return res.status(404).json({ message: "Package not found" });
        }

        // Update fields if provided
        if (name) packageDoc.name = name.trim();
        if (adultPrice !== undefined)
          packageDoc.adultPrice = Number(adultPrice);
        if (childPrice !== undefined)
          packageDoc.childPrice = Number(childPrice);
        if (inclusions !== undefined) packageDoc.inclusions = inclusions.trim();

        await packageDoc.save();

        res
          .status(200)
          .json({
            message: "Package updated successfully",
            package: packageDoc,
          });
      } catch (error) {
        console.error("PUT /api/admin/packages/[id] error:", error);
        res
          .status(500)
          .json({ message: "Failed to update package", error: error.message });
      }
      break;

    case "DELETE":
      try {
        // Find the Package
        const packageDoc = await Package.findById(id);
        if (!packageDoc) {
          return res.status(404).json({ message: "Package not found" });
        }

        // Remove the Package reference from the Activity
        await Activity.findByIdAndUpdate(packageDoc.activity, {
          $pull: { packages: packageDoc._id },
        });

        // Delete the Package
        await Package.findByIdAndDelete(id);

        res.status(200).json({ message: "Package deleted successfully" });
      } catch (error) {
        console.error("DELETE /api/admin/packages/[id] error:", error);
        res
          .status(500)
          .json({ message: "Failed to delete package", error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default authMiddleware(handler);
