import {DeleteResult, EntityRepository, Repository} from 'typeorm';
import {Task} from './task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';
import {InternalServerErrorException, Logger} from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task | undefined> {

    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id});

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)', {search: `%${search.toLowerCase()}%`});
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    // async getTaskById(id: number, user: User) {
    //     this.findOne(id);
    // }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

        const {
            title,
            description,
        } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to create a task for user "${user.username}" retrieving all tasks. Data: ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
        }

        delete task.user;

        return task;
    }

    // async deleteTask(id: number, user: User): Promise<DeleteResult> {
    //     return await this.delete(id);
    // }

}
