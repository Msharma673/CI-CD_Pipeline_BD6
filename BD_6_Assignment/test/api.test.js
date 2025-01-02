const request = require("supertest");
const { app, travelPackages, bookings } = require("../index"); // Adjust the path to index.js

// const request = require("supertest");
const http = require("http");
// const { app } = require("../index"); // Adjust the path to index.js

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3000); // Using port 3000 as in the example
});

afterAll(async () => {
  server.close();
});

describe("Travel Packages and Bookings API", () => {
  it("should retrieve all travel packages", async () => {
    const res = await request(server).get("/packages");
    expect(res.status).toBe(200);
    expect(res.body.packages).toBeInstanceOf(Array);
    expect(res.body.packages.length).toBeGreaterThan(0);
    expect(res.body.packages[0]).toHaveProperty("destination");
    expect(res.body.packages[0]).toHaveProperty("price");
  });

  it("should retrieve a travel package by destination", async () => {
    const res = await request(server).get("/packages/Paris");
    expect(res.status).toBe(200);
    expect(res.body.package).toHaveProperty("destination", "Paris");
    expect(res.body.package).toHaveProperty("price");
  });

  it("should return 404 if the package destination is not found", async () => {
    const res = await request(server).get("/packages/UnknownCity");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Package not found");
  });

  it("should add a new booking", async () => {
    const newBooking = {
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    };

    const res = await request(server).post("/bookings").send(newBooking);

    expect(res.status).toBe(201);
    expect(res.body.booking).toHaveProperty("bookingId");
    expect(res.body.booking.customerName).toBe("Raj Kulkarni");
    expect(res.body.booking.seats).toBe(2);
  });

  it("should update available slots for a package", async () => {
    const updateData = {
      packageId: 1,
      seatsBooked: 2,
    };

    const res = await request(server)
      .post("/packages/update-seats")
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.package.availableSlots).toBe(8); // 10 - 2
  });

  it("should retrieve all bookings for a package", async () => {
    const res = await request(server).get("/bookings/1");
    expect(res.status).toBe(200);
    expect(res.body.bookings).toBeInstanceOf(Array);
    expect(res.body.bookings.length).toBeGreaterThan(0);
    expect(res.body.bookings[0]).toHaveProperty("customerName");
    expect(res.body.bookings[0]).toHaveProperty("seats");
  });

  it("should return 404 if no bookings are found for a package", async () => {
    const res = await request(server).get("/bookings/999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "No bookings found for this package",
    );
  });
});
