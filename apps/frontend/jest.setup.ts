import "@repo/testing-config/jest.setup.base";
import { server } from "./src/_mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
