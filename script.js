// DOM Elements
const fullNameInput = document.getElementById('fullName');
const departmentInput = document.getElementById('department');
const baseSalaryInput = document.getElementById('baseSalary');
const bonusInput = document.getElementById('bonus');
const allowancesInput = document.getElementById('allowances');
const deductionsInput = document.getElementById('deductions');
const searchInput = document.getElementById('searchInput');

const netSalaryDisplay = document.getElementById('netSalaryDisplay');
const emptyStateText = document.getElementById('emptyStateText');
const employeeList = document.getElementById('employeeList');
const employeeListContainer = document.getElementById('employeeListContainer');

const calculateBtn = document.getElementById('calculateBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const searchNameBtn = document.getElementById('searchNameBtn');
const searchDeptBtn = document.getElementById('searchDeptBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// State
let employees = [];
let currentNetSalary = 0;

// Helper to get number from input
const getNum = (input) => {
  const val = parseFloat(input.value);
  return isNaN(val) ? 0 : val;
};

// Calculate Net Salary
const calculateNetSalary = () => {
  const base = getNum(baseSalaryInput);
  const bonus = getNum(bonusInput);
  const allow = getNum(allowancesInput);
  const deduct = getNum(deductionsInput);
  
  currentNetSalary = base + bonus + allow - deduct;
  
  netSalaryDisplay.textContent = `$${currentNetSalary.toLocaleString()}`;
  return currentNetSalary;
};

// Render Employees
const renderEmployees = (listToRender = employees) => {
  if (listToRender.length === 0) {
    employeeList.classList.add('hidden');
    employeeList.classList.remove('flex');
    emptyStateText.classList.remove('hidden');
    employeeListContainer.classList.add('justify-center', 'items-center', 'min-h-[200px]');
  } else {
    employeeList.classList.remove('hidden');
    employeeList.classList.add('flex');
    emptyStateText.classList.add('hidden');
    employeeListContainer.classList.remove('justify-center', 'items-center', 'min-h-[200px]');
    
    employeeList.innerHTML = '';
    
    listToRender.forEach((emp, index) => {
      const card = document.createElement('div');
      card.className = 'bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-slate-700/80';
      
      card.innerHTML = `
        <div class="flex-1 flex gap-4 items-center">
          <div class="bg-indigo-900/50 text-indigo-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0 border border-indigo-500/30">
            ${emp.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 class="font-bold text-slate-100">${emp.fullName}</h3>
            <span class="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full mt-1 border border-slate-700 inline-block">${emp.department}</span>
          </div>
        </div>
        <div class="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700">
          <div class="flex flex-col md:text-right flex-1 md:flex-none">
            <span class="text-xs text-slate-500 font-medium">Net Salary</span>
            <span class="font-bold text-emerald-400 text-lg">$${emp.netSalary.toLocaleString()}</span>
          </div>
          <button onclick="deleteEmployee(${emp.id})" class="text-slate-500 hover:text-red-400 transition-colors p-2 md:p-0">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      employeeList.appendChild(card);
    });
  }
};

// Add Employee
const addEmployee = () => {
  const name = fullNameInput.value.trim();
  const dept = departmentInput.value.trim();
  
  if (!name || !dept || getNum(baseSalaryInput) <= 0) {
    alert('Please fill in Name, Department, and a valid Base Salary.');
    return;
  }
  
  calculateNetSalary();
  
  const newEmp = {
    id: Date.now(),
    fullName: name,
    department: dept,
    baseSalary: getNum(baseSalaryInput),
    bonus: getNum(bonusInput),
    allowances: getNum(allowancesInput),
    deductions: getNum(deductionsInput),
    netSalary: currentNetSalary
  };
  
  employees.push(newEmp);
  
  // Reset Form
  fullNameInput.value = '';
  departmentInput.value = '';
  baseSalaryInput.value = '';
  bonusInput.value = '0';
  allowancesInput.value = '0';
  deductionsInput.value = '0';
  
  currentNetSalary = 0;
  netSalaryDisplay.textContent = '$0';
  
  renderEmployees();
};

// Delete Single Employee
window.deleteEmployee = (id) => {
  employees = employees.filter(emp => emp.id !== id);
  renderEmployees();
};

// Event Listeners
calculateBtn.addEventListener('click', calculateNetSalary);

addEmployeeBtn.addEventListener('click', addEmployee);

searchNameBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = employees.filter(emp => emp.fullName.toLowerCase().includes(query));
  renderEmployees(filtered);
});

searchDeptBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = employees.filter(emp => emp.department.toLowerCase().includes(query));
  renderEmployees(filtered);
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  renderEmployees();
});

deleteAllBtn.addEventListener('click', () => {
  if (employees.length === 0) return;
  if (confirm('Are you sure you want to delete all employees?')) {
    employees = [];
    renderEmployees();
  }
});

// Initial Render
renderEmployees();
