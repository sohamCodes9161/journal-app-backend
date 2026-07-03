import {
  createJournal,
  findJournalById,
  updateJournalById,
  deleteJournalById,
  getUserJournals,
  countUserJournals,
} from "./journal.repository.js";
import ApiError from "../../utils/ApiError.js";
import { calculateWordCount } from "./journal.utils.js";
import { encrypt, decrypt } from "../../utils/encryption.js";

import { getOwnedJournalOrThrow } from "./journal.authorization.js";
import { extractMediaIds } from "./journal.utils.js";
import Media from "../media/media.model.js";
import cloudinary from "../../config/cloudinary.js";

const createJournalService = async (journalData, userId) => {
  // FIXED: Destructure styleSettings from the incoming request payload
  const { title, content, mood, category, tags, isDraft, styleSettings } =
    journalData;

  const stringifiedContent = JSON.stringify(content);
  const encryptedContent = encrypt(stringifiedContent);

  const wordCount = calculateWordCount(content);
  const mediaIds = extractMediaIds(content);

  // FIXED: Forward styleSettings into the database creation layer
  const journal = await createJournal({
    userId,
    title,
    content: encryptedContent,
    mood,
    category,
    tags,
    isDraft,
    wordCount,
    attachments: mediaIds,
    styleSettings: {
      themePreset: styleSettings?.themePreset || "warm-parchment",
      layoutWidth: styleSettings?.layoutWidth || "max-w-5xl",
    },
  });

  // Link media → journal using the newly created journal._id
  if (mediaIds && mediaIds.length > 0) {
    await Media.updateMany(
      { _id: { $in: mediaIds } },
      { journalId: journal._id }
    );
  }

  return journal;
};

const getSingleJournalService = async (journalId, userId) => {
  return await getOwnedJournalOrThrow(journalId, userId);
};

const updateJournalService = async (journalId, updateData, userId) => {
  const journal = await getOwnedJournalOrThrow(journalId, userId);

  const updatedFields = { ...updateData };

  // Explicitly ensure styleSettings are preserved correctly in the payload mapping
  if (updateData.styleSettings) {
    updatedFields.styleSettings = {
      themePreset: updateData.styleSettings.themePreset || "cosmic-dark",
      layoutWidth: updateData.styleSettings.layoutWidth || "max-w-5xl",
    };
  }

  if (updateData.content) {
    updatedFields.wordCount = calculateWordCount(updateData.content);

    const mediaIds = extractMediaIds(updateData.content);
    updatedFields.attachments = mediaIds;

    const stringifiedContent = JSON.stringify(updateData.content);
    updatedFields.content = encrypt(stringifiedContent);

    // Link new media items to this journal entry
    await Media.updateMany({ _id: { $in: mediaIds } }, { journalId });

    /* 
      FIXED: Find all media assets that used to belong to this journal,
      but were deleted by the user inside the editor during this edit session.
    */
    const orphanedMediaList = await Media.find({
      journalId: journalId,
      _id: { $nin: mediaIds },
    });

    // Loop through the removed assets and wipe them from Cloudinary and MongoDB
    for (const media of orphanedMediaList) {
      if (media.publicId) {
        try {
          await cloudinary.uploader.destroy(media.publicId);
        } catch (cloudinaryError) {
          console.error(
            `Failed to destroy publicId ${media.publicId} from Cloudinary:`,
            cloudinaryError
          );
          // Keep looping to ensure MongoDB gets cleaned up even if a cloud call slips
        }
      }
      await Media.findByIdAndDelete(media._id);
    }
  }

  return await updateJournalById(journalId, updatedFields);
};

const deleteJournalService = async (journalId, userId) => {
  const journal = await getOwnedJournalOrThrow(journalId, userId);

  // Find all media items explicitly linked to this journal
  const mediaList = await Media.find({ journalId });

  // Delete all assets from Cloudinary storage and clear database rows
  for (const media of mediaList) {
    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
      } catch (cloudinaryError) {
        console.error(
          `Failed to destroy publicId ${media.publicId} on journal delete:`,
          cloudinaryError
        );
      }
    }
    await Media.findByIdAndDelete(media._id);
  }

  await deleteJournalById(journalId);
};

const getJournalsService = async (rawQuery, userId) => {
  // 1. Sanitize incoming query data
  // Strips out empty strings (""), "null", and "undefined" so they don't corrupt MongoDB filters
  const query = {};
  Object.keys(rawQuery).forEach((key) => {
    const val = rawQuery[key];
    if (
      val !== undefined &&
      val !== null &&
      val !== "" &&
      val !== "null" &&
      val !== "undefined"
    ) {
      query[key] = val;
    }
  });

  // 2. Pagination setups
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const filters = {};

  // Mood filter
  if (query.mood) {
    filters.mood = query.mood;
  }

  // Category filter
  if (query.category) {
    filters.category = query.category;
  }

  // Title search
  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  // 3. Date selection mechanics
  if (query.date) {
    // Target exact date routing (e.g., redirect from Analytics timeline grid click)
    const targetDate = new Date(query.date);
    if (!isNaN(targetDate)) {
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      filters.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
  } else if (query.startDate || query.endDate) {
    // Custom date range fallback selection logic
    const dateRangeFilter = {};

    if (query.startDate) {
      const start = new Date(query.startDate);
      if (!isNaN(start)) {
        dateRangeFilter.$gte = start;
      }
    }

    if (query.endDate) {
      const end = new Date(query.endDate);
      if (!isNaN(end)) {
        dateRangeFilter.$lte = end;
      }
    }

    // Only map to main filter tree if valid parameters were compiled
    if (Object.keys(dateRangeFilter).length > 0) {
      filters.createdAt = dateRangeFilter;
    }
  }

  // 4. Sorting rules execution
  const sortBy = query.sortBy || "createdAt";
  const sortType = query.sortType === "asc" ? 1 : -1;

  const sortOptions = {
    [sortBy]: sortType,
  };

  // 5. Database aggregation execution
  const [journals, totalJournals] = await Promise.all([
    getUserJournals({
      userId,
      filters,
      sortOptions,
      skip,
      limit,
    }),

    countUserJournals({
      userId,
      filters,
    }),
  ]);

  return {
    journals,
    pagination: {
      total: totalJournals,
      page,
      limit,
      totalPages: Math.ceil(totalJournals / limit),
    },
  };
};

export {
  createJournalService,
  getSingleJournalService,
  updateJournalService,
  deleteJournalService,
  getJournalsService,
};
