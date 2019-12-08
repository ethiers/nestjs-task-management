import {Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskRepository} from './task.repository';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {TaskStatus} from './task-status.enum';
import {TaskStatusValidationPipe} from './task-status-validation.pipe';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../auth/get-user.decorator';
import {User} from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController');

    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.taskService.getTasks(filterDto, user);

        // Good for in-memory storage
        // if (Object.keys(filterDto).length) {
        //     return this.taskService.getTaskWithFilters(filterDto);
        // } else {
        //     return this.taskService.getAllTasks();
        // }
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(createTaskDto)}`);
        return this.taskService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number,
                   @GetUser() user: User) {
        return this.taskService.deleteTaskById(id, user);
    }
}
