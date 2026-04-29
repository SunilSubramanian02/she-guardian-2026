// frontend/src/utils/hardwareApis.js

let wakeLock = null;
let strobeInterval = null;
let videoTrack = null;

/**
 * Requests a screen wake lock to prevent the screen from dimming or turning off.
 */
export const requestMaxBrightness = async () => {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock is active');
            
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock has been released');
            });
        } else {
            console.warn('Screen Wake Lock API not supported by this browser.');
        }
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};

/**
 * Releases the screen wake lock.
 */
export const releaseWakeLock = () => {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
    }
};

/**
 * Activates the device's rear camera torch and flashes it in a strobe pattern.
 */
export const startStrobeLight = async () => {
    try {
        // Stop any existing strobe
        stopStrobeLight();

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        const tracks = stream.getVideoTracks();
        if (tracks.length > 0) {
            videoTrack = tracks[0];
            const capabilities = videoTrack.getCapabilities();
            
            if (capabilities.torch) {
                let isTorchOn = false;
                
                // Strobe interval (e.g., 100ms on, 100ms off)
                strobeInterval = setInterval(async () => {
                    isTorchOn = !isTorchOn;
                    try {
                        await videoTrack.applyConstraints({
                            advanced: [{ torch: isTorchOn }]
                        });
                    } catch (e) {
                        console.error('Error applying torch constraint:', e);
                        clearInterval(strobeInterval);
                    }
                }, 150); // 150ms strobe rate
                
            } else {
                console.warn('Torch is not supported on this device/camera.');
                // Clean up track since we can't use it
                videoTrack.stop();
                videoTrack = null;
            }
        }
    } catch (err) {
        console.error('Error accessing camera for strobe:', err);
    }
};

/**
 * Stops the strobe light and releases the camera track.
 */
export const stopStrobeLight = async () => {
    if (strobeInterval) {
        clearInterval(strobeInterval);
        strobeInterval = null;
    }
    
    if (videoTrack) {
        try {
            // Turn off torch before stopping track
            await videoTrack.applyConstraints({
                advanced: [{ torch: false }]
            });
        } catch (e) {
            console.error('Error turning off torch:', e);
        } finally {
            videoTrack.stop();
            videoTrack = null;
        }
    }
};
