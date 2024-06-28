import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { CompressionModule } from './compression/compression.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule,
    CompressionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
