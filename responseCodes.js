const RESPONSE = {
  SUCCESS: {
    OK: { status: 200, message: "Success" },
    CREATED: { status: 201, message: "Resource created successfully!" },
  },
  ERROR: {
    EMAIL_ALREADY_VERIFIED: {
      status: 409,
      message: "Email has already been verified",
    },
    EMAIL_NOT_VERIFIED: {
      status: 403,
      message: "Email is not verified. Let's verify it.",
    },
    USER_EXISTS: { status: 409, message: "User already exists" },
    NOT_FOUND: { status: 404, message: "Resource not found" },
    UNAUTHORIZED: { status: 401, message: "Unauthorized" },
    SERVER_ERROR: { status: 500, message: "Internal server error" },
    INVALID_TOKEN: { status: 401, message: "Invalid token" },
    INVALID_CREDENTIALS: { status: 401, message: "Invalid credentials" },
  },
};

export default RESPONSE;
