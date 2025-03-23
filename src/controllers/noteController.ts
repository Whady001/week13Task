import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Note, {INote} from '../models/note.model';
const NoteService = require('../services/note.service');
import Category from "../models/category";
import { NotFoundError, BadRequestError } from "../middlewares/errorHandler";
//import { title } from "node:process";

//let notes : INote[] = [];

class NoteController <INote>{
    //get all notes
    async getNotes(req: Request, res: Response, next : NextFunction) {
        try {
            const notes = await Note.find().populate("category", "name");
            res.status(200).json(notes);
        } catch (error) {
            res.status(500).json({ message: `Could not get notes` });
            next(error);
        }
    }

    //get note by id
    async getNoteById(req: Request, res: Response, next: NextFunction) {
        const noteId = req.params._id; 
        try {
            const existingNote = await NoteService.fetchOne({ _id: noteId });
            if (!existingNote) {
                return res.status(404).json({
                    success: false,
                    message: "Note with Id does not exist"
                });
                return next(new NotFoundError("Invalid note ID"));
            }
            res.status(200).json({
                success: true,
                message: "Note fetched successfully",
                data: existingNote
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching note" });
        }
    }

    //get by category id
    async getByCategoryId (req: Request <{categoryId: string}>, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;
        
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
              return next(new BadRequestError("Invalid category ID"));
            }
        
            const notes = await Note.find({ category: categoryId }).populate("category", "name");
        
            res.json(notes);
        } catch (error) {
            next(error);
        }
    }
    
    //create a note
    async createNote(req: Request, res: Response, next: NextFunction) {
        const reqBody = req.body;
        try {
            const existingNote = await NoteService.fetchOne({
                name: reqBody.name.toLowerCase()
            });
            const { title, content, category } = req.body;
            let categoryId = category;

            if (!category) {
            let defaultCategory = await Category.findOne({ name: "Uncategorized" });
            if (!defaultCategory) {
                defaultCategory = new Category({ name: "Uncategorized" });
                await defaultCategory.save();
            }
            categoryId = defaultCategory._id;
            } else {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return next(new BadRequestError("Invalid category ID"));
            }

            let existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return next(new BadRequestError("Category not found"));
            }
            categoryId = existingCategory._id;
            }
            if (existingNote) {
                return res.status(403).json({
                    success: false,
                    message: "Note already exists"
                });
            }
            const newNote = await NoteService.create(reqBody);
            res.status(201).json({
                success: true,
                message: "Note created successfully",
                data: newNote
            });
        } catch (error) {
            res.status(500).json({ message: "Error creating note" });
        }
    }

    // Update a note
    async updateNote(req: Request, res: Response, next: NextFunction) {
        const noteId = req.params._id; 
        const updateData: string = req.body;
        try {
            const existingNote = await NoteService.fetchOne({ _id: noteId });
            if (!existingNote) {
                return res.status(404).json({
                    success: false,
                    message: "Note does not exist"
                });
            }

            // Check for unique title
            if (updateData) {
                const existingNoteWithUpdateTitle = await NoteService.fetchOne({
                    title: updateData.toLowerCase()
                });
                if (existingNoteWithUpdateTitle && existingNote._id.toString() !== existingNote._id.toString()) {
                    return res.status(403).json({
                        success: false,
                        message: "Note with updated name already exists"
                    });
                }
            }

            const updatedData = await NoteService.update(noteId, updateData);
            return res.status(200).json({
                success: true,
                message: "Note updated successfully",
                data: updatedData
            });
        } catch (error) {
            res.status(500).json({ message: "Error updating note" });
        }
    }

    //delete a note
    async deleteNote(req: Request, res: Response, next: NextFunction) {
        try {
            const noteId = req.params._id; 
            const note = await Note.findByIdAndDelete(req.params._id);
            if (!mongoose.Types.ObjectId.isValid(noteId)) {
                return next(new NotFoundError("Invalid note ID"));
            }
            else if (!note) {
                return res.status(404).send('Note not found');
            }
                res.status(204).json({message : `Note with ID ${noteId} deleted successfully`});
        } catch (error) {
            res.status(500).send('Error deleting note');
        }
    }
};

export default NoteController;