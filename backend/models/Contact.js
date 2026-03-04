const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    relation: {
        type: String,
        default: 'Family'
    }
});

module.exports = mongoose.model('Contact', contactSchema);
