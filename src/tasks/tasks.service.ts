import {Injectable} from '@nestjs/common';
import {Task, TaskStatus} from './tasks.model';
import * as uuid from 'uuid/v1';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const {status, search} = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search),
            );
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const {title, description} = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        console.log(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    // updateTask(id: string, updateTaskDto: CreateTaskDto): Task {
    //     const data = this.tasks.find(task => task.id === id);
    //     data.title = updateTaskDto.title ? updateTaskDto.title : data.title;
    //     data.description = updateTaskDto.description ? updateTaskDto.description : data.description;
    //     // data.status = updateTaskDto.status ? updateTaskDto.status : data.status;
    //     return data;
    // }

    deleteTaskById(id: string): void {
        console.log('Delete', id);
        this.tasks.filter(task => task.id !== id);
        // this.tasks.splice(this.tasks.findIndex((i) => i.id === id), 1);
    }
}
