const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const display = document.getElementById("alerts-display");
const errorBox = document.getElementById("error-message");

//Event listener
button.addEventListener("click", () => {
    const state = input.value.trim().toLocaleUpperCase();

    //validate input
    if (!/^[A-Z]{2}$/.test(state)) {
        showError("Please enter a valid 2-letter state code");
        return;
    }

    fetchAlerts(state);
});

//fetch function
async function fetchAlerts(state) {
    try {
        clearUI();
        hideError();

        const response = await fetch(
            `https://api.weather.gov/alerts/active?area=${state}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather alerts. Please try again.");
        }

        const data = await response.json();

        const alerts = data.features;

        //handle no alerts case
        if (alerts.length === 0) {
            display.innerHTML = `<p>No active alerts for ${state}.</p>`;
            input.value = "";
            return;
        }

        //summary message
        const summary = document.createElement("h3");
        summary.textContent =
        `Current watches, warnings, and advisories for ${state}: ${alerts.length}`;

        display.appendChild(summary);

        const list = document.createElement("ul");

        alerts.forEach(alert => {
            const li = document.createElement("li");
            li.textContent = alert.properties.headline;
            list.appendChild(li);
        });

        display.appendChild(list);

        //clear input after sucess
        input.value = "";

    } catch (error) {
        showError(error.message);
    }finally {
        //hide spinner
    }
}

//clear UI function
function clearUI() {
    display.innerHTML = "";
}

//Error handling
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function hideError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}