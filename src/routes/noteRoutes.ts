
import NoteController from '../controllers/noteController';
import { validateNote } from "../middlewares/validator";
import {Request, Response, NextFunction} from 'express';

const express = require('express');
const router = express.Router();
const noteController = new NoteController();

export const handleError = (res: Response, error: any) => {
    console.error(error); 
    res.status(500).json({ message: "Internal Server Error" });
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteController.getNotes(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteController.getNoteById(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/categories/:categoryId", async (req: Request<{categoryId: string}>, res: Response, next: NextFunction) => {
    try {
        await noteController.getByCategoryId(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/", validateNote, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteController.createNote(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", validateNote, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteController.updateNote(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteController.deleteNote(req, res, next);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;

