-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "travelStyle" TEXT,
    "budgetRange" TEXT,
    "travelDuration" TEXT,
    "groupSize" INTEGER,
    "travelCompanions" TEXT[],
    "preferredDestinations" TEXT[],
    "climatePreference" TEXT,
    "seasonPreference" TEXT[],
    "domesticVsInternational" TEXT,
    "activityTypes" TEXT[],
    "accommodationType" TEXT,
    "transportationMode" TEXT[],
    "diningPreferences" TEXT[],
    "accessibilityNeeds" TEXT[],
    "dietaryRestrictions" TEXT[],
    "languageBarriers" BOOLEAN,
    "safetyPriority" INTEGER,
    "interests" TEXT[],
    "travelExperience" TEXT,
    "previousDestinations" TEXT[],
    "informationSources" TEXT[],
    "bookingPreferences" TEXT[],
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "totalSteps" INTEGER NOT NULL DEFAULT 5,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "lastSavedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedFields" TEXT[],
    "validationErrors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
