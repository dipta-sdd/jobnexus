/*
  Warnings:

  - Added the required column `updatedAt` to the `InteractionLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `clientId` on table `InteractionLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientId` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InteractionLog" DROP CONSTRAINT "InteractionLog_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_clientId_fkey";

-- AlterTable
ALTER TABLE "InteractionLog" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "clientId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InteractionLog" ADD CONSTRAINT "InteractionLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
