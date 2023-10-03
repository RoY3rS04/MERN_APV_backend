import Patient from "../models/Patient.js"

const addPatient = async (req, res) => {
    const patient = new Patient(req.body);
    patient.vet = req.vet._id;

    try {
        const savedPatient = await patient.save();

        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    }
}

const getPatients = async (req, res) => {
    const patients = await Patient.find({vet: req.vet._id});

    res.json(patients);
}

const getPatient = async (req, res) => {
    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }

    if (patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({ msg: 'No valid action' });
    }

    res.json(patient);
}

const updatePatient = async (req, res) => {
    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
        return res.json({ msg: 'Patient not found' });
    }

    if (patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({ msg: 'No valid action' });
    }

    //Update patient
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        const updatedPatient = await patient.save();

        res.json(updatedPatient);
    } catch (error) {
        console.log(error);
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }

    if (patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({ msg: 'No valid action' });
    }

    try {
        await patient.deleteOne();
        res.json({ msg: 'Patient deleted successfully' });
    } catch (error) {
        console.log(error);
    }
}

export {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
}