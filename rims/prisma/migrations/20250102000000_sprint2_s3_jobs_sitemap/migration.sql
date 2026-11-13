-- Sprint 2: S3 upload pipeline, background jobs, sitemap, robots.txt

-- ── InstitutionWebsite: sitemap cache ────────────────────────────────────────
ALTER TABLE institution_websites
  ADD COLUMN IF NOT EXISTS sitemap_cache        TEXT,
  ADD COLUMN IF NOT EXISTS sitemap_generated_at TIMESTAMPTZ;

-- ── WebsiteNews: scheduled publish ───────────────────────────────────────────
ALTER TABLE website_news
  ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_website_news_scheduled
  ON website_news (scheduled_publish_at)
  WHERE status = 'APPROVED' AND scheduled_publish_at IS NOT NULL;

-- ── WebsiteEvent: scheduled publish ──────────────────────────────────────────
ALTER TABLE website_events
  ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_website_events_scheduled
  ON website_events (scheduled_publish_at)
  WHERE status = 'APPROVED' AND scheduled_publish_at IS NOT NULL;

-- ── WebsitePage: index on existing scheduled_at for J-002 ────────────────────
CREATE INDEX IF NOT EXISTS idx_website_pages_scheduled
  ON website_pages (scheduled_at)
  WHERE status = 'APPROVED' AND scheduled_at IS NOT NULL;
