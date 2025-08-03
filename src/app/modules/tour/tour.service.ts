
// ===============================
// IMPORTS
// ===============================
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";


// ===============================
// TOUR TYPE SERVICES
// ===============================

/**
 * Create a new tour type
 */
const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload });
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return await TourType.create({ name: payload });
};

/**
 * Get all tour types
 */
const getAllTourTypes = async () => {
    return await TourType.find();
};

/**
 * Update an existing tour type
 */
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedTourType;
};

/**
 * Delete a tour type
 */
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    return await TourType.findByIdAndDelete(id);
};


// ===============================
// TOUR SERVICES
// ===============================

/**
 * Create a new tour
 */
const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const tour = await Tour.create(payload);
    return tour;
};

/**
 * Get all tours with filters, sorting, pagination etc.
 */
const getAllTours = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();

    const meta = await queryBuilder.getMeta();

    return {
        data: tours,
        meta: meta,
    };
};

/**
 * Get a single tour by slug
 */
const getsingleTour = async (slug: string) => {
    const tour = await Tour.findOne({ slug });
    return {
        data: tour,
    };
};

/**
 * Update a tour by ID, with image handling and deletion
 */
export const updateTour = async (id: string, payload: Partial<ITour>) => {
    // 1. Check if tour exists
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found");
    }

    // 2. Merge new images with existing ones (if both exist)
    if (payload.images?.length && existingTour.images?.length) {
        payload.images = [...payload.images, ...existingTour.images];
    }

    // 3. Handle image deletion from DB
    const deleteImages = payload.deleteImages ?? [];

    if (deleteImages.length > 0 && existingTour.images?.length) {
        // Filter out deleted images from DB
        const restDBImages = existingTour.images.filter(
            (url) => !deleteImages.includes(url)
        );

        // Remove duplicates from payload.images
        const updatePayloadImages = (payload.images ?? [])
            .filter((url) => !deleteImages.includes(url))
            .filter((url) => !restDBImages.includes(url));

        // Final updated image list
        payload.images = [...restDBImages, ...updatePayloadImages];
    }

    // 4. Update tour in MongoDB
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
        new: true,
    });

    // 5. Delete removed images from Cloudinary
    if (deleteImages.length > 0 && existingTour.images?.length) {
        await Promise.all(
            deleteImages.map((url) => deleteImageFromCloudinary(url))
        );
    }

    return updatedTour;
};

/**
 * Delete a tour by ID
 */
const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

// EXPORT SERVICE OBJECT
export const TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    getsingleTour,
    updateTour,
    deleteTour,
};
