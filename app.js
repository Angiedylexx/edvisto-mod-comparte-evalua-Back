import express from "express"; 
import cors from "cors";
import { port } from "./src/config/index.js"; 
import "./src/config/dbConnection.js"; 
import bodyParser from "body-parser"; 
import middlewareErrors from "./src/api/utils/errors.js";
import loginRouter from  "./src/api/users/routers/login.js";
import usersRouter from "./src/api/users/routers/index.js";
import assignmentRouter from "./src/api/assignment/routers/index.js";
import deliveryRouter from "./src/api/feedback/routers/index.js";
import { serverRead } from "./src/api/users/controllers/get.js";
import swaggerUi from "swagger-ui-express";
import { openApiSpecification } from "./src/config/swagger.js";
import authorization from "./src/api/users/controllers/authorization.js";

const app = express(); 

//API´s
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(cors());
app.get("/", serverRead);
app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(openApiSpecification));

app.use("/api", loginRouter);
app.use("/api", usersRouter);
app.use("/api", assignmentRouter);


app.use(authorization);

app.use("/api", deliveryRouter);

//Errores
app.use(middlewareErrors);

app.listen(port, (error) => { 
  if(error) {
    console.log("Server Error: Failed");
    process.exit(1);
  }
  console.log("Server listening in port " + port);
});

