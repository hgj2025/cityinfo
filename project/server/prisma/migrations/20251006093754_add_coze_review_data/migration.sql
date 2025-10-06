-- CreateTable
CREATE TABLE "CozeReviewData" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewerId" TEXT,
    "reviewerName" TEXT,
    "notes" TEXT,
    "selectedImages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CozeReviewData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CozeReviewData_status_idx" ON "CozeReviewData"("status");

-- CreateIndex
CREATE INDEX "CozeReviewData_dataType_idx" ON "CozeReviewData"("dataType");

-- CreateIndex
CREATE INDEX "CozeReviewData_createdAt_idx" ON "CozeReviewData"("createdAt");

-- AddForeignKey
ALTER TABLE "CozeReviewData" ADD CONSTRAINT "CozeReviewData_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CollectionTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
