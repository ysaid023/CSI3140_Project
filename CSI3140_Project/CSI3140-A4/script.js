const patientForm = document.getElementById('patient-form');
const queueTableBody = document.getElementById('queue');

let patients = [];
const averageHandlingTime = 10; // average handling time per patient in minutes

patientForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const severity = parseInt(document.getElementById('severity').value);
    const timeAdded = new Date().getTime();

    const patient = {
        firstName,
        lastName,
        severity,
        timeAdded
    };

    // Send patient data to the server
    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            patients.push(patient);
            sortPatients();
            renderQueue();
        } else {
            alert('Failed to add patient');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    patientForm.reset();
});

function sortPatients() {
    patients.sort((a, b) => {
        if (a.severity === b.severity) {
            return a.timeAdded - b.timeAdded;
        }
        return b.severity - a.severity;
    });
}

function renderQueue() {
    queueTableBody.innerHTML = '';
    patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        const waitTime = calculateWaitTime(index);
        row.innerHTML = `
            <td>${patient.firstName}</td>
            <td>${patient.lastName}</td>
            <td>${patient.severity}</td>
            <td>${waitTime}</td>
        `;
        queueTableBody.appendChild(row);
    });
}

function calculateWaitTime(index) {
    return index * averageHandlingTime;
}

// Fetch existing patients from the server on load
fetch('server.php', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    patients = data;
    sortPatients();
    renderQueue();
})
.catch(error => {
    console.error('Error:', error);
});