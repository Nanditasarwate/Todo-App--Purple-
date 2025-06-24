// 1. Define confetti launcher first
const launchConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["heart"],
    colors: ["#FFC0CB", "#FF69B4", "#FF1493", "#C71585"]
  };

  confetti({ ...defaults, particleCount: 50, scalar: 2 });
  confetti({ ...defaults, particleCount: 25, scalar: 3 });
  confetti({ ...defaults, particleCount: 10, scalar: 4 });
};

// 2. DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const emptyImage = document.querySelector('.empty-image');
  const todosContainer = document.querySelector('.todos-container');
  const progressBar = document.getElementById('progress');
  const progressNumbers = document.getElementById('numbers');

  // Toggle empty state image
  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
  };

  // Update progress bar and number
  const updateProgress = (checkCompletion = true) => {
    const totalTask = taskList.children.length;
    const completedTask = taskList.querySelectorAll('.checkbox:checked').length;
    progressBar.style.width = totalTask ? `${(completedTask / totalTask) * 100}%` : '0%';
    progressNumbers.textContent = `${completedTask} / ${totalTask}`;

    if (checkCompletion && totalTask > 0 && completedTask === totalTask) {
      launchConfetti();
    }
  };

  // Save tasks to localStorage
  const saveTasksToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Load tasks from localStorage
  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(({ text, completed }) => addTask(text, completed));
    toggleEmptyState();
    updateProgress();
  };

  // Add a task
  const addTask = (text = '', completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
      <span>${taskText}</span> 
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button> 
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editbtn = li.querySelector('.edit-btn');

    if (completed) {
      li.classList.add('completed');
      editbtn.disabled = true;
      editbtn.style.opacity = '0.5';
      editbtn.style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;
      li.classList.toggle('completed', isChecked);
      editbtn.disabled = isChecked;
      editbtn.style.opacity = isChecked ? '0.5' : '1';
      editbtn.style.pointerEvents = isChecked ? 'none' : 'auto';
      updateProgress();
      saveTasksToLocalStorage();
    });

    editbtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTasksToLocalStorage();
      }
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasksToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    updateProgress();
    saveTasksToLocalStorage();
  };

  // Event Listeners
  addTaskBtn.addEventListener('click', () => addTask());

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  // Load tasks AFTER setup
  loadTasksFromLocalStorage();
});
