/*
  Warnings:

  - You are about to drop the `TravelSurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TravelSurvey" DROP CONSTRAINT "TravelSurvey_userId_fkey";

-- DropTable
DROP TABLE "TravelSurvey";

-- CreateTable
CREATE TABLE "TravelPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "nationality" TEXT NOT NULL,
    "languagePreference" TEXT NOT NULL,
    "ageGroup" TEXT,
    "plannedCities" TEXT[],
    "travelStartDate" TIMESTAMP(3),
    "travelEndDate" TIMESTAMP(3),
    "travelDays" INTEGER,
    "groupSize" INTEGER,
    "groupType" TEXT,
    "budgetRange" TEXT,
    "budgetAmount" DOUBLE PRECISION,
    "budgetCurrency" TEXT,
    "accommodationType" TEXT,
    "transportPreference" TEXT,
    "diningPreference" TEXT,
    "specialNeeds" TEXT[],
    "interestTags" TEXT[],
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
