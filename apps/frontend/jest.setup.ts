import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/frontend/.env.test') });

import '@testing-library/jest-dom';

import '@repo/testing-config/jest.setup.base';
import { server } from './src/_mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

import '@/_tests/_mocks/recorder';
import '@/_tests/_mocks/window';
import '@/_tests/_mocks/zustand';
import '@/_tests/_mocks/nextjs';
