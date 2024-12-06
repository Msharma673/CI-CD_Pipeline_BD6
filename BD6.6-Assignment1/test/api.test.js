const request = require("supertest");
const http = require("http");
const { app } = require("../index");
const { getAllShows, addShow } = require("../controllers");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllShows: jest.fn(),
  addShow: jest.fn(),
}));

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(() => {
  server.close();
});

describe("API Endpoint Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /shows should return all shows", async () => {
    const mockedShows = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
    ];
    getAllShows.mockReturnValue(mockedShows);

    const res = await request(server).get("/shows");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ shows: mockedShows });
  });

  it("GET /shows/:id should return a specific show", async () => {
    const mockedShow = {
      showId: 1,
      title: "The Lion King",
      theatreId: 1,
      time: "7:00 PM",
    };
    getAllShows.mockReturnValue([mockedShow]);

    const res = await request(server).get("/shows/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ show: mockedShow });
  });

  it("GET /shows/:id should return 404 for invalid ID", async () => {
    getAllShows.mockReturnValue([]);
    const res = await request(server).get("/shows/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Show not found" });
  });

  it("POST /shows should add a new show", async () => {
    const newShow = {
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    };
    const mockedNewShow = { showId: 5, ...newShow };

    addShow.mockReturnValue(mockedNewShow);

    const res = await request(server).post("/shows").send(newShow);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockedNewShow);
  });

  it("POST /shows should return 400 for invalid input", async () => {
    const res = await request(server)
      .post("/shows")
      .send({ title: "", theatreId: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid input. All fields are required.",
    });
  });
});
