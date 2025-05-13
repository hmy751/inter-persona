import { userHandlers } from './user';
import { interviewerHandlers } from './interviewer';
import { interviewHandlers } from './interview';
import { resultHandlers } from './result';

const handlers = [...userHandlers, ...interviewerHandlers, ...interviewHandlers, ...resultHandlers];

export default handlers;
