"use strict";
exports.DATABASE_URL =
  process.env.MONGODB_URI || "mongodb://localhost/where-to-places";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/where-to-places";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || "operationTopSecret";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
