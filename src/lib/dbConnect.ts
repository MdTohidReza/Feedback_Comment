import mongoose from "mongodb"

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject= {}

 async function dbConnect(): Promise<void> {
    if(connection.isConnected){
      console.log("Already Connected to Database");
      return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected = db.connections[0].readyState
        console.log("Database is connected Successfullt"); 
    } catch (error) {
         console.log("Database is not connected",error);
         process.exit()
              
    }
}
export default dbConnect;