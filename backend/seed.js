require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('./models/Contact'); // Adjust path to models/Contact.js

const seedDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sheguardian';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected to Insert Default Contacts');

        // Check existing contacts
        const existingContacts = await Contact.find();

        const defaultContacts = [
            { name: "Police", phone: "100", relation: "Emergency" },
            { name: "Women Helpline", phone: "181", relation: "Emergency" },
            { name: "Cybercrime", phone: "1930", relation: "Emergency" },
            { name: "Dad", phone: "9876543210", relation: "Guardian" },
            { name: "Mom", phone: "8765432109", relation: "Guardian" }
        ];

        let insertedCount = 0;

        for (let contact of defaultContacts) {
            const exists = existingContacts.some(c => c.name === contact.name || c.phone === contact.phone);
            if (!exists) {
                await Contact.create(contact);
                insertedCount++;
            }
        }

        console.log(`Successfully seeded ${insertedCount} new contacts.`);
        process.exit();
    } catch (err) {
        console.error("Failed to seed database: ", err);
        process.exit(1);
    }
};

seedDB();
