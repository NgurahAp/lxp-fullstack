import supertest from "supertest";
import { web } from "../application/web.js";
import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";

describe("POST /api/users", function () {
  beforeEach(async () => {
    await prismaClient.user.deleteMany();
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      name: "Arya",
      email: "arya@example.com",
      password: "rahasia123",
    });

    expect(result.status).toBe(200); // Should be 201 for resource creation
    expect(result.body.data.name).toBe("Arya");
    expect(result.body.data.email).toBe("arya@example.com");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      email: "",
      password: "",
      name: "",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
