-- CreateTable
CREATE TABLE "CityOverview" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "historyTitle" TEXT,
    "historyTitleEn" TEXT,
    "historyContent" TEXT,
    "historyContentEn" TEXT,
    "historyImage" TEXT,
    "cultureTitle" TEXT,
    "cultureTitleEn" TEXT,
    "cultureContent" TEXT,
    "cultureContentEn" TEXT,
    "cultureImage" TEXT,
    "customsTitle" TEXT,
    "customsTitleEn" TEXT,
    "customsContent" TEXT,
    "customsContentEn" TEXT,
    "customsImage" TEXT,
    "heritageItems" JSONB,
    "heritageItemsEn" JSONB,
    "festivals" JSONB,
    "festivalsEn" JSONB,
    "historicalStories" JSONB,
    "historicalStoriesEn" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CityOverview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CityOverview_cityId_key" ON "CityOverview"("cityId");

-- AddForeignKey
ALTER TABLE "CityOverview" ADD CONSTRAINT "CityOverview_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
