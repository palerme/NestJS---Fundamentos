import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [],
  exports: [FileService],
  providers: [FileService]
})
export class FileModule {}