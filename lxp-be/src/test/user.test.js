import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestUser,
  getTestUser,
  removeAll,
  removeTestUser,
} from "./test.util.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeAll();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(201); // Should be 201 for resource creation
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      email: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already exists", async () => {
    // First registration
    let result = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(201); // Changed to 201 for resource creation
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeUndefined();

    // Second registration with same email
    result = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("Should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password123",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject login if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "tes@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.role).toBe("student");
  });

  it("Should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Success");

    // Pengecekan apakah token masih ada
    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it("Should reject logout if token invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
  });
});

describe("POST /api/users/forgotPassword", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can get reset password", async () => {
    const result = await supertest(web).post("/api/users/forgotPassword").send({
      email: "test@gmail.com",
    });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.resetToken).toBeDefined();
  });

  it("Should reject if email invalid", async () => {
    const result = await supertest(web).post("/api/users/forgotPassword").send({
      email: "wrong@gmail.com",
    });

    expect(result.status).toBe(401);
  });
});
