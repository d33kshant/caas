import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { FILES_QUEUE, PUBLIC_ROOT, STATIC_ROOT } from 'src/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  logger = new Logger(FilesService.name);
  staticRoot: string;
  publicRoot: string;

  constructor(
    @InjectQueue(FILES_QUEUE) private readonly filesQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.publicRoot = configService.get<string>(PUBLIC_ROOT);
    this.staticRoot = configService.get<string>(STATIC_ROOT);
  }

  async enqueueFile(file: string) {
    const job: Job<string> = await this.filesQueue.add({ file });
    this.logger.log(`Enqueued ${file}`);
    
    const href = `${this.publicRoot}${this.staticRoot}${file}.gz`
    return { href };
  }
}
