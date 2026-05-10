const API_URL = '/api/tasks';
let tasks = [];
let currentFilter = 'all';
const notifiedTaskIds = new Set();

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toast-container');
const formTitle = document.getElementById('form-title');
const submitBtnText = document.getElementById('submit-btn-text');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

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
        const day = deadlineDate.getDate();
        const month = deadlineDate.getMonth() + 1;
        const year = deadlineDate.getFullYear();
        const time = deadlineDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const formattedDate = `${day}/${month}/${year} ${time}`;

        // Determine status class
        let statusClass = 'pending';
        let statusText = '<span class="big-smiley">😐</span> Pending';
        if (task.status === 'In Progress') {
            statusClass = 'inprogress';
            statusText = '<span class="big-smiley">😃</span> In Progress';
        }
        if (task.status === 'Completed') {
            statusClass = 'completed';
            statusText = '<span class="big-smiley">🤩</span> Completed';
        }

        // Calculate Countdown
        const now = new Date();
        const diffMs = deadlineDate - now;
        let countdownText = '';
        if (task.status !== 'Completed') {
            if (diffMs < 0) {
                const overdueHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
                countdownText = `<span class="countdown" style="color: var(--danger-text)">🚨 Overdue by ${overdueHours}h</span>`;
            } else {
                const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                let timeStr = [];
                if(days > 0) timeStr.push(`${days}d`);
                if(hours > 0) timeStr.push(`${hours}h`);
                timeStr.push(`${mins}m`);
                countdownText = `<span class="countdown">⏳ ${timeStr.join(' ')} remaining</span>`;
            }
        }

        const card = document.createElement('div');
        card.className = `task-row ${task.status === 'Completed' ? 'completed-task' : ''}`;
        
        card.innerHTML = `
            <div class="task-info">
                <div class="task-title">${escapeHTML(task.title)}</div>
                <div class="task-meta">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <span class="meta-item">
                        <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        ${formattedDate}
                    </span>
                    ${countdownText}
                </div>
            </div>
            <div class="task-actions">
                ${task.status !== 'Completed' ? `
                    <button class="icon-btn complete" onclick="updateTaskStatus('${task._id}', 'Completed')" title="Mark as Completed">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                ` : ''}
                <button class="icon-btn edit" onclick="editTask('${task._id}')" title="Edit Task">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button class="icon-btn delete" onclick="deleteTask('${task._id}')" title="Delete Task">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
        taskContainer.appendChild(card);
    });
}

// Create or Edit Task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const deadline = document.getElementById('deadline').value;
    const status = document.getElementById('status').value;
    const editId = taskForm.dataset.editId;

    try {
        let response;
        if (editId) {
            response = await fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, deadline, status })
            });
        } else {
            response = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, deadline, status })
            });
        }

        if (!response.ok) throw new Error('Failed to save task');
        
        resetForm();
        await fetchTasks();
        showToast('Success', editId ? 'Task updated successfully!' : 'Task created successfully!');
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to save task.', true);
    }
});

// Edit & Reset Logic
cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
    taskForm.reset();
    taskForm.dataset.editId = '';
    formTitle.innerText = 'Create New Task';
    submitBtnText.innerText = 'Add Task';
    cancelEditBtn.style.display = 'none';
}

window.editTask = function(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    
    document.getElementById('title').value = task.title;
    
    // Format deadline for datetime-local input (YYYY-MM-DDTHH:mm)
    const dt = new Date(task.deadline);
    const localDateTime = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    document.getElementById('deadline').value = localDateTime;
    
    document.getElementById('status').value = task.status;
    
    taskForm.dataset.editId = task._id;
    formTitle.innerText = 'Edit Task';
    submitBtnText.innerText = 'Save Changes';
    cancelEditBtn.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
    
    let toastTypeClass = 'toast-success';
    let iconSvg = '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    
    if (isError) {
        toastTypeClass = 'toast-error';
        iconSvg = '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    } else if (isWarning) {
        toastTypeClass = 'toast-warning';
        iconSvg = '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
    }
    
    toast.className = `toast ${toastTypeClass}`;

    toast.innerHTML = `
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="toast-header">
            ${iconSvg}
            ${title}
        </div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);

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

// Update countdown UI every minute
setInterval(renderTasks, 60000);
