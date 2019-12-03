import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {Task, TaskStatus} from './tasks.model';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {

    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        console.log(filterDto);

        if (Object.keys(filterDto).length) {
            return this.taskService.getTaskWithFilters(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string) {
        return this.taskService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch('/:id')
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
        return this.taskService.updateTaskStatus(id, status);
    }

    // @Patch('/:id')
    // updateTaskById(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
    //     return this.taskService.updateTask(id, updateTaskDto);
    // }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) {
        return this.taskService.deleteTaskById(id);
    }

}
