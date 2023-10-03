import Vet from '../models/Vet.js';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';
import registerEmail from '../helpers/registerEmail.js';
import forgetPasswordEmail from '../helpers/forgetPasswordEmail.js';

const register = async (req, res) => {

    const { email, name } = req.body;

    const userExists = await Vet.findOne({ email });

    if (userExists) {
        const error = new Error('The user already exists');

        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const vet = new Vet(req.body);

        const savedVet = await vet.save();

        registerEmail({
            email,
            name,
            token: savedVet.token
        });

        res.json(savedVet);
    } catch (error) {
        console.log(error);
    }
}

const profile = (req, res) => {

    const { vet } = req;

    res.json(vet);
}

const confirmAcount = async (req, res) => {

    const { token } = req.params;

    const confirmUser = await Vet.findOne({ token });

    if (!confirmUser) {
        const error = new Error('Token no valido');

        return res.status(404).json({ msg: error.message });
    }

    try {

        confirmUser.token = null;
        confirmUser.confirmed = true;

        await confirmUser.save();

        res.json({
            msg: 'User confirmed correctly'
        });

    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    const user = await Vet.findOne({ email });

    if (!user) {
        const error = new Error(`The user doesn't exists`);

        return res.status(403).json({ msg: error.message });
    }

    if (!user.confirmed) {
        const error = new Error(`Your account hasn't been confirmed yet`);

        return res.status(403).json({ msg: error.message });
    }

    //Check if the password is correct

    if (await user.checkPassword(password)) {
        //Authenticate user

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        });

    } else {
        const error = new Error(`The password you provided is not correct`);

        return res.status(403).json({ msg: error.message });
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const vetExists = await Vet.findOne({ email });

    if (!vetExists) {
        const error = new Error('The user does not exists');

        return res.status(404).json({ msg: error.message });
    }

    try {
        vetExists.token = generateId();

        await vetExists.save();

        forgetPasswordEmail({
            email,
            name: vetExists.name,
            token: vetExists.token
        })

        res.json({msg: 'We have delivered an email with the steps you have to follow'})
    } catch (error) {
        console.log(error);
    }
}

const checkToken = async (req, res) => {
    const { token } = req.params;

    const vet = await Vet.findOne({ token });

    if (vet) {
        res.json({ msg: 'Valid token' });
    } else {
        const myError = new Error('Invalid token');

        res.status(400).json({msg: myError.message})
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const vet = await Vet.findOne({ token });

    if (!vet) {
        const error = new Error('Oops there was an error');

        return res.status(400).json({ msg: error.message });
    }

    try {

        vet.token = null;
        vet.password = newPassword;

        await vet.save();
        
        res.json({ msg: 'The password was modified correctly' });
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    const vet = await Vet.findById(req.params.id);

    if (!vet) {
        const error = new Error('There was an error');
        return res.status(404).json({msg: error.message})
    }

    const { email } = req.body;

    if (vet.email !== email) {
        const existsEmail = await Vet.findOne({ email });

        if (existsEmail) {
            const error = new Error('That email is already registered');
            return res.status(404).json({msg: error.message})
        }
    }

    try {
        vet.name = req.body.name;
        vet.email = email;
        vet.web = req.body.web;
        vet.phone = req.body.phone;

        const updatedVet = await vet.save();

        res.json(updatedVet);

    } catch (error) {
        console.log(error);
    }
}

const updatePassword = async (req, res) => {
    
    //Read data
    const { id } = req.vet;
    const { password, new_password } = req.body;

    //See if vet exists
    const vet = await Vet.findById(id);

    if (!vet) {
        const error = new Error('There was an error');
        return res.status(404).json({msg: error.message})
    }

    //Prove te password
    if (await vet.checkPassword(password)) {
        vet.password = new_password;

        await vet.save();

        res.json({ msg: 'Password updated successfully' });
    } else {
        const error = new Error('The actual password you provided is not correct');
        return res.status(404).json({msg: error.message})
    }
}

export {
    register,
    profile,
    confirmAcount,
    authenticate,
    forgetPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
}