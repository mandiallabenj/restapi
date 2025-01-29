import mongoose, { Document, Types, Schema } from "mongoose";

export interface IBook extends Document {
    title: string;
    user: Types.ObjectId
    //user id
}

const BookSchema: Schema = new Schema({
    title: {
        type: String, required: true,
        // user id
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.model<IBook>("book", BookSchema);