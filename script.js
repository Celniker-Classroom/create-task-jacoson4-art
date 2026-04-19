document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('grade-form');
    const gradesBody = document.getElementById('grades-body');
    const totalAssignments = document.getElementById('total-assignments');
    const averagePercent = document.getElementById('average-percent');
    const weightedAverage = document.getElementById('weighted-average');
    const formFeedback = document.getElementById('form-feedback');
    const updatesList = document.getElementById('updates-list');

    function formatPercent(value) {
        return `${value.toFixed(1)}%`;
    }

    function updateSummary() {
        const rows = Array.from(gradesBody.querySelectorAll('tr'));

        if (rows.length === 0) {
            totalAssignments.textContent = '0';
            averagePercent.textContent = '—';
            weightedAverage.textContent = '—';
            return;
        }

        const entries = rows.map(row => ({
            percent: Number(row.dataset.percent),
            weight: Number(row.dataset.weight)
        }));

        const totalPercent = entries.reduce((sum, entry) => sum + entry.percent, 0);
        const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
        const weightedSum = entries.reduce((sum, entry) => sum + entry.percent * entry.weight, 0);

        totalAssignments.textContent = String(entries.length);
        averagePercent.textContent = formatPercent(totalPercent / entries.length);
        weightedAverage.textContent = totalWeight > 0 ? formatPercent(weightedSum / totalWeight) : '—';
    }

    function addUpdate(message) {
        const item = document.createElement('li');
        item.textContent = message;
        updatesList.prepend(item);
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        const studentName = form.studentName.value.trim();
        const assignmentName = form.assignmentName.value.trim();
        const category = form.category.value;
        const score = Number(form.score.value);
        const maxScore = Number(form.maxScore.value);
        const weight = Number(form.weight.value);

        if (!studentName || !assignmentName || score < 0 || maxScore <= 0 || weight <= 0) {
            formFeedback.textContent = 'Please complete all fields with valid values.';
            formFeedback.style.color = '#dc2626';
            return;
        }

        const percent = (score / maxScore) * 100;
        const weightedPercent = percent * weight;

        const row = document.createElement('tr');
        row.dataset.percent = String(percent);
        row.dataset.weight = String(weight);

        row.innerHTML = `
            <td>${assignmentName}</td>
            <td>${category}</td>
            <td>${score}</td>
            <td>${maxScore}</td>
            <td>${formatPercent(percent)}</td>
            <td>${weight.toFixed(1)}</td>
            <td>${formatPercent(weightedPercent / weight)}</td>
            <td><button type="button" class="remove-button">Remove</button></td>
        `;

        row.querySelector('.remove-button').addEventListener('click', () => {
            row.remove();
            updateSummary();
            addUpdate(`Removed assignment: ${assignmentName}`);
        });

        gradesBody.appendChild(row);
        updateSummary();
        formFeedback.textContent = `Added ${assignmentName} for ${studentName}.`;
        formFeedback.style.color = '#16a34a';
        addUpdate(`Added ${assignmentName} (${category}) with ${formatPercent(percent)}.`);
        form.reset();
        form.weight.value = '1';
    });
});

