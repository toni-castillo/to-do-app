export class Task {
  id = Math.ceil(Math.random()*1000);

  constructor(task, priority) {
    this.task = task;
    this.priority = priority;
  }
}