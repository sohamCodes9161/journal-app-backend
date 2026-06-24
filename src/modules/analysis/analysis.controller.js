import { computeWorkspaceAnalytics } from "./analysis.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
export const getWorkspaceAnalytics = async (req, res) => {
  try {
    // Assuming your auth gateway pins user info to req.user
    const userId = req.user._id || req.user.id;
    const range = req.query.range === "month" ? "month" : "week";

    const analyticsPayload = await computeWorkspaceAnalytics(userId, range);

    return res.status(200).json(new ApiResponse(200, analyticsPayload));
  } catch (error) {
    console.error("Error generating metrics stream mapping:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while generating analytics. Please try again later.",
          error.message
        )
      );
  }
};
