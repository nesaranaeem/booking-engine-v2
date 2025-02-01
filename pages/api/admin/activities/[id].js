// pages/api/admin/activities/[id].js
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import Package from "@/models/Package";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const activity = await Activity.findById(id)
          .populate("packages")
          .lean();

        if (!activity) {
          return res
            .status(404)
            .json({ success: false, message: "Activity not found" });
        }

        res.status(200).json({ success: true, activity });
      } catch (error) {
        console.error(`GET /api/admin/activities/${id} error:`, error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
      break;

    case "PUT":
      try {
        const { name, description, operatingDays, packages } = req.body;

        // Find the activity
        const activity = await Activity.findById(id);
        if (!activity) {
          return res
            .status(404)
            .json({ success: false, message: "Activity not found" });
        }

        // Update activity fields
        activity.name = name || activity.name;
        activity.description = description || activity.description;
        activity.operatingDays = operatingDays || activity.operatingDays;
        await activity.save();

        // Handle packages
        if (packages && Array.isArray(packages)) {
          const existingPackageIds = activity.packages.map((pkgId) =>
            pkgId.toString()
          );

          // Identify packages to update or create
          const packagePromises = packages.map(async (pkg) => {
            if (pkg._id && existingPackageIds.includes(pkg._id)) {
              // Update existing package
              const existingPackage = await Package.findById(pkg._id);
              if (existingPackage) {
                existingPackage.name = pkg.name || existingPackage.name;
                existingPackage.adultPrice =
                  pkg.adultPrice !== undefined
                    ? pkg.adultPrice
                    : existingPackage.adultPrice;
                existingPackage.childPrice =
                  pkg.childPrice !== undefined
                    ? pkg.childPrice
                    : existingPackage.childPrice;
                existingPackage.inclusions =
                  pkg.inclusions || existingPackage.inclusions;
                await existingPackage.save();
                return existingPackage._id;
              }
            } else {
              // Create new package
              const newPackage = await Package.create({
                ...pkg,
                activity: activity._id,
              });
              return newPackage._id;
            }
          });

          const updatedPackageIds = await Promise.all(packagePromises);

          // Identify packages to remove
          const receivedPackageIds = packages
            .filter((pkg) => pkg._id)
            .map((pkg) => pkg._id.toString());
          const packagesToRemove = existingPackageIds.filter(
            (pkgId) => !receivedPackageIds.includes(pkgId)
          );

          if (packagesToRemove.length > 0) {
            await Package.deleteMany({ _id: { $in: packagesToRemove } });
            activity.packages = activity.packages.filter(
              (pkgId) => !packagesToRemove.includes(pkgId.toString())
            );
            await activity.save();
          }

          // Update activity's packages
          activity.packages = [
            ...new Set([
              ...activity.packages.map((id) => id.toString()),
              ...updatedPackageIds.map((id) => id.toString()),
            ]),
          ];
          await activity.save();
        }

        // Populate packages for response
        const updatedActivity = await Activity.findById(activity._id)
          .populate("packages")
          .lean();

        res.status(200).json({ success: true, activity: updatedActivity });
      } catch (error) {
        console.error(`PUT /api/admin/activities/${id} error:`, error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        if (!id) {
          return res.status(400).json({ message: "Activity ID is required" });
        }

        // Check if the activity exists
        const activity = await Activity.findById(id);
        if (!activity) {
          return res.status(404).json({ message: "Activity not found" });
        }

        // Delete associated packages
        await Package.deleteMany({ activity: id });

        // Delete the activity
        await Activity.findByIdAndDelete(id);

        res.status(200).json({ message: "Activity deleted successfully" });
      } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ message: "Failed to delete activity" });
      }
      break;

      try {
        const activity = await Activity.findById(id);
        if (!activity) {
          return res
            .status(404)
            .json({ success: false, message: "Activity not found" });
        }

        // Delete associated packages
        await Package.deleteMany({ activity: activity._id });

        // Delete activity
        await activity.remove();

        res.status(200).json({
          success: true,
          message: "Activity and associated packages deleted",
        });
      } catch (error) {
        console.error(`DELETE /api/admin/activities/${id} error:`, error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
