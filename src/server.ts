import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import router from "./routes/monitorRoutes";

const PORT = process.env.PORT || 5000;

app.use(router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
