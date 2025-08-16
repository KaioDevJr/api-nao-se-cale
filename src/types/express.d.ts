import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';


export interface AuthedRequest extends Request {
  user?: DecodedIdToken;
}

