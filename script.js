    const taskForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('taskInput');
    const reminderInput = document.getElementById('reminderInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const details = document.createElement('div');
        details.className = 'task-details';
        details.innerHTML = `
          <strong class="${task.completed ? 'completed' : ''}">${task.text}</strong><br />
          <small class="timestamp">⏰ ${task.date ? new Date(task.date).toLocaleString('en-GB') : 'No Reminder'} | 🔥 Priority: ${task.priority}</small>
        `;

        const actions = document.createElement('div');
        actions.className = 'actions';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.onclick = () => {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🚮';
        deleteBtn.onclick = () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        };

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(details);
        li.appendChild(actions);
        taskList.appendChild(li);
      });
    }

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskText = taskInput.value.trim();
      const taskReminder = reminderInput.value;
      const taskPriority = priorityInput.value;
      if (taskText) {
        tasks.push({ text: taskText, date: taskReminder, priority: taskPriority, completed: false });
        saveTasks();
        renderTasks();
        taskForm.reset();
      }
    });

    function checkReminders() {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.date && !task.alerted) {
          const reminderTime = new Date(task.date);
          if (now >= reminderTime) {
            alert(`⏰ Reminder: ${task.text}`);
            task.alerted = true;
            saveTasks();
          }
        }
      });
    }

    renderTasks();
    setInterval(checkReminders, 10000);
