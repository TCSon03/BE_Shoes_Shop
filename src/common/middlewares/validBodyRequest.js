import { ZodError } from "zod";

const validBodyRequest = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.data = data;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default validBodyRequest;