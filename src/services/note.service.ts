import { INote } from "../models/note.model";

const Note = require('../models/note.model');

class NoteService {
    //Create a note
    async create (noteData : INote) {
        return await Note.create(noteData);
    }
    //Edit a note
    async update (noteUpdate : INote) {
        return await Note.findByIdAndUpdate(noteUpdate, {
            new: true
        });
    }
    //Delete a note
    async delete (noteId : string) {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        return deletedNote
    }
    //Get a single note
    async fetchOne(noteFetchOne : INote) {
        return await Note.findOne(noteFetchOne);
    }
    //Fetch all notes
    async fetch (filter : INote) {
        return await Note.find(filter);
    }
}

module.exports = new NoteService();