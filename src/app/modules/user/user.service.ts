import { Iuser } from "./user.interface";
import { User } from "./user.model";

const createUser =async(payload : Partial<Iuser>) =>{ 
     const {name,email} = payload;
        const user = await User.create({
            name,email
        })
    return user
}
// get all users
const getAllUsers = async()=>{
    const users = await User.find({})
    const totalUsers = await User.countDocuments()
    return {
        data:users,
        meta:{
            total:totalUsers
        }
    }
}
export const userService = {createUser,getAllUsers}