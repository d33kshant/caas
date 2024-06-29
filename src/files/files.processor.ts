import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CompressionService } from "src/compression/compression.service";
import { FILES_QUEUE } from "src/constants";

@Processor(FILES_QUEUE)
export class FilesProcessor {
  constructor(private readonly compressionService: CompressionService) {}

  @Process()
  process(job: Job<{ file: string }>) {
    const { file } = job.data
    this.compressionService.compress(file);
  }
}