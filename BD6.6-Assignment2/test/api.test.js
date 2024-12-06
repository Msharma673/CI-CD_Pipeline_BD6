const request = require("supertest");
const http = require("http");
const { app } = require("../index");
const { getAllStocks, addTrade } = require("../controllers");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  addTrade: jest.fn(),
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

  it("GET /stocks should return all stocks", async () => {
    const mockedStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
    ];
    getAllStocks.mockReturnValue(mockedStocks);

    const res = await request(server).get("/stocks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ stocks: mockedStocks });
  });

  it("GET /stocks/:ticker should return a specific stock by ticker", async () => {
    const mockedStock = {
      stockId: 1,
      ticker: "AAPL",
      companyName: "Apple Inc.",
      price: 150.75,
    };
    jest
      .spyOn(require("../controllers"), "getStockByTicker")
      .mockReturnValue(mockedStock);

    const res = await request(server).get("/stocks/AAPL");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ stock: mockedStock });
  });

  it("GET /stocks/:ticker should return 404 for invalid ticker", async () => {
    jest
      .spyOn(require("../controllers"), "getStockByTicker")
      .mockReturnValue(undefined);

    const res = await request(server).get("/stocks/INVALID");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Stock not found" });
  });

  it("POST /trades/new should add a new trade", async () => {
    const newTrade = {
      stockId: 1,
      quantity: 15,
      tradeType: "buy",
      tradeDate: "2024-08-08",
    };
    const mockedNewTrade = { tradeId: 4, ...newTrade };

    addTrade.mockReturnValue(mockedNewTrade);

    const res = await request(server).post("/trades/new").send(newTrade);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ trade: mockedNewTrade });
  });

  it("POST /trades/new should return 400 for invalid input", async () => {
    const res = await request(server).post("/trades/new").send({ stockId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid input. All fields are required.",
    });
  });
});
