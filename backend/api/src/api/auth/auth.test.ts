import * as bcrypt from "bcrypt";
import cuid from "cuid";
import request from "supertest";
import app from "../../app";
import { db } from "../../db";
import { globalUserCredentials } from "../../globalSetup";
import { hashToken } from "../../utils/hashToken";
import { generateRefreshToken } from "../../utils/jwt";

describe("POST /api/v1/auth/register", () => {
  it("responds with an error if payload is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(400);
  });

  it("responds with an error if payload email is missing ", async () => {
    const payload = {
      password: "Test1@123",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(400);
  });

  it("responds with an error if password is missing ", async () => {
    const payload = {
      email: "k1k1@k1k1.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(400);
  });

  it("responds with an accessToken and refreshToken", async () => {
    const payload = {
      email: "k1k1@k1k1.com",
      password: "Test1@123",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
  });

  it("responds with an accessToken and refreshToken in cookie", async () => {
    const payload = {
      email: "k1k12@k1k12.com",
      password: "Test1@123",
    };

    const response = await request(app)
      .post("/api/v1/auth/register?refreshTokenInCookie=true")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(Array.isArray(response.headers["set-cookie"])).toBe(true);
    expect(response.headers["set-cookie"][0]).toContain("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
  });
});

describe("POST /api/v1/auth/login", () => {
  it("responds with an error if payload is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(400);
  });

  it("responds with an error if payload email is missing ", async () => {
    const payload = {
      password: "Test1@123",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(400);
  });

  it("responds with an error if password is missing ", async () => {
    const payload = {
      email: "k1k1@k1k1.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(400);
  });

  it("responds with unauthorized if user is missing from db", async () => {
    const payload = {
      email: "test@test.com",
      password: "Test1@123",
    };
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Invalid login credentials.");
  });

  it("responds with unauthorized if password is wrong", async () => {
    const payload = {
      ...globalUserCredentials,
      password: "wrongPassw0rd",
    };
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send(payload);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Invalid login credentials.");
  });

  it("responds with an accessToken and refreshToken", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({
        email: globalUserCredentials.email,
        password: globalUserCredentials.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
  });

  it("responds with an accessToken and refreshToken in cookie", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login?refreshTokenInCookie=true")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({
        email: globalUserCredentials.email,
        password: globalUserCredentials.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(Array.isArray(response.headers["set-cookie"])).toBe(true);
    expect(response.headers["set-cookie"][0]).toContain("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
  });
});

describe("POST /api/v1/auth/refreshToken", () => {
  const userCredentials = {
    email: "k1k1@refresh.com",
    password: "Test1@123",
  };

  let expiredRefreshToken = "";
  let validRefreshToken = "";
  let refreshTokenNotPresentInDb = "";

  beforeAll(async () => {
    const user = await db.user.create({
      data: {
        email: userCredentials.email,
        password: bcrypt.hashSync(userCredentials.password, 12),
      },
    });

    expiredRefreshToken = generateRefreshToken(
      { userId: user.id, jti: cuid() },
      "1s"
    );

    const jti = cuid();
    validRefreshToken = generateRefreshToken({ userId: user.id, jti }, "5m");
    refreshTokenNotPresentInDb = generateRefreshToken(
      { userId: user.id, jti: cuid() },
      "5m"
    );

    await db.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(validRefreshToken),
        userId: user.id,
      },
    });
  });

  afterAll(async () => {
    await db.user.delete({
      where: {
        email: userCredentials.email,
      },
    });
  });

  it("responds with error if refreshToken is missing ( body case )", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Missing refresh token.");
  });

  it("responds with error if refreshToken is missing ( cookie case )", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Missing refresh token.");
  });

  it("responds with Unauthorized if token is expired ( body case ) ", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ refreshToken: expiredRefreshToken });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("jwt expired");
  });

  it("responds with Unauthorized if token is expired ( cookie case ) ", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .set("Cookie", [`refreshToken=${expiredRefreshToken}`])
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("jwt expired");
  });
  it("responds with Unauthorized if token is not present in db ( body case ) ", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ refreshToken: "1231231a" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("jwt malformed");
  });

  it("responds with Unauthorized if token is not present in db ( cookie case ) ", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .set("Cookie", [`refreshToken=${refreshTokenNotPresentInDb}`])
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Unauthorized");
  });

  it("responds with an accessToken and refreshToken ( body case )", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ refreshToken: validRefreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
    validRefreshToken = response.body.refreshToken;
  });

  it("responds with an accessToken and refreshToken ( cookie case )", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken")
      .set("Accept", "application/json")
      .set("Cookie", [`refreshToken=${validRefreshToken}`])
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
    validRefreshToken = response.body.refreshToken;
  });
  it("responds with an accessToken and refreshToken in cookie", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refreshToken?refreshTokenInCookie=true")
      .set("Accept", "application/json")
      .set("Cookie", [`refreshToken=${validRefreshToken}`])
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(Array.isArray(response.headers["set-cookie"])).toBe(true);
    expect(response.headers["set-cookie"][0]).toContain("refreshToken");
    expect(response.body.accessToken).toEqual(expect.any(String));
  });
});
