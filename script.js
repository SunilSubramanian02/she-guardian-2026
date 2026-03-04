document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Smart SOS Interface ---
    const sosBtn = document.getElementById('sos-btn');
    const sosModal = document.getElementById('sos-modal');
    const cancelSosBtn = document.getElementById('cancel-sos');
    const countdownTimer = document.getElementById('countdown-timer');
    const alertTitle = document.querySelector('.alert-title');
    const alertSimText = document.querySelector('.alert-sim-text');
    let timerInterval;

    const resetModalUI = () => {
        alertTitle.textContent = "EMERGENCY ALERT TRIGGERED";
        alertTitle.style.color = "";
        alertSimText.textContent = "Simulated alert sent to emergency contacts & nearby authorities.";
        countdownTimer.innerHTML = "5";
        const circle = document.querySelector('.countdown-circle circle');
        circle.style.animation = 'none';
        circle.offsetHeight; // trigger reflow
        circle.style.animation = null;
    };

    sosBtn.addEventListener('click', () => {
        // Trigger Modal
        sosModal.classList.remove('hidden');
        resetModalUI();

        // Shake UI for 1 second
        document.body.classList.add('shaking');
        setTimeout(() => {
            document.body.classList.remove('shaking');
        }, 1000);

        // Start Countdown
        let count = 5;
        countdownTimer.textContent = count;

        // simulate haptic feedback if mobile
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 500]);
        }

        timerInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownTimer.textContent = count;
            } else if (count === 0) {
                countdownTimer.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
                clearInterval(timerInterval);

                // Fetch from Backend
                fetch('/api/sos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        location: "Simulated Current Location",
                        timestamp: new Date().toISOString()
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        countdownTimer.innerHTML = "<i class='fa-solid fa-check'></i>";
                        alertTitle.textContent = "ALERTS DISPATCHED";
                        alertTitle.style.color = "var(--safe-green)";
                        alertSimText.textContent = data.message;
                        if (navigator.vibrate) navigator.vibrate([500]);
                    })
                    .catch(err => {
                        console.error("SOS Dispatch Error:", err);
                        countdownTimer.innerHTML = "<i class='fa-solid fa-xmark'></i>";
                        alertTitle.textContent = "DISPATCH FAILED";
                        alertTitle.style.color = "var(--neon-pink)";
                        alertSimText.textContent = "Network error. Try calling directly.";
                    });
            }
        }, 1000);
    });

    cancelSosBtn.addEventListener('click', () => {
        sosModal.classList.add('hidden');
        clearInterval(timerInterval);
        showToast("Emergency alert cancelled.");
    });


    // --- 2. Innovation Mode Toggle ---
    const simModeToggle = document.getElementById('sim-mode-toggle');

    simModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('sim-mode-active');
            if (navigator.vibrate) navigator.vibrate(50);
            showToast("Emergency Simulation Mode Activated");
        } else {
            document.body.classList.remove('sim-mode-active');
            showToast("Normal Mode Restored");
        }
    });

    // --- 3. Digital Safety Shield Score Animation ---
    const circle = document.querySelector('.circle');
    const scoreText = document.getElementById('score-text');

    // Fetch from backend
    fetch('/api/safety-score')
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                circle.style.strokeDasharray = `${data.score}, 100`;
                // Animate number
                let current = 0;
                const target = data.score;
                const counter = setInterval(() => {
                    current += 2;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    scoreText.textContent = current + "%";
                }, 40);
            }, 800);
        })
        .catch(err => console.error("Error fetching score:", err));

    // --- 4. Heatmap Button Mock Logic ---
    const routeBtn = document.getElementById('btn-route');
    const pathLine = document.querySelector('.path-line');

    routeBtn.addEventListener('click', () => {
        const originalText = routeBtn.innerHTML;
        routeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        routeBtn.style.pointerEvents = 'none';

        fetch('/api/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start: "Current Location", destination: "Safe Zone" })
        })
            .then(res => res.json())
            .then(data => {
                routeBtn.innerHTML = '<i class="fa-solid fa-check"></i> ' + data.message.split(' ')[0] + ' Route Found';
                routeBtn.style.color = "var(--safe-green)";
                routeBtn.style.borderColor = "var(--safe-green)";

                // Show path line
                pathLine.classList.add('active');

                setTimeout(() => {
                    routeBtn.innerHTML = originalText;
                    routeBtn.style.color = "";
                    routeBtn.style.borderColor = "";
                    routeBtn.style.pointerEvents = 'auto';
                }, 4000);
            })
            .catch(err => {
                console.error("Route calculation error:", err);
                routeBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error';
                setTimeout(() => {
                    routeBtn.innerHTML = originalText;
                    routeBtn.style.pointerEvents = 'auto';
                }, 2000);
            });
    });

    // --- 5. Fake Call Generator ---
    const btnFakeCall = document.getElementById('btn-fake-call');
    const fakeCallModal = document.getElementById('fake-call-modal');

    if (btnFakeCall) {
        btnFakeCall.addEventListener('click', () => {
            const originalText = btnFakeCall.innerHTML;
            btnFakeCall.innerHTML = 'Scheduling...';
            btnFakeCall.style.pointerEvents = 'none';

            let countdown = 5;
            const callInterval = setInterval(() => {
                btnFakeCall.innerHTML = `Incoming in ${countdown}s`;
                countdown--;
                if (countdown < 0) {
                    clearInterval(callInterval);
                    btnFakeCall.innerHTML = originalText;
                    btnFakeCall.style.pointerEvents = 'auto';

                    // Show full screen call
                    fakeCallModal.classList.remove('hidden');
                    if (navigator.vibrate) navigator.vibrate([1000, 500, 1000, 500, 1000]);
                }
            }, 1000);
        });
    }

    const btnDecline = document.getElementById('btn-decline');
    const btnAnswer = document.getElementById('btn-answer');

    if (btnDecline) btnDecline.addEventListener('click', () => {
        fakeCallModal.classList.add('hidden');
        if (navigator.vibrate) navigator.vibrate(0);
        // Reset answer button if it was clicked
        btnAnswer.style.display = 'flex';
        btnDecline.style.width = '75px';
        btnDecline.style.borderRadius = '50%';
        document.querySelector('.call-info p').textContent = "Mobile";
    });

    if (btnAnswer) {
        btnAnswer.addEventListener('click', () => {
            document.querySelector('.call-info p').textContent = "00:01";
            btnAnswer.style.display = 'none';
            btnDecline.style.width = '100%';
            btnDecline.style.borderRadius = '35px';
            if (navigator.vibrate) navigator.vibrate(0); // stop vibration

            // Start fake call timer
            let callSeconds = 1;
            const activeCallInterval = setInterval(() => {
                if (fakeCallModal.classList.contains('hidden')) {
                    clearInterval(activeCallInterval);
                    return;
                }
                callSeconds++;
                const mins = Math.floor(callSeconds / 60).toString().padStart(2, '0');
                const secs = (callSeconds % 60).toString().padStart(2, '0');
                document.querySelector('.call-info p').textContent = `${mins}:${secs}`;
            }, 1000);
        });
    }

    // --- 6. Guardian Drone Link ---
    const btnDrone = document.getElementById('btn-drone');
    const droneRadar = document.getElementById('drone-radar');
    const radarText = document.querySelector('.radar-text');

    if (btnDrone) {
        btnDrone.addEventListener('click', () => {
            btnDrone.style.display = 'none';
            droneRadar.classList.remove('hidden');
            radarText.textContent = "Locating drone...";

            setTimeout(() => {
                radarText.textContent = "Drone SG-7 deployed. ETA: 2 mins.";
                radarText.style.color = "white";
                document.querySelector('.radar-sweep').style.background = "conic-gradient(from 0deg, transparent 70%, rgba(255,0,127,0.6) 100%)";
                droneRadar.style.borderColor = "var(--neon-pink)";
                droneRadar.style.background = "rgba(255,0,127,0.05)";

                setTimeout(() => {
                    droneRadar.classList.add('hidden');
                    btnDrone.style.display = 'flex';
                    // reset styles
                    radarText.style.color = "var(--safe-green)";
                    droneRadar.style.borderColor = "rgba(0,255,136,0.3)";
                    droneRadar.style.background = "rgba(0,255,136,0.05)";
                    document.querySelector('.radar-sweep').style.background = "conic-gradient(from 0deg, transparent 70%, rgba(0,255,136,0.4) 100%)";
                    showToast("Drone SG-7 is en route to your location.");
                }, 4000);
            }, 3000);
        });
    }

    // --- Helper: Toast Notification ---
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    let toastTimeout;

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
