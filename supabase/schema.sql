-- Zone Zero Navigator - Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS & AUTH
-- =============================================================================

-- Public user profiles (linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    company TEXT,
    phone TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    claude_api_key TEXT, -- User's own API key (encrypted in production)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- REPORTS & AUDITS
-- =============================================================================

-- Audit reports
CREATE TABLE reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Property Info
    property_address TEXT NOT NULL,
    property_city TEXT,
    property_state TEXT DEFAULT 'CA',
    property_zip TEXT,
    jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('san_diego', 'california', 'los_angeles', 'orange_county', 'ventura', 'other')),
    
    -- Assessment Results
    overall_score INTEGER DEFAULT 0,
    risk_tier TEXT CHECK (risk_tier IN ('low', 'moderate', 'high', 'extreme')),
    ai_analysis JSONB,
    violations JSONB DEFAULT '[]'::jsonb,
    
    -- Photos
    photos JSONB DEFAULT '[]'::jsonb,
    annotated_photos JSONB DEFAULT '[]'::jsonb,
    
    -- Compliance
    compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'compliant', 'non_compliant', 'remediation_required')),
    deadline_date DATE,
    lra_zone TEXT,
    
    -- Costs
    estimated_remediation_cost DECIMAL(10,2),
    annual_insurance_savings DECIMAL(10,2),
    
    -- Metadata
    is_public BOOLEAN DEFAULT false,
    share_code UUID,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================

-- Subscription plans (for reference)
CREATE TABLE plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL,
    ai_analyses_per_month INTEGER,
    reports_storage_limit INTEGER,
    priority_support BOOLEAN DEFAULT false,
    custom_branding BOOLEAN DEFAULT false
);

-- Insert default plans
INSERT INTO plans (id, name, price_monthly, price_yearly, features, ai_analyses_per_month, reports_storage_limit, priority_support, custom_branding) VALUES
('free', 'Free', 0, 0, '{
    "ai_analyses": 1,
    "reports_storage": 5,
    "pdf_export": false,
    "priority_support": false,
    "custom_branding": false,
    "api_key_storage": true
}'::jsonb, 1, 5, false, false),
('pro', 'Professional', 29, 290, '{
    "ai_analyses": 25,
    "reports_storage": 100,
    "pdf_export": true,
    "priority_support": true,
    "custom_branding": false,
    "api_key_storage": true,
    "batch_processing": false
}'::jsonb, 25, 100, true, false),
('enterprise', 'Enterprise', 99, 990, '{
    "ai_analyses": -1,
    "reports_storage": -1,
    "pdf_export": true,
    "priority_support": true,
    "custom_branding": true,
    "api_key_storage": true,
    "batch_processing": true,
    "dedicated_account_manager": true,
    "sla": true
}'::jsonb, -1, -1, true, true);

-- =============================================================================
-- PAYMENTS
-- =============================================================================

-- Payment history
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_invoice_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    plan_id TEXT REFERENCES plans(id),
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- API USAGE TRACKING
-- =============================================================================

-- Track AI API usage
CREATE TABLE api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    tokens_used INTEGER DEFAULT 0,
    cost DECIMAL(10,6),
    model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Reports: Users can only see their own reports
CREATE POLICY "Users can view own reports" ON reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON reports
    FOR DELETE USING (auth.uid() = user_id);

-- Allow public read if is_public is true
CREATE POLICY "Public reports are viewable by everyone" ON reports
    FOR SELECT USING (is_public = true);

-- Payments: Users can only see their own
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- API Usage: Users can only see their own
CREATE POLICY "Users can view own api usage" ON api_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create api usage records" ON api_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate share code for public reports
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_public AND OLD.is_public IS DISTINCT FROM NEW.is_public THEN
        NEW.share_code := uuid_generate_v4();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_share_code BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION generate_share_code();

-- =============================================================================
-- REALTIME
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_jurisdiction ON reports(jurisdiction);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at DESC);
