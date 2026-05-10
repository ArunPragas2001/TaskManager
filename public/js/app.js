const API_URL = '/api/tasks';
let tasks = [];
let currentFilter = 'all';
const notifiedTaskIds = new Set();

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toast-container');

// Fetch Tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
        checkDeadlines(); // Check immediately on load
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to load tasks. Please try again.', true);
    }
}

// Render Tasks
function renderTasks() {
    taskContainer.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        taskContainer.innerHTML = `
            <div class="empty-state">
                <p>No tasks found. Create one above!</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const formattedDate = deadlineDate.toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Determine status class
        let statusClass = 'pending';
        if (task.status === 'In Progress') statusClass = 'inprogress';
        if (task.status === 'Completed') statusClass = 'completed';

        const card = document.createElement('div');
        card.className = `task-card ${task.status === 'Completed' ? 'completed-task' : ''}`;
        
        card.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${escapeHTML(task.title)}</h3>
                <div class="task-meta">
                    <span class="status-badge ${statusClass}">${task.status}</span>
                    <span class="deadline">📅 ${formattedDate}</span>
                </div>
            </div>
            <div class="task-actions">
                ${task.status !== 'Completed' ? `
                    <button class="action-btn complete" onclick="updateTaskStatus('${task._id}', 'Completed')" title="Mark as Completed">
                        ✓
                    </button>
                ` : ''}
                <button class="action-btn delete" onclick="deleteTask('${task._id}')" title="Delete Task">
                    ✕
                </button>
            </div>
        `;
        taskContainer.appendChild(card);
    });
}

// Create Task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const deadline = document.getElementById('deadline').value;
    const status = document.getElementById('status').value;

    try {
        const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, deadline, status })
        });

        if (!response.ok) throw new Error('Failed to create task');
        
        taskForm.reset();
        await fetchTasks();
        showToast('Success', 'Task created successfully!');
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to create task.', true);
    }
});

// Update Task Status
async function updateTaskStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update task');
        await fetchTasks();
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to update task.', true);
    }
}

// Delete Task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');
        await fetchTasks();
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to delete task.', true);
    }
}

// Filter Tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Reminder System (Check Deadlines)
function checkDeadlines() {
    const now = new Date();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    tasks.forEach(task => {
        // Only remind for tasks that are not completed
        if (task.status === 'Completed') return;

        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate - now;

        // If deadline is in the future but less than 24 hours away
        if (timeDiff > 0 && timeDiff <= TWENTY_FOUR_HOURS) {
            if (!notifiedTaskIds.has(task._id)) {
                // Determine hours left for the message
                const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
                showToast('Deadline Approaching', `"${task.title}" is due in ${hoursLeft} hours!`, false, true);
                notifiedTaskIds.add(task._id);
            }
        }
    });
}

// Check deadlines every minute
setInterval(checkDeadlines, 60000);

// Toast Notification System
function showToast(title, message, isError = false, isWarning = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.style.borderLeftColor = 'var(--danger)';
    else if (!isWarning) toast.style.borderLeftColor = 'var(--success)';

    toast.innerHTML = `
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        <div class="toast-title">
            ${isError ? '❌' : isWarning ? '⚠️' : '✅'} ${title}
        </div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress" style="background: ${isError ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)'}"></div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Utility
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Initial Load
fetchTasks();
