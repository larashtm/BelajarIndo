/*
  Warnings:

  - You are about to drop the column `answers` on the `quizresult` table. All the data in the column will be lost.
  - You are about to drop the column `quizType` on the `quizresult` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `quizresult` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `flashcardprogress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizCategory` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `flashcardprogress` DROP FOREIGN KEY `FlashcardProgress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `quizresult` DROP FOREIGN KEY `QuizResult_userId_fkey`;

-- AlterTable
ALTER TABLE `quizresult` DROP COLUMN `answers`,
    DROP COLUMN `quizType`,
    ADD COLUMN `quizCategory` VARCHAR(191) NOT NULL,
    MODIFY `score` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `flashcardprogress`;

-- CreateTable
CREATE TABLE `QuizProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `quizCategory` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `currentQuestion` INTEGER NOT NULL DEFAULT 0,
    `lastAccessed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuizProgress_userId_idx`(`userId`),
    UNIQUE INDEX `QuizProgress_userId_quizCategory_key`(`userId`, `quizCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VocabProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `wordsLearned` JSON NOT NULL,
    `lastAccessed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VocabProgress_userId_idx`(`userId`),
    UNIQUE INDEX `VocabProgress_userId_category_key`(`userId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuizProgress` ADD CONSTRAINT `QuizProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VocabProgress` ADD CONSTRAINT `VocabProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `quizresult` RENAME INDEX `QuizResult_userId_fkey` TO `QuizResult_userId_idx`;
