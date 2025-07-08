import mongoose from "mongoose";
import { Server } from "http"
import app from "./app";
import { envVars } from "./app/config/env";
const port = 5000
let server: Server;

const startServer = async () => {
   try {
      await mongoose.connect(envVars.DB_URL)
      console.log("Connect to db")
      server = app.listen(port, () => {
         console.log("Server is running")
      })
   } catch (error) {
      console.log("Server is error :", error)
   }
}
startServer();

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

