/*
  Warnings:

  - You are about to alter the column `birthAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` INTEGER NOT NULL DEFAULT 1,
    MODIFY `birthAt` DATETIME NULL;

-- DropTable
DROP TABLE `logs`;
