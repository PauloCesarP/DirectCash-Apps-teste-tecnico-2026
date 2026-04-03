import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { SubtasksService } from './subtasks.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(
    private tasksService: TasksService,
    private subtasksService: SubtasksService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    this.logger.debug(`Create task request:`, {
      userId: req.user?.userId,
      user: req.user,
      dto: createTaskDto,
    });
    return this.tasksService.createTask(req.user.userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  getTasks(@Request() req, @Query() filters: Record<string, unknown>) {
    return this.tasksService.getTasks(req.user.userId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  getTaskById(@Param('id') id: string, @Request() req) {
    return this.tasksService.getTaskById(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  updateTask(
    @Param('id') id: string,
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, req.user.userId, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.deleteTask(id, req.user.userId);
  }

  // ========== SUBTASKS ROUTES ==========

  @Post(':taskId/subtasks')
  @ApiOperation({ summary: 'Create a new subtask' })
  @ApiResponse({ status: 201, description: 'Subtask created successfully' })
  async createSubtask(
    @Param('taskId') taskId: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(taskId, createSubtaskDto);
  }

  @Get(':taskId/subtasks')
  @ApiOperation({ summary: 'Get all subtasks for a task' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved successfully' })
  async findAllSubtasks(@Param('taskId') taskId: string) {
    return this.subtasksService.findAll(taskId);
  }

  @Get(':taskId/subtasks/:subtaskId')
  @ApiOperation({ summary: 'Get a specific subtask' })
  @ApiResponse({ status: 200, description: 'Subtask retrieved successfully' })
  async findOneSubtask(
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.subtasksService.findOne(taskId, subtaskId);
  }

  @Patch(':taskId/subtasks/:subtaskId')
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask updated successfully' })
  async updateSubtask(
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(taskId, subtaskId, updateSubtaskDto);
  }

  @Delete(':taskId/subtasks/:subtaskId')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask deleted successfully' })
  async removeSubtask(
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.subtasksService.remove(taskId, subtaskId);
  }

  @Post(':taskId/subtasks/reorder')
  @ApiOperation({ summary: 'Reorder subtasks' })
  @ApiResponse({ status: 200, description: 'Subtasks reordered successfully' })
  async reorderSubtasks(
    @Param('taskId') taskId: string,
    @Body() body: { subtaskIds: string[] },
  ) {
    return this.subtasksService.reorder(taskId, body.subtaskIds);
  }

  @Get('analytics/productivity')
  @ApiOperation({ summary: 'Get productivity analytics for the current week' })
  @ApiResponse({ status: 200, description: 'Productivity analytics retrieved' })
  getProductivityAnalytics(@Request() req) {
    return this.tasksService.getProductivityAnalytics(req.user.userId);
  }
}
