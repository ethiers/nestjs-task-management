import {DeleteResult, EntityRepository, Repository} from 'typeorm';
import {Task} from './task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task | undefined> {

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)', { search: `%${search.toLowerCase()}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: number) {
        return this.findOne(id);
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {

        const {
            title,
            description,
        } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }

    async deleteTask(id: number): Promise<DeleteResult> {
        return await this.delete(id);
    }

}