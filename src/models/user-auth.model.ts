import mongoose, { Date, Schema, Document } from "mongoose"

export interface IUser {
    username: string,
    email: string,
    passwordHash: string,
    createdAt?: Date,
    updatedAt?: Date
}

const UserSchema : Schema = new Schema<IUser>({
    username: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, maxlength: 200, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    passwordHash: { type: String, required: true, trim: true, maxlength: 2000 },
    },
    { timestamps: true }
);

export interface IAuthCredentials {
    email: string;
    password: string; 
}

const AuthCredentialsSchema : Schema = new Schema<IAuthCredentials> ({
    email: { type: String, required: true, trim: true, maxlength: 200, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, trim: true, maxlength: 2000 }
    }
);

export interface IAuthResponse {
    user: IUser; 
    token: string;
}

export interface IJwt {
    username: string,
    email: string,
}


const User = mongoose.model<IUser>('User', UserSchema);
const AuthCredentials = mongoose.model<IAuthCredentials>('AuthCredentials', AuthCredentialsSchema);

export { User, AuthCredentials };
