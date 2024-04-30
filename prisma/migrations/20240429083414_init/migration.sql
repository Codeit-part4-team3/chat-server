-- AlterTable
ALTER TABLE `channel` ADD COLUMN `groupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Channel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
