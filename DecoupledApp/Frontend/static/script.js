const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchGrades() {
    const input = document.getElementById("student_id");
    const resultDiv = document.getElementById("result");
    const student_id = input.value.trim();

    // Input validation
    if (!student_id || isNaN(student_id)) {
        alert("Please enter a valid numeric Student ID.");
        input.focus();
        return;
    }

    // Loading indicator
    resultDiv.innerHTML = `<p style="color: #666; text-align: center;">Loading grades...</p>`;

    try {
        const response = await fetch(`${API_BASE_URL}/get_grades?student_id=${encodeURIComponent(student_id)}`);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Server error (${response.status})`);
        }

        const grades = await response.json();
        displayGrades(grades);
    } catch (error) {
        console.error("Fetch error:", error);
        resultDiv.innerHTML = `<p style="color: #d9534f; text-align: center;">${error.message || "Failed to connect to the server."}</p>`;
    }
}

function displayGrades(grades) {
    const resultDiv = document.getElementById("result");

    if (!grades.length) {
        resultDiv.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">No grades found for this Student ID.</p>`;
        return;
    }

    const headers = Object.keys(grades[0]);

    resultDiv.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    ${headers.map(h => `<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${grades.map(row => `
                    <tr style="border: 1px solid #ddd;">
                        ${headers.map(h => `<td style="padding: 8px; border: 1px solid #ddd;">${row[h]}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Ensure the listener attaches after DOM nodes are available
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("student_id");
    if (input) {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                fetchGrades();
            }
        });
    }
});