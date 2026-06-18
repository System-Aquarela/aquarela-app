-- Relate media and consent data to the profiles and users that own it.
ALTER TABLE "CareProfile" ADD COLUMN "photoMediaId" TEXT;
ALTER TABLE "ImportantPerson" ADD COLUMN "photoMediaId" TEXT;

CREATE UNIQUE INDEX "CareProfile_photoMediaId_key" ON "CareProfile"("photoMediaId");
CREATE UNIQUE INDEX "ImportantPerson_photoMediaId_key" ON "ImportantPerson"("photoMediaId");
CREATE INDEX "FaceImage_personId_active_idx" ON "FaceImage"("personId", "active");
CREATE INDEX "MediaAsset_profileId_idx" ON "MediaAsset"("profileId");
CREATE INDEX "MediaAsset_uploaderId_idx" ON "MediaAsset"("uploaderId");
CREATE INDEX "ConsentRecord_profileId_scope_recordedAt_idx" ON "ConsentRecord"("profileId", "scope", "recordedAt");
CREATE INDEX "ConsentRecord_personId_scope_recordedAt_idx" ON "ConsentRecord"("personId", "scope", "recordedAt");

ALTER TABLE "CareProfile"
  ADD CONSTRAINT "CareProfile_photoMediaId_fkey"
  FOREIGN KEY ("photoMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ImportantPerson"
  ADD CONSTRAINT "ImportantPerson_photoMediaId_fkey"
  FOREIGN KEY ("photoMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "CareProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_uploaderId_fkey"
  FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConsentRecord"
  ADD CONSTRAINT "ConsentRecord_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "CareProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConsentRecord"
  ADD CONSTRAINT "ConsentRecord_personId_fkey"
  FOREIGN KEY ("personId") REFERENCES "ImportantPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConsentRecord"
  ADD CONSTRAINT "ConsentRecord_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
