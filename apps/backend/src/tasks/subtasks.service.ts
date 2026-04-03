import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, createSubtaskDto: CreateSubtaskDto) {
    // Verificar se a tarefa existe
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Planejar order se não fornecido
    const order = createSubtaskDto.order ?? (await this.getMaxOrder(taskId)) + 1;

    return this.prisma.subtask.create({
      data: {
        ...createSubtaskDto,
        order,
        taskId,
      },
    });
  }

  async findAll(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(taskId: string, id: string) {
    const subtask = await this.prisma.subtask.findFirst({
      where: { id, taskId },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    return subtask;
  }

  // eslint-disable-next-line no-unused-vars
  async update(taskId: string, id: string, updateSubtaskDto: UpdateSubtaskDto) {
    // eslint-disable-next-line no-unused-vars
    const subtask = await this.findOne(taskId, id);

    return this.prisma.subtask.update({
      where: { id },
      data: updateSubtaskDto,
    });
  }

  async remove(taskId: string, id: string) {
    // Verificar se existe antes de deletar
    await this.findOne(taskId, id);

    return this.prisma.subtask.delete({
      where: { id },
    });
  }

  async reorder(taskId: string, subtaskIds: string[]) {
    // Verificar se todos os IDs existem na tarefa
    const subtasks = await this.prisma.subtask.findMany({
      where: { taskId },
    });

    const existingIds = subtasks.map((s) => s.id);
    const allExist = subtaskIds.every((id) => existingIds.includes(id));

    if (!allExist) {
      throw new NotFoundException('Some subtasks not found in this task');
    }

    // Atualizar ordem de cada subtarefa
    const updatePromises = subtaskIds.map((id, index) =>
      this.prisma.subtask.update({
        where: { id },
        data: { order: index },
      }),
    );

    await Promise.all(updatePromises);

    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { order: 'asc' },
    });
  }

  private async getMaxOrder(taskId: string): Promise<number> {
    const max = await this.prisma.subtask.findFirst({
      where: { taskId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return max?.order ?? -1;
  }
}
