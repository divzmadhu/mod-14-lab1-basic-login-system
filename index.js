// 1. Load environment variables from .env
import "dotenv/config";

// 2. Import Express to create the server
import express from "express";

// 3. Import the MongoDB connection function
import connectDB from "./config/db.js";

// 4. Import user-related routes
import userRoutes from "./routes/userRoutes.js";

// 5. Create an Express application
const app = express();

// 6. Allow Express to read JSON data from incoming requests
app.use(express.json());

// 7. Connect user routes to the application
app.use("/api/users", userRoutes);

// 8. Define the port using environment variables
const PORT = process.env.PORT || 3000;

// 9. Create an asynchronous function to start the server
const startServer = async () => {
    try {
        // 9.1 Connect to MongoDB
        await connectDB();

        // 9.2 Start the Express server after successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        // 9.3 Handle server startup errors
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

// 10. Call the function to start the application
startServer();
