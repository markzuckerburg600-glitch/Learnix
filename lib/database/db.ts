import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI 

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
}

export default async function connect() {
    const state = await mongoose.connection.readyState 
    if (state === 1) {
        return
    } else if (state === 2) {
        console.log("Connecting...")
    }
    
    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: "notebooklm",
            bufferCommands: true
        })
        console.log("Connected")
    } catch (err) {
        console.error(err)
        throw new Error("Failed to connect to MongoDB")
    }
}
