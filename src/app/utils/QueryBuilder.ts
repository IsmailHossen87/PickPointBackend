import { Query } from "mongoose";
import { excludeField } from "../contants";

export class QueryBuilder<T> {     // T= User, Book, Product           
    public modelQuery: Query<T[], T>;          
    public readonly query: Record<string, string>  // { sort: 'price', page: '2' }

    // searchTerm=beach&sort=price&limit=5&page=2&fields=name,price

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter(): this {
        const filter = { ...this.query }
        for (const field of excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field]
        }
        this.modelQuery = this.modelQuery.find(filter)
        return this;
    }
    // search
    search(searchableField: string[]): this {
        // const searchTerm = query.searchTerm || ""
        const searchTerm = this.query.searchTerm || ""
        const searchQuery = {
            $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        }
        this.modelQuery = this.modelQuery.find(searchQuery)
        return this;
    }
    // sort
    sort(): this {
        //  const sort = query.sort || "-createdAt"
        const sort = this.query.sort || "-createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this;
    }
    // fields
    fields(): this {
        //  const sort = query.sort || "-createdAt"
        const fields = this.query.fields?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fields)
        return this;
    }
    // paginate
    paginate(): this {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page - 1) * limit
        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this;
    }
    // builder
    build() {
        return this.modelQuery
    }


    // meta data
    async getMeta() {
        const totalDocument = await this.modelQuery.model.countDocuments()
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10

        const totalPage = Math.ceil(totalDocument/limit)
        return {page,limit,total:totalDocument,totalPage}
    }

}



// const getAllTours = async (query: Record<string, string>) => {
//     const filter = query;
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt"
//     const fields = query.fields?.split(",").join(" ") || ""
//     // pagination
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page - 1) * limit

//     // delete search Item
//     // const excludeField =["searchTerm",'sort']
//     for (const field of excludeField) {
//         delete filter[field]
//     }

//     const searchQuery = {
//         $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//     }

//     // const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)
//     const filterQuery = Tour.find(filter)
//     const tours = filterQuery.find(searchQuery)
//     const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)


//     const totalTours = await Tour.countDocuments()
//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTours,
//         totalPage: Math.ceil(Number(totalTours) / limit)
//     }
//     return {
//         data: allTours,
//         meta
//     }

// };
