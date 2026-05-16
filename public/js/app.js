const API_URL = '/api/tasks';
let tasks = [];
const notifiedTaskIds = new Set();

// Get Auth Token
function getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
        window.location.href = '/login.html';
        return {};
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };
}

// Fetch Tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
        updateAnalytics();
        checkDeadlines();
    } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to load tasks.', true);
    }
}

// Helper to calculate remaining time
function getRemainingTime(deadline) {
    const now = new Date();
    const diff = new Date(deadline) - now;
    
    if (diff <= 0) return '<span style="color: var(--error);">Overdue</span>';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}

// Render Tasks
function renderTasks() {
    const lists = {
        'Pending': document.getElementById('list-pending'),
        'In Progress': document.getElementById('list-inprogress'),
        'Completed': document.getElementById('list-completed')
    };
    Object.values(lists).forEach(list => list.innerHTML = '');
    
    tasks.forEach(task => {
        const status = task.status || 'Pending';
        const listContainer = lists[status];
        if (!listContainer) return;

        const deadlineDate = new Date(task.deadline);
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const year = deadlineDate.getFullYear();
        const hours = String(deadlineDate.getHours()).padStart(2, '0');
        const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${day}/${month}/${year} • ${hours}:${minutes}`;
        const timeRemaining = getRemainingTime(task.deadline);

        // Urgency Check
        const now = new Date();
        const diffMs = deadlineDate - now;
        const isUrgent = diffMs > 0 && diffMs < (24 * 60 * 60 * 1000) && task.status !== 'Completed';
        const isOverdue = diffMs < 0 && task.status !== 'Completed';

        const card = document.createElement('div');
        card.className = `task-card ${isUrgent || isOverdue ? 'urgent' : ''}`;
        card.innerHTML = `
            <div class="task-card-title">${escapeHTML(task.title)}</div>
            <div class="task-card-meta">
                <div class="deadline-tag ${isUrgent || isOverdue ? 'urgent' : ''}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${isOverdue ? 'OVERDUE' : formattedDate}
                </div>
            </div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${task.status === 'Completed' ? '<span style="color: var(--success);">Completed</span>' : timeRemaining}
            </div>
            <div class="task-card-meta" style="margin-top: 1rem; justify-content: flex-end;">
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-icon" onclick="editTask('${task._id}')" style="padding: 0.35rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon" onclick="deleteTask('${task._id}')" style="padding: 0.35rem; color: var(--error);">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            </div>
            ${task.status !== 'Completed' ? `
                <div style="margin-top: 1rem;">
                    <button class="btn-primary" style="width: 100%; padding: 0.5rem; font-size: 0.75rem; background: var(--bg-card-hover);" onclick="updateTaskStatus('${task._id}', '${task.status === 'Pending' ? 'In Progress' : 'Completed'}')">
                        Move to ${task.status === 'Pending' ? 'In Progress' : 'Completed'}
                    </button>
                </div>
            ` : ''}
        `;
        listContainer.appendChild(card);
    });
}

// Update Analytics
function updateAnalytics() {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-inprogress').innerText = inProgress;
    document.getElementById('stat-rate').innerText = `${rate}%`;
}

// Form Logic
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const deadline = document.getElementById('deadline').value;
    const status = document.getElementById('status').value;
    const editId = taskForm.dataset.editId;

    try {
        let response;
        const url = editId ? `${API_URL}/${editId}` : `${API_URL}/create`;
        const method = editId ? 'PUT' : 'POST';

        response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, deadline, status })
        });

        if (!response.ok) throw new Error('Failed to save');
        closeModal();
        await fetchTasks();
        showToast('Success', editId ? 'Task updated.' : 'Task created.');
    } catch (error) {
        showToast('Error', 'Failed to save task.', true);
    }
});

window.resetForm = function() {
    taskForm.reset();
    taskForm.dataset.editId = '';
    document.getElementById('form-title').innerText = 'Add New Task';
    document.getElementById('submit-btn-text').innerText = 'Add Task';
}

window.editTask = function(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    document.getElementById('title').value = task.title;
    const dt = new Date(task.deadline);
    const localDateTime = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    document.getElementById('deadline').value = localDateTime;
    document.getElementById('status').value = task.status || 'Pending';
    taskForm.dataset.editId = task._id;
    document.getElementById('form-title').innerText = 'Edit Task';
    document.getElementById('submit-btn-text').innerText = 'Save Changes';
    document.getElementById('task-modal').style.display = 'flex';
};

window.updateTaskStatus = async function(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error('Failed to update');
        await fetchTasks();
    } catch (error) {
        showToast('Error', 'Failed to update status.', true);
    }
}

window.deleteTask = async function(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete');
        await fetchTasks();
        showToast('Deleted', 'Task removed successfully.');
    } catch (error) {
        showToast('Error', 'Failed to delete task.', true);
    }
}

// Reminders
function checkDeadlines() {
    const now = new Date();
    tasks.forEach(task => {
        if (task.status === 'Completed') return;
        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate - now;
        if (timeDiff > 0 && timeDiff <= (24 * 60 * 60 * 1000)) {
            if (!notifiedTaskIds.has(task._id)) {
                const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
                showToast('Urgent Reminder', `Attention! "${task.title}" is due in ${hoursLeft}h. Please prioritize this task.`, true);
                notifiedTaskIds.add(task._id);
            }
        }
    });
}
setInterval(() => {
    checkDeadlines();
    renderTasks(); // Refresh remaining time display every minute
}, 60000);

// Toast System
function showToast(title, message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
        <div style="font-weight: 700; font-size: 0.9rem;">${title}</div>
        <div style="font-size: 0.8rem; opacity: 0.8;">${message}</div>
    `;
    const container = document.getElementById('toast-container');
    if (container) container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

fetchTasks();
