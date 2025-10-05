-- AlterTable
ALTER TABLE "CityOverview" ADD COLUMN     "pictureAdvises" JSONB,
ADD COLUMN     "pictures" JSONB;

-- CreateTable
CREATE TABLE "CollectionTask" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "result" JSONB,
    "error" TEXT,
    "cozeRequest" JSONB,
    "cozeResponse" JSONB,
    "cozeApiCalls" JSONB,
    "parseError" TEXT,
    "executionSteps" JSONB,
    "dataProcessing" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataReview" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataReview_pkey" PRIMARY KEY ("id")
);
