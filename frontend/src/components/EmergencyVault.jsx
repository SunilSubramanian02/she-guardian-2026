import React, { useState, useEffect } from 'react';

const EmergencyVault = () => {
    const [contacts, setContacts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiUrl) throw new Error("API URL not configured");

            const res = await fetch(`${apiUrl}/api/contacts`);
            const data = await res.json();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiUrl) return;

            const res = await fetch(`${apiUrl}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newContact, relation: 'Guardian' })
            });

            if (res.ok) {
                await fetchContacts();
                setIsAdding(false);
                setNewContact({ name: '', phone: '' });
            }
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiUrl) return;

            const res = await fetch(`${apiUrl}/api/contacts/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchContacts();
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    return (
        <section className="glass-card flex flex-col p-6 w-full relative">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-vault"></i> Guardian Vault
            </h2>

            <div className="grid gap-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center p-4"><i className="fa-solid fa-spinner fa-spin text-neon-blue"></i></div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <i className="fa-solid fa-user-shield text-3xl text-gray-600 mb-2"></i>
                        <p className="text-gray-400 text-sm">No guardians added yet.<br />Add a trusted contact to alert them during emergencies.</p>
                    </div>
                ) : (
                    contacts.map(contact => (
                        <div key={contact._id} className="group relative bg-[#0f111a]/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all hover:bg-white/5 hover:border-white/20 overflow-hidden">
                            {/* Accent line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-neon-blue flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-user"></i>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate">{contact.name}</h3>
                                <p className="text-sm text-gray-400 truncate">{contact.phone}</p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {/* FIX: Wrapping icon in a real anchor tel link so it opens the phone dialer */}
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="w-10 h-10 rounded-lg bg-green-500/10 text-safe-green hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors border border-green-500/20"
                                    title={`Call ${contact.name}`}
                                >
                                    <i className="fa-solid fa-phone"></i>
                                </a>

                                <button
                                    onClick={() => handleDeleteContact(contact._id)}
                                    className="w-10 h-10 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors duration-200"
                                    title="Remove Guardian"
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 rounded-xl border border-dashed border-white/30 text-neon-blue bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <i className="fa-solid fa-user-plus"></i> Add New Guardian
                </button>
            ) : (
                <div className="bg-[#0f111a] border border-white/10 rounded-xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <h3 className="text-sm font-semibold text-white mb-3">New Guardian Details</h3>
                    <form onSubmit={handleAddContact} className="flex flex-col gap-3">
                        <div className="relative">
                            <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                            <input
                                type="text"
                                placeholder="Name (e.g. Mom, Dad)"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black font-semibold transition-colors">
                                Save Guardian
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

export default EmergencyVault;
