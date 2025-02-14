import { RequestHandler } from "msw";
import interviewHandler from "./interview";
import userHandler from "./user";
import interviewerHandler from "./interviewer";

const handlers: RequestHandler[] = [
  ...interviewHandler,
  ...userHandler,
  ...interviewerHandler,
];

export default handlers;
