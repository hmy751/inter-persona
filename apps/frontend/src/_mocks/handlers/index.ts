import { RequestHandler } from "msw";
import interviewHandler from "./interview";
import userHandler from "./user";
import interviewerHandler from "./interviewer";
import resultHandler from "./result";
const handlers: RequestHandler[] = [
  ...interviewHandler,
  ...userHandler,
  ...interviewerHandler,
  ...resultHandler,
];

export default handlers;
