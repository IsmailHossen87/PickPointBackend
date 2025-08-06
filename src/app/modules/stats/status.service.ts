import { Booking } from "../booking/booking.model"
import { Tour } from "../tour/tour.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"
// aggregation
const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)

// All users
const getUserStatus = async () => {
    const totalUserPromise = User.countDocuments()
    const totalActiceUserPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiceUserPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockUserPromise = User.countDocuments({ isActive: IsActive.BLOCKED })


    const newUsersInLast7Days = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30Days = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const usersByRolePromise = User.aggregate([
        // stage-1    Grouping User by role and Count total user in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }

    ])

    const [totalUser, totalActiveUsers, totalInActiveUsers, totalBlockUsers, newUsers7Day, newUsers30Day, usersByRole] = await Promise.all([
        totalUserPromise,
        totalActiceUserPromise,
        totalInActiceUserPromise,
        totalBlockUserPromise,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRolePromise
    ])

    return {
        totalUser, totalActiveUsers, totalInActiveUsers, totalBlockUsers, newUsers7Day, newUsers30Day, usersByRole
    }
}
// All Tour
const getTourStatus = async () => {
    const totalTourPromise = Tour.countDocuments()
    // aggregate ->Connect Tour Type And Unwind Then Grouping
    const totalTourByTourTypePromise = Tour.aggregate([
        // stage-1 : Connect Tour Type model

        {
            $lookup: {
                from: "tourtypes",        //Collection database name
                localField: "tourType",  //Tours Foreign key
                foreignField: "_id",   //Tour types _id,
                as: "type"              //New field Name
            }
        },
        //stage-2 Unwind Array to object       LIKE GHURIR SUTA SARAR MOTO
        {
            $unwind: "$type"        //👆👆👆👆
        },
        // stage -3 Tour type er name diye grouping kora
        {
            $group: {
                _id:"$type.name",   //👆👆
                count:{$sum:1}
            }
        }
    ])
    // Average Tour Cost 
    const averageTourCostPromise = Tour.aggregate([
        // state-1 ,Total Cost Groupoing
        {
            $group:{
                _id:null,
                average:{$avg:"$costFrom"}
            }
        }
    ])
    // Total Tour By Division
    const totalTourByDivisionPromise = Tour.aggregate([
        {
            $lookup:{
                from:"divisions",
                localField:"division",
                foreignField:"_id",
                as:"divisionType"
            }
        },
        {
            $unwind:"$divisionType"
        },
        {
            $group:{
                _id:"$divisionType.name",
                count:{$sum:1}
            }
        }
    ])

    // Total Height Book Tour 
    const totalHeightBookedTourPromise = Booking.aggregate([
        {
            $group:{
                _id:"$tour",
                bookingCount:{$sum:1}
            }
        },
        // state 2   sort the tour
        {
            $sort:{bookingCount:-1}
        },
        {      // state 3   limit the tour
            $limit:5
        },
        //stage -4   PipeLine     👌👌👌👌👌👌👌👌👌👌👌👌👌👌
        {
            $lookup:{
                from:"tours",
                let:{tourId:"$_id"},
                pipeline:[
                    {
                        $match:{
                            $expr:{$eq:["$_id","$$tourId"]}
                        }
                    }
                ],
                as:"tour"
            }
        },
        //stage -5 unwind
        {
            $unwind:"$tour"
        },
          {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])



    const [totalTour, TourType,averageTourCost,totalTourByDivision,totalHeightBookedTour] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        averageTourCostPromise,
        totalTourByDivisionPromise,
        totalHeightBookedTourPromise
    ])

    return {
        totalTour, TourType,averageTourCost,totalTourByDivision,totalHeightBookedTour
    }
}
// All Booking
const getBookingStatus = async () => {

}
// All Payment
const getPaymentStatus = async () => {

}





export const StatusService = { getBookingStatus, getPaymentStatus, getTourStatus, getUserStatus }



/**
 * await Tour.updateMany(
        {
            // Only update where tourType or division is stored as a string
            $or: [
                { tourType: { $type: "string" } },
                { division: { $type: "string" } }
            ]
        },
        [
            {
                $set: {
                    tourType: { $toObjectId: "$tourType" },
                    division: { $toObjectId: "$division" }
                }
            }
        ]
    );
 */
