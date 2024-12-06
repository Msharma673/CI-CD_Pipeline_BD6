const request = require("supertest");
const http = require("http");
const { getAllGames, getGameById } = require("../controllers");
const { app } = require("../index");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllGames: jest.fn(),
  getGameById: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe("Controller Function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all games", () => {
    const mockedGames = [
      {
        gameId: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Adventure",
        platform: "Nintendo Switch",
      },
      {
        gameId: 2,
        title: "Red Dead Redemption 2",
        genre: "Action",
        platform: "PlayStation 4",
      },
      {
        gameId: 3,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        platform: "PC",
      },
    ];

    getAllGames.mockReturnValue(mockedGames);
    const result = getAllGames();
    expect(result).toEqual(mockedGames);
    expect(result.length).toBe(3);
  });

  it("should return a game by ID", () => {
    const mockedGame = {
      gameId: 1,
      title: "The Legend of Zelda: Breath of the Wild",
      genre: "Adventure",
      platform: "Nintendo Switch",
    };

    getGameById.mockReturnValue(mockedGame);
    const result = getGameById(1);
    expect(result).toEqual(mockedGame);
  });
});

describe("API Endpoint tests", () => {
  it("GET /games should get all games", async () => {
    const mockedGames = [
      {
        gameId: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Adventure",
        platform: "Nintendo Switch",
      },
      {
        gameId: 2,
        title: "Red Dead Redemption 2",
        genre: "Action",
        platform: "PlayStation 4",
      },
      {
        gameId: 3,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        platform: "PC",
      },
    ];

    // Ensure the mock returns the expected data
    getAllGames.mockReturnValue(mockedGames);

    // Perform the actual GET request
    const res = await request(server).get("/games");

    // Verify the response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      games: mockedGames,
    });
  });

  it("GET /games/details/:id should get a game by ID", async () => {
    const mockedGame = {
      gameId: 1,
      title: "The Legend of Zelda: Breath of the Wild",
      genre: "Adventure",
      platform: "Nintendo Switch",
    };

    // Mock the return value for a specific game ID
    getGameById.mockReturnValue(mockedGame);

    // Perform the actual GET request with a specific game ID
    const res = await request(server).get("/games/details/1");

    // Verify the response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      game: mockedGame,
    });
  });

  it("GET /games/details/:id should return 404 if game not found", async () => {
    // Mock the scenario where no game is found for the given ID
    getGameById.mockReturnValue(null);

    // Perform the actual GET request with a non-existing game ID
    const res = await request(server).get("/games/details/999");

    // Verify the response
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Game not found");
  });
});

describe("Mock Function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should call getAllGames function when GET /games is invoked", async () => {
    const mockedGames = [
      {
        gameId: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Adventure",
        platform: "Nintendo Switch",
      },
      {
        gameId: 2,
        title: "Red Dead Redemption 2",
        genre: "Action",
        platform: "PlayStation 4",
      },
      {
        gameId: 3,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        platform: "PC",
      },
    ];

    getAllGames.mockReturnValue(mockedGames);

    // Perform the GET request to /games
    await request(server).get("/games");

    expect(getAllGames).toHaveBeenCalledTimes(1);
    expect(getAllGames).toHaveBeenCalledWith();
  });
});
