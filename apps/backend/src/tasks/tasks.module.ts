import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TasksService, SubtasksService, SubtasksController],
  controllers: [TasksController],
})
export class TasksModule {}
