import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } from "sequelize";
import { ValidationError as JoiValidationError } from "joi";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  let error: any = [];
 

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = "Database validation failed";
    error = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
  } 
  

  else if (err instanceof UniqueConstraintError) {
    statusCode = 400;
    message = "Duplicate entry";
    error = err.errors.map(error => ({
      field: error.path,
      message: `The value for '${error.path}' already exists. Please use a different one.`
    }));
  } 
  

  else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "Foreign key constraint error";
    error = [{ field: err.fields, message: "Invalid reference to another table" }];
  } 
  

  else if (err instanceof DatabaseError) {
    statusCode = 500;
    message = "Database error occurred";
    error = [{ message: err.message, original: err.original }];
  }


  else if (err instanceof JoiValidationError) {
    statusCode = 400;
    message = "Validation failed";
    error = err.details.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));
  } 


  else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } 
  
  else if (err.name === "ForbiddenError") {
    statusCode = 403;
    message = "Access forbidden";
  } 
  

  else if (err.status === 404) {
    statusCode = 404;
    message = message ?? "Resource not found";
  } 
  

  else if (err.status === 400) {
    statusCode = 400;
    message = err.message || "Bad request";
    error = err.details || [];
  } 

  console.error(`❌ Error: ${message}`, err);


  res.status(statusCode).json({
    success: false,
    message,
    error
  });
};

export default errorHandler;
