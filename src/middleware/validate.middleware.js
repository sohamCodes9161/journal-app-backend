import ApiError from "../utils/ApiError.js";

const validate = (schema) => {

  return (req, res, next) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {

      const errors = result.error.issues.map(
        (issue) => ({
          field: issue.path[0],
          message: issue.message,
        })
      );

      return next(
        new ApiError(
          400,
          "Validation failed",
          errors
        )
      );
    }

    req.validatedData = result.data;

    next();
  };
};

export default validate;