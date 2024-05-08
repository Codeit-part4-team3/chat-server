/*
  Warnings:

  - You are about to drop the `userchannel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userchannel` DROP FOREIGN KEY `UserChannel_channelId_fkey`;

-- DropTable
DROP TABLE `userchannel`;
