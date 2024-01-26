import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class FileService {

  async upload(file: Express.Multer.File, path: string) {

    console.log(file);

    return writeFile(path, file.buffer);

  }
}