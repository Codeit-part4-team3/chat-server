-- CreateTable
CREATE TABLE `Server` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `serverId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Channel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isPrivate` BOOLEAN NOT NULL DEFAULT false,
    `isVoice` BOOLEAN NOT NULL DEFAULT false,
    `serverId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserServer` (
    `serverId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`serverId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `roleId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserChannel` (
    `channelId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`channelId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InviteServer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serverId` INTEGER NOT NULL,
    `inviterId` INTEGER NOT NULL,
    `inviteeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Channel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserServer` ADD CONSTRAINT `UserServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChannel` ADD CONSTRAINT `UserChannel_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteServer` ADD CONSTRAINT `InviteServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
