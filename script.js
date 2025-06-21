// Employee Manager
class BreakTracker {
    constructor() {
        this.employees = [];
        this.breakQueue = [];
        this.activeBreaks = [];
        this.loadEmployees();
        this.initEventListeners();
        this.renderAll();
    }

    // CRUD Operations
    addEmployee(name, position, breakDuration) {
        const employee = {
            id: Date.now().toString(),
            name,
            position,
            breakDuration,
            lastBreak: null
        };
        this.employees.push(employee);
        this.saveEmployees();
        this.renderEmployees();
    }

    // Break Management
    startBreak(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (employee) {
            const breakEnd = new Date();
            breakEnd.setMinutes(breakEnd.getMinutes() + employee.breakDuration);
            
            const breakSession = {
                employeeId,
                endTime: breakEnd,
                timer: null
            };
            
            this.activeBreaks.push(breakSession);
            this.updateBreakTimer(breakSession);
            this.renderActiveBreaks();
            this.renderEmployees();
        }
    }

    // UI Rendering
    renderEmployees() {
        const list = document.getElementById('employeeList');
        list.innerHTML = this.employees.map(emp => `
            <li class="employee-item" data-id="${emp.id}">
                <div>
                    <strong>${emp.name}</strong>
                    <small>${emp.position}</small>
                </div>
                <button class="break-btn" data-id="${emp.id}">
                    ${this.isOnBreak(emp.id) ? 'On Break' : 'Start Break'}
                </button>
            </li>
        `).join('');
    }

    // Data Persistence
    saveEmployees() {
        localStorage.setItem('breakTrackerEmployees', JSON.stringify(this.employees));
    }

    loadEmployees() {
        const saved = localStorage.getItem('breakTrackerEmployees');
        if (saved) this.employees = JSON.parse(saved);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const app = new BreakTracker();
    
    // Modal controls
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        document.getElementById('employeeModal').style.display = 'block';
    });
    
    // Form submission
    document.getElementById('employeeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('empName').value;
        const position = document.getElementById('empPosition').value;
        const duration = parseInt(document.getElementById('breakDuration').value);
        app.addEmployee(name, position, duration);
        e.target.reset();
        document.getElementById('employeeModal').style.display = 'none';
    });
});
