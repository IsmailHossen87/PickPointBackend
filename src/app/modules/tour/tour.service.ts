import { excludeField } from "../../contants";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// TOUR TYPE
const createTourType = async (payload: ITourType) => {

    const existingTourType = await TourType.findOne({ name: payload });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name: payload });
};
const getAllTourTypes = async () => {
    return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};




// TOUR
const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const tour = await Tour.create(payload)
    return tour;
};

const getAllTours = async (query: Record<string, string>) => {
    const filter = query;
    const searchTerm = query.searchTerm || ""
    const sort = query.sort || "-createdAt" 
    // field Filtering
    const fields =  query.fields.split(",").join(" ") || ""

    // delete search Item
    // const excludeField =["searchTerm",'sort']
    for(const field of excludeField){
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field]
    }

    const searchQuery = {
        $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    }


    const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields)
    const totalTours = await Tour.countDocuments()
    return {
        data: tours,
        meta: {
            total: totalTours
        }
    }

};

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) {
        throw new Error("Tour not found")
    }
    const updateTour = await Tour.findByIdAndUpdate(id, payload, { new: true })
    return updateTour
}
const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id)
}


export const TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    updateTour,
    deleteTour,
};