import mongoose, { Document, Types, Schema } from "mongoose";

export interface IBook extends Document {
    title: string;
    user: Types.ObjectId;
    createdAt?: Date;
    updateAt?: Date;
    //user id
}

const BookSchema: Schema = new Schema({
    title: {
        type: String, required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true })

export default mongoose.model<IBook>("book", BookSchema);