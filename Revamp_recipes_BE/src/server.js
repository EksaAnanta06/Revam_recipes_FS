import "dotenv/config";
import app from "./app.js";
import env from "./config/env.js";
import { testConnection } from "./config/database.js";

const PORT = env.PORT;

const startServer = async () => {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
};

startServer();
