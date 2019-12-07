import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {TaskRepository} from './task.repository';
import {Task} from './task.entity';
import {TaskStatus} from './task-status.enum';
import {DeleteResult} from 'typeorm';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {

    }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        //
        return this.taskRepository.getTasks(filterDto);
    }

    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    //
    // getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const {status, search} = filterDto;
    //
    //     let tasks = this.getAllTasks();
    //
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //
    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //     }
    //
    //     return tasks;
    // }
    //

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.getTaskById(id);

        if (!found) {
            //
            throw new NotFoundException(`Task with ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }

    //
    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
    //
    // // updateTask(id: string, updateTaskDto: CreateTaskDto): Task {
    // //     const data = this.tasks.find(task => task.id === id);
    // //     data.title = updateTaskDto.title ? updateTaskDto.title : data.title;
    // //     data.description = updateTaskDto.description ? updateTaskDto.description : data.description;
    // //     // data.status = updateTaskDto.status ? updateTaskDto.status : data.status;
    // //     return data;
    // // }
    //
    async deleteTaskById(id: number): Promise<void> {
        console.log('Delete', id);

        // const found = this.getTaskById(id);
        //
        // if (!found) {
        //     //
        //     throw new NotFoundException(`Task with ${id} not found`);
        // }

        const result = await this.taskRepository.deleteTask(id);

        if (result.affected) {
            throw new NotFoundException(`Task with ID "${id} not found"`);
        }

        // this.tasks.splice(this.tasks.findIndex((i) => i.id === id), 1);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
