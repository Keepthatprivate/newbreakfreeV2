-- CreateTable
CREATE TABLE "TrackingSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fbp" TEXT,
    "fbc" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "userId" TEXT,
    "emailHash" TEXT,
    "phoneHash" TEXT,
    "externalIdHash" TEXT,
    "lastEventAt" TIMESTAMP(3),
    "eventCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrackingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackingId" TEXT,
    "eventName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "requestJson" JSONB,
    "responseJson" JSONB,
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutLinkage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT NOT NULL,
    "fbp" TEXT,
    "fbc" TEXT,
    "fbEventId" TEXT,
    "userId" TEXT,
    "emailHash" TEXT,
    "clientIp" TEXT,
    "userAgent" TEXT,
    "purchaseSent" BOOLEAN NOT NULL DEFAULT false,
    "purchaseSentAt" TIMESTAMP(3),

    CONSTRAINT "CheckoutLinkage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackingSession_fbp_idx" ON "TrackingSession"("fbp");

-- CreateIndex
CREATE INDEX "TrackingSession_userId_idx" ON "TrackingSession"("userId");

-- CreateIndex
CREATE INDEX "EventLog_eventId_idx" ON "EventLog"("eventId");

-- CreateIndex
CREATE INDEX "EventLog_eventName_idx" ON "EventLog"("eventName");

-- CreateIndex
CREATE INDEX "EventLog_source_idx" ON "EventLog"("source");

-- CreateIndex
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutLinkage_stripeSessionId_key" ON "CheckoutLinkage"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CheckoutLinkage_stripeSessionId_idx" ON "CheckoutLinkage"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CheckoutLinkage_userId_idx" ON "CheckoutLinkage"("userId");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "TrackingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
