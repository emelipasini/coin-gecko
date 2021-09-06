import { NextFunction, Request, Response } from "express";

import { User } from "../domain/user";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.get("Authorization")) {
        return res.status(401).send({ status: 401, message: "Unauthorized" });
    }

    const userJwt = req.get("Authorization").slice("Bearer ".length);
    const userObj: any = User.validateToken(userJwt);

    let { error } = userObj;
    if (error) {
        res.status(401).json({ error });
        return;
    }

    req.query.userObj = userObj;
    next();
}
