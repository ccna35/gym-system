import { Request, Response, NextFunction } from "express";
import Joi, { Schema, ValidationOptions } from "joi";

interface ValidateSchemas {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: false,
};

export const validate = (
  schemas: ValidateSchemas,
  options: ValidationOptions = {}
) => {
  const mergedOptions = { ...defaultOptions, ...options } as ValidationOptions;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        const { error, value } = schemas.params.validate(
          req.params,
          mergedOptions
        );
        if (error) return respond(error, res);
        req.params = value;
      }
      if (schemas.query) {
        const { error, value } = schemas.query.validate(
          req.query,
          mergedOptions
        );
        if (error) return respond(error, res);
        req.query = value;
      }
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, mergedOptions);
        if (error) return respond(error, res);
        req.body = value;
      }
      return next();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Validation middleware error" });
    }
  };
};

function respond(error: Joi.ValidationError, res: Response) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: error.details.map((d) => d.message),
  });
}
