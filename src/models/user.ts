import mongoose, { Document, Types, MongooseError, Schema } from "mongoose";
import bcrypt from "bcrypt";

// define user interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    _id: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>
}

//create schema
const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Compare passwords
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("user", UserSchema);