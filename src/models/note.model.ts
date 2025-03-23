import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    title : string, 
    content : string, 
    category: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const NoteSchema: Schema = new Schema<INote>({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: false, index: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } 
})

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;
