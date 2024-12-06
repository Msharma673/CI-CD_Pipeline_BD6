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
    const res = await request(server).get("/games");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      games: [
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
      ],
    });
  });

  it("GET /games/details/:id should get a game by ID", async () => {
    const res = await request(server).get("/games/details/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      game: {
        gameId: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Adventure",
        platform: "Nintendo Switch",
      },
    });
  });

  it("GET /games/details/:id should return 404 if game not found", async () => {
    // Ensure the mock returns null when the game isn't found
    getGameById.mockReturnValue(null);

    const res = await request(server).get("/games/details/999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Game not found");
  });
});
