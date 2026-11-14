const powerButton = document.getElementById("powerButton");

const offBackground = document.getElementById("offBackground");
const startBackground = document.getElementById("startBackground");
const onVideo = document.getElementById("onVideo");

const statusText = document.getElementById("status");

const soundOn = document.getElementById("soundOn");
const soundOff = document.getElementById("soundOff");



let isOn = false;
let startTimer = null;


function showBackground(element) {

    offBackground.classList.remove("active");
    startBackground.classList.remove("active");
    onVideo.classList.remove("active");

    element.classList.add("active");
}



function turnOff(playSound = true) {

    if (!isOn) return;

    isOn = false;

    clearTimeout(startTimer);

    // STOP VIDEO

    onVideo.pause();
    onVideo.currentTime = 0;

    // STOP ON AUDIO

    soundOn.pause();
    soundOn.currentTime = 0;

    // PLAY OFF AUDIO

    soundOff.pause();
    soundOff.currentTime = 0;

    if (playSound) {

        soundOff.play().catch(error => {
            console.log("OFF sound unavailable:", error);
        });

    }

    // SHOW OFF IMAGE

    showBackground(offBackground);

    // RESET BUTTON

    powerButton.classList.remove("on");

    powerButton.setAttribute("aria-pressed", "false");
    powerButton.setAttribute("aria-label", "Turn on");

    statusText.textContent = "OFF";
}

// POWER BUTTON CLICK

powerButton.addEventListener("click", async function() {

    // =========================
    // TURN OFF
    // =========================

    if (isOn) {

        turnOff(true);

    }

    // =========================
    // TURN ON
    // =========================

    else {

        isOn = true;

        // SHOW START IMAGE

        showBackground(startBackground);

        // POWER BUTTON GLOW

        powerButton.classList.add("on");

        powerButton.setAttribute("aria-pressed", "true");
        powerButton.setAttribute("aria-label", "Turn off");

        statusText.textContent = "...";

        // PLAY ON MP3

        soundOn.pause();
        soundOn.currentTime = 0;

        soundOn.play().catch(error => {

            console.error("ON audio playback failed:", error);

        });

        // WAIT 1.2 SECONDS BEFORE VIDEO

        startTimer = setTimeout(async function() {

            if (!isOn) return;

            // SHOW VIDEO

            showBackground(onVideo);

            statusText.textContent = "ON";

            try {

                onVideo.currentTime = 0;

                await onVideo.play();

            } catch (error) {

                console.error("Video playback failed:", error);

                statusText.textContent = "VIDEO ERROR";

            }

        }, 1200);

    }

});

// AUTOMATICALLY TURN OFF WHEN MP3 ENDS

soundOn.addEventListener("ended", function() {

    if (isOn) {

        turnOff(true);

    }

});