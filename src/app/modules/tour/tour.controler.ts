import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { TourService } from "./tour.service";
import { string } from "zod";


// TOUR TYPE
const createTourType = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body; 
    const result = await TourService.createTourType(name); 
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});
const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await TourService.updateTourType(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});




// Tour
const createTour = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.createTour(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
});
// allTour
const getAllTours = catchAsync(async(req:Request,res:Response)=>{
    const query = await req.query
    const result = await TourService.getAllTours(query as Record<string,string>)
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour  retrived successfully',
        meta: result.meta,
        data: result.data,
    });
})
// single
const getSingleTour = catchAsync(async(req:Request,res:Response)=>{
   const slug = req.params.slug;
   const result = await TourService.getsingleTour(slug)
     sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Tour retrieved",
        data:result.data,
    })

}) 


const updateTour = catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const update = await TourService.updateTour(id,req.body)
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour update successfully',
        data: update,
    });
})
const deleteTour = catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await TourService.deleteTour(id)
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
})



export const TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    deleteTourType,
    updateTourType,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};