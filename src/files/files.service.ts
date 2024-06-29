import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { FILES_QUEUE } from 'src/constants';

@Injectable()
export class FilesService {
  logger = new Logger(FilesService.name)

  constructor(@InjectQueue(FILES_QUEUE) private readonly filesQueue: Queue) {}

  async enqueueFile(file: string) {
    const job: Job<string> = await this.filesQueue.add({ file });
    this.logger.log(`Enqueued ${file}`)
    return job.data
  }
}
