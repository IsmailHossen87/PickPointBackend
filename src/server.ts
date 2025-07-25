/* eslint-disable no-console */
import mongoose from "mongoose";
import { Server } from "http"
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/sedSuper.Admin";
import { Division } from "./app/modules/division/division.model";


let server: Server;

const startServer = async () => {
   try {
      await mongoose.connect(envVars.DB_URL)
      console.log("Connect to db")
      server = app.listen(envVars.Port, () => {
         console.log("Server is running")
      })
   } catch (error) {
      console.log("Server is error :", error)
   }
}


(
   async () => {
      await startServer()
      await seedSuperAdmin()
   }
)()

// unhandle rejection error
process.on("unhandledRejection", (err) => {
   console.log("Unhandled Rejection detected... Server shutting down.", err)
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})
// uncaught  Exception error
process.on("uncaughtException", (err) => {
   console.log("uncaught Exception  detected... Server shutting down.", err)
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})
// Sigtram  Exception error
process.on("SIGTERM", () => {
   console.log("Sigter sigmal   recieved... Server shutting down.")
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})

// Sigtram  Exception error
process.on("SIGINT", () => {
   console.log("SIGINT signal   recieved... Server shutting down.")
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})

const dropCountryUniqueIndex = async () => {
   try {
      const indexes = await Division.indexes();
      const countryIndex = indexes.find(index => index.key.country === 1 && index.unique);

      if (countryIndex) {
         await Division.collection.dropIndex(countryIndex.name);
         console.log(`Dropped index: ${countryIndex.name}`);
      } else {
         console.log("No unique index found on 'country' field.");
      }
   } catch (error) {
      console.error("Failed to drop index:", error)
   }
}