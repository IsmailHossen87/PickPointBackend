import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async(payload:IDivision)=>{
    const existingDivision = await Division.findOne({name:payload.name})
    if(existingDivision){
        throw new Error("A division with this name already exists.")
    }
    const division = await Division.create(payload)
    return division
}
// get allDivision
const getAllDivision = async()=>{
    const division = await Division.find()
    const totalDivision =await Division.countDocuments()
    return {
        data:division,
        meta:{
            total:totalDivision
        }
    }
}
// get single Division
const singleDivision = async(id:string)=>{
    const division = await Division.findById(id)
    return {
        data:division,
    }
}
// update
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    
    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return updatedDivision
};

// delete division
const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
};

export const DivisionService = {
    createDivision,getAllDivision,singleDivision,deleteDivision,updateDivision
}