import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { MULTER_DEST } from 'src/constants';

@Injectable()
export class CompressionService {
  constructor(private readonly configService: ConfigService) {}

  compress(file: string) {
    const inputPath = `${this.configService.get<string>(MULTER_DEST)}${file}`;
    const outputPath = `${this.configService.get<string>(MULTER_DEST)}${file}.gz`;

    const gzip = createGzip();
    const input = createReadStream(inputPath);
    const output = createWriteStream(outputPath);

    input.pipe(gzip).pipe(output);

    output.on("close", function() {
      const logger = new Logger(CompressionService.name);
      logger.log(`Compressed ${file}`);
      
      unlink(inputPath, function(error) {
        if (error) {
          logger.error(`Failed to delete ${file}`);
          return;
        }
        logger.log(`Deleted ${file}`);
      })
    })

    output.on("error", function(error) {
      const logger = new Logger(CompressionService.name);
      logger.log(`Failed to compress ${file}`);
      logger.error(error.message);
    })
  }
}
