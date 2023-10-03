import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generateId from "../helpers/generateId.js";

const vetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generateId()
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

vetSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

vetSchema.methods.checkPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
}

const Vet = mongoose.model('Vet', vetSchema);

export default Vet;