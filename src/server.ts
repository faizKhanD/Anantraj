import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { sequelize } from "./config/sequelize.config";
import { morganMiddleware } from "./config/logger.config";
import { adminAuthRoute } from "./routes/admins/auth.routes";
import passport from "./config/passport.config";
import errorHandler from "./utils/errorHandler.util";
import adminRoutes from "./routes/admins/admin.routes";
import { seedProjectStatuses } from "./utils/seedProjectStatus.utils";
import websiteRoutes from "./routes/website/website.routes";
import { initializeAssociations } from "./models/index";
const PORT: number = Number(process.env.ANANTRAJ_PORT) || 3010;
const app: Application = express();


app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeAssociations();

sequelize
  .sync({ force: false })
  .then(() => {
    seedProjectStatuses().then(() => {
      // register seeder 
  
      // seeder 
      console.log(
        "✅ Database synchronized and statuses seeded successfully! 🚀"
      );
    });
  })
  .catch((error: Error) => console.error("❌ Database sync error:", error));

app.use(passport.initialize());
app.use(
  cors({
    origin: ["http://localhost:3000","https://theestateresidences.com","https://anantrajlimited.com","http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use("/api/v1/admins/auth", adminAuthRoute);
app.use("/api/v1/admins", adminRoutes);
app.use('/api/v1/website',websiteRoutes)

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
