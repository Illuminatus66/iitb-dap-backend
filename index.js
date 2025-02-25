import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/Reports.ts";
import connectDB from "./connectMongoDB.ts";
dotenv.config();

connectDB();

const app = express();

const allowedOrigins = ["https://iitb-dap.netlify.app"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
