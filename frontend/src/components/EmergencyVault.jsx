import React, { useState, useEffect } from 'react';

const EmergencyVault = () => {
    const [contacts, setContacts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });

    // Fetch Contacts from MongoDB Express API
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contacts`);
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContact)
            });
            if (res.ok) {
                fetchContacts(); // Refresh list
                setIsAdding(false);
                setNewContact({ name: '', phone: '' });
            }
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contacts/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchContacts();
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    return (
        <section className="glass-card vault-card flex-col">
            <h2>Emergency Vault</h2>

            <div className="vault-grid">
                {contacts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No contacts saved.</p>
                ) : (
                    contacts.map(contact => (
                        <div className="contact-card" key={contact._id}>
                            <div className="contact-avatar"><i className="fa-solid fa-user-shield"></i></div>
                            <div className="contact-info">
                                <p>{contact.name}</p>
                                <span>{contact.phone}</span>
                            </div>
                            <button className="icon-btn" title="Call" style={{ marginRight: '5px' }}><i className="fa-solid fa-phone"></i></button>
                            <button className="icon-btn" title="Delete" onClick={() => handleDeleteContact(contact._id)} style={{ color: 'var(--neon-pink)' }}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {!isAdding ? (
                <button className="glass-btn btn-small mt-2" style={{ border: '1px dashed var(--glass-border)' }} onClick={() => setIsAdding(true)}>
                    <i className="fa-solid fa-plus"></i> Add Emergency Contact
                </button>
            ) : (
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', marginTop: '10px' }}>
                    <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Name (e.g., Mom)"
                            required
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }}
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            required
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }}
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button type="submit" className="neon-btn" style={{ flex: 1, padding: '5px' }}>Save</button>
                            <button type="button" className="glass-btn" style={{ flex: 1, padding: '5px' }} onClick={() => setIsAdding(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <h3 className="mt-4 sub-heading"><i className="fa-solid fa-clock-rotate-left"></i> Alert History</h3>
            <ul className="alert-history">
                <li>
                    <div className="history-icon green"><i className="fa-solid fa-route"></i></div>
                    <div className="history-content">
                        <p>Safe route taken</p>
                        <span>2 hrs ago</span>
                    </div>
                </li>
            </ul>
        </section>
    );
};

export default EmergencyVault;
