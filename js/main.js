import {Task} from '../classes/Task.js';

class App {
  tasks = [
    { id: 762, task: "Estudiar JavaScript", priority: "urgente" },
    { id: 568, task: "Ir al supermercado", priority: "normal" },
    { id: 125, task: "Poner una lavadora", priority: "intermedia" }
  ];
  form1 = document.querySelector('#form1');
  button = document.querySelector('#btn');
  output = document.querySelector('#output');
  form2 = document.querySelector('#form2');
  form3 = document.querySelector('#form3');

  constructor() {
    this.form1.addEventListener('submit', (e) => this.handleSubmit(e));
    this.recoverTasks();
    this.form2.inputSearchPriority.addEventListener('change', (e) => this.searchPriority(e));
    this.form3.inputSearch.addEventListener('keyup', () => this.searchTask());
  }

  handleSubmit(e){
    e.preventDefault();
    const {taskName, priority} = this.getFormData();
    if(!taskName || !priority){
      alert('No has introducido ninguna tarea y/o seleccionado ninguna prioridad.');
      return;
    }
    this.addTask(taskName, priority);
    this.form1.reset();
    this.form2.reset();
    this.form3.reset();
  }

  getFormData(){
    const taskName = this.form1.inputTask.value.trim();
    const priority = this.form1.inputPriority.value;

    return {taskName, priority};
  }

  updateLocalStorage(){
    const taskString = JSON.stringify(this.tasks);
    localStorage.setItem('Tasks', taskString);
  }

  addTask(taskName, priority){
    const newTask = new Task(taskName, priority);
    this.tasks.push(newTask);
    this.updateLocalStorage();
    this.output.innerHTML = '';
    this.printAllTasks();
  }

  createLi(taskName, priority, id){
    const li = document.createElement('li');
    li.dataset.id = id;
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-light btn-outline-secondary ms-auto';
    deleteButton.append('🗑');
    deleteButton.addEventListener('click', (e) => this.deleteTask(e))
    if(priority === 'normal'){
      li.className = 'bg-success'
    }
    if(priority === 'intermedia'){
      li.className = 'bg-warning text-dark'
    }
    if(priority === 'urgente'){
      li.className = 'bg-danger'
    }
    li.append(taskName, deleteButton);
    return li;
  }

  deleteTask(e){
    const id = Number(e.target.parentElement.dataset.id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.updateLocalStorage();
    this.output.innerHTML = '';
    this.printAllTasks();
  }

  printAllTasks(){
    this.tasks.forEach(({task, priority, id}) => {
      const li = this.createLi(task, priority, id);
      this.output.append(li);
    });
    this.updateLocalStorage();
  }

  recoverTasks(){
    const jsonTasks = localStorage.getItem('Tasks');
    if(jsonTasks){
      const parsedTasks = JSON.parse(jsonTasks);
      this.tasks = parsedTasks;
    }
    this.printAllTasks();
  }

  searchPriority(){
    const selectPriority = this.form2.inputSearchPriority.value;
    if(selectPriority !== 'todas'){
      const priorityResult = this.tasks.filter((tasks) => {
        return tasks.priority === selectPriority;
      });
      this.output.innerHTML = '';
      priorityResult.forEach( ({task, priority, id}) => {
        const li = this.createLi(task, priority, id);
        this.output.append(li);
      } );
    }else{
      this.output.innerHTML = '';
      this.printAllTasks();
    }
    this.form3.reset();
  }

  searchTask(){
    const stringSearch = this.form3.inputSearch.value.toLowerCase();
    const searchResult = this.tasks.filter((tasks) => {
        return tasks.task.toLowerCase().includes(stringSearch);
    });
    this.output.innerHTML = '';
    if(searchResult.length === 0){
      const li = document.createElement('li');
      li.className = 'fw-bold fs-2';
      li.append('No se encuentran resultados.');
      this.output.append(li);
    }else{
      searchResult.forEach( ({task, priority, id}) => {
        const li = this.createLi(task, priority, id);
        this.output.append(li);
      } );
    }
    this.form2.reset();
  }
}

const app = new App();
