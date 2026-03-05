import React, { useState } from 'react';

const EmpowermentHub = () => {
    const [activeModal, setActiveModal] = useState(null); // 'defense', 'legal', or null

    return (
        <section className="glass-card flex flex-col p-6 w-full">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-400 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-fire-flame-curved"></i> Empowerment Hub
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={() => setActiveModal('defense')}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-500/10 to-red-500/5 hover:from-pink-500/20 hover:to-red-500/10 border border-pink-500/20 rounded-xl transition-all duration-300 group shadow-lg"
                >
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-hand-fist text-neon-pink text-xl drop-shadow-[0_0_8px_rgba(255,16,122,0.8)]"></i>
                    </div>
                    <span className="font-semibold text-white tracking-wide">Defense Tips</span>
                </button>

                <button
                    onClick={() => setActiveModal('legal')}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10 border border-blue-500/20 rounded-xl transition-all duration-300 group shadow-lg"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-scale-balanced text-neon-blue text-lg drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"></i>
                    </div>
                    <span className="font-semibold text-white tracking-wide">Legal Rights</span>
                </button>
            </div>

            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fa-solid fa-bolt"></i> Quick Access Helplines
            </h3>

            <div className="flex flex-col gap-2 mb-6">
                <button onClick={() => window.open('tel:100', '_self')} className="w-full flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors group">
                    <span className="flex items-center gap-2 font-medium text-white group-hover:text-red-400"><i className="fa-solid fa-building-shield w-5"></i> Police</span>
                    <span className="font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-md">100</span>
                </button>
                <button onClick={() => window.open('tel:181', '_self')} className="w-full flex items-center justify-between p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-colors group">
                    <span className="flex items-center gap-2 font-medium text-white group-hover:text-pink-400"><i className="fa-solid fa-person-dress w-5"></i> Women Helpline</span>
                    <span className="font-bold text-pink-500 bg-pink-500/10 px-3 py-1 rounded-md">181</span>
                </button>
                <button onClick={() => window.open('tel:1930', '_self')} className="w-full flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors group">
                    <span className="flex items-center gap-2 font-medium text-white group-hover:text-blue-400"><i className="fa-solid fa-laptop-shield w-5"></i> Cybercrime</span>
                    <span className="font-bold text-neon-blue bg-blue-500/10 px-3 py-1 rounded-md">1930</span>
                </button>
            </div>

            <div className="mt-auto px-4 py-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-orange-500"></div>
                <p className="font-medium text-sm text-gray-300 italic">"You are your best defense. Stay aware, stay strong."</p>
            </div>

            {/* Hub Info Modals - Replaces native alerts */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveModal(null)}>
                    <div className="relative glass-card w-full max-w-sm p-6 overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-500"></div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {activeModal === 'defense' ? (
                                    <><i className="fa-solid fa-hand-fist text-neon-pink"></i> Self Defense</>
                                ) : (
                                    <><i className="fa-solid fa-scale-balanced text-neon-blue"></i> Legal Rights</>
                                )}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="overflow-y-auto pr-2 custom-scrollbar text-gray-300 space-y-4">
                            {activeModal === 'defense' ? (
                                <>
                                    <p className="font-medium text-white bg-white/5 p-3 rounded-lg border border-white/10">The goal is to escape, not to fight. Create an opportunity to run.</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3"><i className="fa-solid fa-bullseye mt-1 text-pink-400"></i> <span><strong>Vulnerable targets:</strong> Eyes, nose, throat, groin, shins, instep. Strike these with maximum force.</span></li>
                                        <li className="flex gap-3"><i className="fa-solid fa-volume-high mt-1 text-pink-400"></i> <span><strong>Use your voice:</strong> Yell "NO!" or "FIRE!" loudly from your diaphragm. This alerts others and can startle your attacker.</span></li>
                                        <li className="flex gap-3"><i className="fa-solid fa-person-running mt-1 text-pink-400"></i> <span><strong>Heel of palm strike:</strong> Use the hard heel of your palm to strike upward under the nose or chain.</span></li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium text-white bg-white/5 p-3 rounded-lg border border-white/10">In India, women have specific constitutional legal protections.</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3"><i className="fa-solid fa-check mt-1 text-blue-400"></i> <span><strong>Zero FIR:</strong> A First Information Report can be filed at any police station across the country, regardless of jurisdiction.</span></li>
                                        <li className="flex gap-3"><i className="fa-solid fa-user-shield mt-1 text-blue-400"></i> <span><strong>Right to Privacy:</strong> A woman abused or sexually assaulted can record her statement alone with the district magistrate or in presence of female police officer.</span></li>
                                        <li className="flex gap-3"><i className="fa-solid fa-scale-unbalanced mt-1 text-blue-400"></i> <span><strong>Free Legal Aid:</strong> Under the Legal Services Authorities Act, a woman is entitled to free legal aid.</span></li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EmpowermentHub;
