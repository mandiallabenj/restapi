import { Router, Request, Response } from "express";
const router = Router();

interface User {
    id: string;
    username: string;
    password: string;
    active: boolean;
}

// get all users
// get a user
// update a user
// delete a user