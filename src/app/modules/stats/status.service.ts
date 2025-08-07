import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.model"
import { IsActive, Iuser } from "../user/user.interface"
import { User } from "../user/user.model"

// 🔸 Current date and last 7, 30 days er tarikh ber kora
const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)




/* ===================================
🔵 1. USER STATUS
=================================== */
const getUserStatus = async () => {
    // 🔸 Different user counts by status
    const totalUserPromise = User.countDocuments()
    const totalActiveUserPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInactiveUserPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUserPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    // 🔸 New user count in last 7 and 30 days
    const newUsersInLast7Days = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    const newUsersInLast30Days = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    // 🔸 User role wise count (Admin, Guide, User, etc.)
    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    // 🔸 All promises run parallelly
    const [totalUser, totalActiveUsers, totalInactiveUsers, totalBlockedUsers, newUsers7Day, newUsers30Day, usersByRole] = await Promise.all([
        totalUserPromise,
        totalActiveUserPromise,
        totalInactiveUserPromise,
        totalBlockedUserPromise,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRolePromise
    ])

    // 🔸 Final return object
    return {
        totalUser,
        totalActiveUsers,
        totalInactiveUsers,
        totalBlockedUsers,
        newUsers7Day,
        newUsers30Day,
        usersByRole
    }
}


/* ===================================
🟢 2. TOUR STATUS
=================================== */
const getTourStatus = async () => {

    const totalTourPromise = Tour.countDocuments()

    // 🔸 Tour type-wise count (adventure, cultural, etc.)
    const totalTourByTourTypePromise = Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",               // Collection database name
                localField: "tourType",          // Tours Foreign key
                foreignField: "_id",             // Tour types _id
                as: "type"                       // New field Name
            }
        },
        { $unwind: "$type" },   //👆👆👆👆
        {
            $group: {
                _id: "$type.name", //👆👆
                count: { $sum: 1 }
            }
        }
    ])

    // 🔸 Average tour cost calculation
    const averageTourCostPromise = Tour.aggregate([
        {
            $group: {
                _id: null,
                average: { $avg: "$costFrom" }
            }
        }
    ])

    // 🔸 Division-wise tour count
    const totalTourByDivisionPromise = Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "divisionType"
            }
        },
        { $unwind: "$divisionType" },
        {
            $group: {
                _id: "$divisionType.name",
                count: { $sum: 1 }
            }
        }
    ])

    // 🔸 Most booked top 5 tours
    const totalHeightBookedTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        { $sort: { bookingCount: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        { $unwind: "$tour" },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    // 🔸 Execute all promises in parallel
    const [totalTour, TourType, averageTourCost, totalTourByDivision, totalHeightBookedTour] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        averageTourCostPromise,
        totalTourByDivisionPromise,
        totalHeightBookedTourPromise
    ])

    // 🔸 Final return object
    return {
        totalTour,
        TourType,
        averageTourCost,
        totalTourByDivision,
        totalHeightBookedTour
    }
}



/* ===================================
🟡 3. BOOKING STATUS (To be implemented)
=================================== */
const getBookingStatus = async () => {
    const totalBookingPromise = Booking.countDocuments()
    // statusCheck
    const totalBookingByStatusPromise = Booking.aggregate([
        {
            $group:{
                _id:"$status",
                count:{$sum:1}
            }
        },
    ])
    // Tour Per Booking
    const totalTourPerBookingPromise = Booking.aggregate([
        {
            $group:{
                _id:"$tour",
                bookingCount:{$sum:1}
            }
        },
        {
            $sort:{bookingCount : -1}  // 👆👆👆
        },
        {
            $limit: 10
        },
          // Prottekta Tour er under e kotojon lok Booking Hoise  👌lookUp👌
          {
            $lookup:{
                from:"tours",
                localField:"_id",       //aita amar tour er id,Karom upore group kora hoyese
                foreignField:"_id",
                as:"tour"
            }
          },
          {
            $unwind:"$tour"
          },
          {
            $project:{
                bookingCount:1,
                _id:1       ,
                "tour.title":1,
                "tour.slug":1,
            }
          }

    ])
    // Guest COunt Per Booking
    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group:{
                _id:null,
                avgGuestCount:{$avg:"$guestCount"}
            }
        }
    ])
    // Booking Last 7 Days
    const bookingLast7DayPromise = Booking.countDocuments({createdAt: {$gte:sevenDaysAgo}})
    // Booking Last 30 Days
    const bookingLast30DayPromise = Booking.countDocuments({createdAt: {$gte:thirtyDaysAgo}})
    // Unique User Booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user:any)=>user.length)

    const [totalBooking,totalBookingByStatus,totalTourPerBooking,avgGuestCountPerBooking,bookingLast7Day,bookingLas30Day,totalBookingByUniqueUsers] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        totalTourPerBookingPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DayPromise,bookingLast30DayPromise,totalBookingByUniqueUsersPromise
    ])

    return {totalBooking,totalBookingByStatus,totalTourPerBooking,avgGuestCountPerBooking:avgGuestCountPerBooking[0].avgGuestCount,bookingLast7Day,bookingLas30Day,totalBookingByUniqueUsers}
}


/* ===================================
🟠 4. PAYMENT STATUS (To be implemented)
=================================== */
const getPaymentStatus = async () => {
    const totalPaymentPromise = Payment.countDocuments()
    // checkStatus
    const totalPaymentByStatusPromise = Payment.aggregate([
        {
            $group:{
                _id:"$status",
                totalStatus:{$sum:1}
            }
        }
    ])
    // TotalAmount ->Paid
    const totalRevenuePromise = Payment.aggregate([
        {
           $match:{status:PAYMENT_STATUS.PAID}  //Evabew kora jai
        },
        {
            $group:{
                _id:null,
                totalRevenue:{$sum:"$amount"}
            }
        }
    ])
    // average Payment
    const averagePaymentPromise = Payment.aggregate([
        {
            $group:{
                _id:null,
                averagePayment:{$avg:"$amount"}
            }
        }
    ])
    // paymment GetWay         😒😒😒😒😒😒😒
    const paymentGetWayDataPromise = Payment.aggregate([
        {
            $group:{
                _id:{$ifNull : ["$paymentGatewayData.status","UNKNOWN"]},
                count:{$sum:1}
            }
        }
    ])

    const [totalPayment,totalPaymentByStatus,totalRevenue,averagePayment,paymentGetWayData] =await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        averagePaymentPromise,
        paymentGetWayDataPromise
    ])

    return { totalPayment,totalPaymentByStatus,totalRevenue:totalRevenue[0].totalRevenue,averagePayment:averagePayment[0].averagePayment,paymentGetWayData}
}

export const StatusService = {getBookingStatus,getPaymentStatus,getTourStatus,getUserStatus}








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
