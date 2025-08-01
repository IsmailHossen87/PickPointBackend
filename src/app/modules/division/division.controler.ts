import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendReponse";
import { IDivision } from "./division.interface";

// Image handling
const createDivision = catchAsync(async (req: Request, res: Response) => {
    //  console.log({
    //     file:req.file, body:req.body
    // })
    const payload: IDivision = {
        ...req.body,
        thumbail: req.file?.path
    }
    const result = await DivisionService.createDivision(payload)


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division Created",
        data: result
    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.getAllDivision()
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: " Divisions retrieved",
        data: result.data,
        meta: result.meta
    })

})
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await DivisionService.singleDivision(slug)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division retrieved",
        data: result.data,
    })

})
// update 
const updatedDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await DivisionService.updateDivision(id, req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division updated",
        data: result
    })

})
// delete
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.deleteDivision(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});
export const DivisionController = {
    createDivision, getAllDivision, getSingleDivision, updatedDivision, deleteDivision
};