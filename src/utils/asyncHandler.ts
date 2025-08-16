import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request | any, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an async route handler to catch any thrown errors and pass them to the Express error-handling middleware.
 * @param fn The async controller function to execute.
 * @returns A standard Express request handler.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

