import { Router } from "express";
// const { validateTableName } = require("../middleware/validTable");
import { UploadImageEmployee } from "../utils/UploadImageEmployees";
const employeeController = require("../controller/employeeController");

export const Employee: Router = Router();

Employee.get("/", employeeController.getAll);
Employee.get("/:id", employeeController.getById);
Employee.post("/", UploadImageEmployee, employeeController.createEmployee);
Employee.put("/:id", UploadImageEmployee, employeeController.putEmployee);
Employee.delete("/:id", employeeController.deleteEmployee);


// User.get('/', AuthMiddleware, UserController.getAllUser)
// User.get('/:id', AuthMiddleware, UserController.getByIdUser)
// User.post('/', AuthMiddleware, UserController.createUser)
// //Legal.put('/:id', UserController.)
// User.delete('/:id', AuthMiddleware, UserController.deleteUser)
