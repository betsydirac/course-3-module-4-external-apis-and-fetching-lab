// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.querySelector('#state-input');
const fetchButton = document.querySelector('#fetch-alerts');
const alertsDisplay = document.querySelector('#alerts-display');
const errorMessageDiv = document.querySelector('#error-message');

// 1. Fetch Alerts for a Given State
function fetchWeatherAlerts(state) {
    return fetch(weatherApi + state)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed (status ${response.status}).`);
            }
            return response.json();
        })
        .then(data => {
            // 4. Error Handling: hide and clear error on successful request
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
            errorMessageDiv.classList.add('hidden');
            displayAlerts(data);
        })
        .catch(errorObject => {
            // 4. Error Handling: show message in #error-message
            showError(errorObject.message);
        });
}

// 2. Display the Alerts
function displayAlerts(data) {
    // 3. Clear and Reset the UI: remove previous data
    alertsDisplay.innerHTML = '';

    // Summary message using title and number of alerts
    const summary = document.createElement('p');
    summary.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(summary);

    // List of alert headlines
    const ul = document.createElement('ul');
    data.features.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert.properties.headline;
        ul.appendChild(li);
    });
    alertsDisplay.appendChild(ul);
}

// 4. Error Handling
function showError(message) {
    alertsDisplay.innerHTML = '';
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    errorMessageDiv.classList.remove('hidden');
}

fetchButton.addEventListener('click', () => {
    const state = stateInput.value.trim().toUpperCase();

    // 3. Clear and Reset the UI: clear the input field
    stateInput.value = '';

    // 4. Error Handling: empty input
    if (!state) {
        showError('Please enter a state abbreviation.');
        return;
    }

    fetchWeatherAlerts(state);
});