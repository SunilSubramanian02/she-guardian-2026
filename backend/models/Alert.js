const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    location: {
        type: String,
        default: 'Unknown Location'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Dispatched', 'Resolved', 'False Alarm'],
        default: 'Dispatched'
    }
});

module.exports = mongoose.model('Alert', alertSchema);
