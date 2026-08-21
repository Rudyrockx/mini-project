/*
  Warnings:

  - You are about to drop the column `addeddAt` on the `WishlistItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "addeddAt";
