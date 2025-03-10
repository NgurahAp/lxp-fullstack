import supertest from "supertest";
import { web } from "../application/web";
import {
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  removeAll,
} from "./test.util";

describe("GET /api/dashboard", () => {
  beforeEach(async () => {
    const user = await createTestUser();

    const instructor = await createTestInstructor();

    const training = await createTraining(instructor.id);

    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can get dashboard", async () => {
    const result = await supertest(web)
      .get("/api/dashboard")
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
  });
});
