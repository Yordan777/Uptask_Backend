import mongoose , {Schema , Document} from "mongoose";


export interface IUser extends Document {
    name: string
    email: string
    password: string
    confirmed: boolean
}

const UserSchema : Schema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowercase : true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    confirmed: {
        type: Boolean,
        require: true,
        default: false
    },
})


const User = mongoose.model<IUser>('User', UserSchema)
export default User