const API_URL = '/api/tasks';
let tasks = [];
const notifiedTaskIds = new Set();

// DOM Elements
const taskForm = document.getElementById('task-form');
const colPending = document.getElementById('col-pending');
const colInProgress = document.getElementById('col-inprogress');
const colCompleted = document.getElementById('col-completed');

const countPending = document.getElementById('count-pending');
const countInProgress = document.getElementById('count-inprogress');
const countCompleted = document.getElementById('count-completed');
const aiActiveCount = document.getElementById('ai-active-count');

const submitBtnText = document.getElementById('submit-btn-text');

// Fetch Nodes
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
        updateStats();
        checkDeadlines();
    } catch (error) {
        console.error(error);
        showToast('Ecosystem Error', 'Failed to synchronize with task cloud.', true);
    }
}

// Update Spatial Stats
function updateStats() {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const processing = tasks.filter(t => t.status === 'In Progress').length;
    const synced = tasks.filter(t => t.status === 'Completed').length;

    countPending.textContent = pending;
    countInProgress.textContent = processing;
    countCompleted.textContent = synced;
    if (aiActiveCount) aiActiveCount.textContent = tasks.length;
}

// Render Kanban Nodes
function renderTasks() {
    colPending.innerHTML = '';
    colInProgress.innerHTML = '';
    colCompleted.innerHTML = '';

    tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const year = deadlineDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const isCompleted = task.status === 'Completed';

        const card = document.createElement('div');
        card.className = 'task-card';
        if (isCompleted) card.style.opacity = '0.5';

        card.innerHTML = `
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem; color: #fff;">${escapeHTML(task.title)}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <div style="font-size: 0.7rem; color: var(--text-dim);">DUE: ${formattedDate}</div>
                <div style="display: flex; gap: 0.5rem;">
                    ${!isCompleted ? `
                        <button onclick="completeTask('${task._id}')" style="background: rgba(75, 180, 222, 0.1); border: 1px solid var(--highlight); color: var(--highlight); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    ` : ''}
                    <button onclick="editTask('${task._id}')" style="background: none; border: none; color: var(--text-dim); cursor: pointer;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onclick="deleteTask('${task._id}')" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `;

        if (task.status === 'Pending') colPending.appendChild(card);
        else if (task.status === 'In Progress') colInProgress.appendChild(card);
        else if (task.status === 'Completed') colCompleted.appendChild(card);
    });
}

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

        if (!response.ok) throw new Error('Action failed');
        toggleTaskForm();
        resetForm();
        await fetchTasks();
        showToast('Node Updated', 'Neural ecosystem synchronized.');
    } catch (error) {
        showToast('System Error', 'Synchronization failed.', true);
    }
});

window.completeTask = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Completed' })
        });
        if (!response.ok) throw new Error('Action failed');
        await fetchTasks();
        showToast('Node Synced', 'Initialization verified.');
    } catch (error) {
        showToast('Sync Error', 'Action failed.', true);
    }
};

function resetForm() {
    taskForm.reset();
    taskForm.dataset.editId = '';
    submitBtnText.innerText = 'Generate';
}

window.editTask = function(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    document.getElementById('title').value = task.title;
    const dt = new Date(task.deadline);
    const localDateTime = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    document.getElementById('deadline').value = localDateTime;
    document.getElementById('status').value = task.status;
    taskForm.dataset.editId = task._id;
    submitBtnText.innerText = 'Verify Mod';
    toggleTaskForm();
};

async function deleteTask(id) {
    if (!confirm('Archive this node?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        await fetchTasks();
    } catch (error) {
        showToast('Archive Error', 'Action failed.', true);
    }
}

function showToast(title, message, isError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 6rem; left: 50%; transform: translateX(-50%); 
        background: var(--bg-surface); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); 
        padding: 1rem 2rem; border-radius: 20px; z-index: 2000; box-shadow: var(--shadow-z3);
        border-top: 3px solid ${isError ? '#ef4444' : 'var(--highlight)'}; text-align: center;
    `;
    toast.innerHTML = `<strong style="font-size: 0.9rem;">${title}</strong><p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">${message}</p>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

function checkDeadlines() {
    const now = new Date();
    tasks.forEach(task => {
        if (task.status === 'Completed') return;
        const diff = new Date(task.deadline) - now;
        if (diff > 0 && diff <= 24 * 60 * 60 * 1000 && !notifiedTaskIds.has(task._id)) {
            showToast('Priority Warning', `${task.title} threshold approaching.`, false);
            notifiedTaskIds.add(task._id);
        }
    });
}

fetchTasks();
setInterval(fetchTasks, 60000);
