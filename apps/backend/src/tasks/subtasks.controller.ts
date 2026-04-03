import { Injectable } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

/**
 * @deprecated This controller is deprecated. Use TasksController subtask routes instead.
 * Routes:
 * - POST /tasks/:taskId/subtasks
 * - GET /tasks/:taskId/subtasks
 * - GET /tasks/:taskId/subtasks/:subtaskId
 * - PATCH /tasks/:taskId/subtasks/:subtaskId
 * - DELETE /tasks/:taskId/subtasks/:subtaskId
 * - POST /tasks/:taskId/subtasks/reorder
 */
@ApiTags('Subtasks')
@ApiBearerAuth()
@Injectable()
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  async create(
    taskId: string,
    createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(taskId, createSubtaskDto);
  }

  async findAll(taskId: string) {
    return this.subtasksService.findAll(taskId);
  }

  async findOne(
    taskId: string,
    id: string,
  ) {
    return this.subtasksService.findOne(taskId, id);
  }

  async update(
    taskId: string,
    id: string,
    updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(taskId, id, updateSubtaskDto);
  }

  async remove(
    taskId: string,
    id: string,
  ) {
    return this.subtasksService.remove(taskId, id);
  }

  async reorder(
    taskId: string,
    body: { subtaskIds: string[] },
  ) {
    return this.subtasksService.reorder(taskId, body.subtaskIds);
  }
}
