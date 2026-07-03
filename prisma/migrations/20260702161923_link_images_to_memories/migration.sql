-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "memoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
