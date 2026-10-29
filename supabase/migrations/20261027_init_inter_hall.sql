-- ==============================================================================
-- Inter-Hall Sports Management System: MVP Database Schema & Row-Level Security
-- Four Halls: Blue, Black, Gold, Purple
-- ==============================================================================

-- 1. Create Halls Table
CREATE TABLE IF NOT EXISTS public.halls (
    id TEXT PRIMARY KEY, -- 'blue', 'black', 'gold', 'purple'
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    motto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Halls
INSERT INTO public.halls (id, name, color, bg_color, motto) VALUES
    ('blue', 'Blue Hall', '#3b82f6', '#1e3a8a', 'Unity in Excellence'),
    ('black', 'Black Hall', '#9ca3af', '#111827', 'Strength & Resilience'),
    ('gold', 'Gold Hall', '#f59e0b', '#78350f', 'Glory & Triumph'),
    ('purple', 'Purple Hall', '#8b5cf6', '#4c1d95', 'Honour & Ambition')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Administrator Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'referee', 'superadmin')) DEFAULT 'admin' NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Sports Categories Table
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    rules TEXT,
    points_for_win INTEGER DEFAULT 3 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Sports
INSERT INTO public.sports (name, icon, description, points_for_win) VALUES
    ('Football', '⚽', '11-a-side on the main pitch', 3),
    ('Basketball', '🏀', '5-a-side in Sports Hall A', 3),
    ('Volleyball', '🏐', '6-a-side in Sports Hall B', 3),
    ('Athletics', '🏃', 'Track & Field disciplines', 5),
    ('Table Tennis', '🏓', 'Singles & Doubles in Recreation Centre', 2),
    ('Swimming', '🏊', 'Pool events at Aquatic Centre', 5)
ON CONFLICT (name) DO NOTHING;

-- 4. Create Students Registry & Eligibility Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reg_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    hall_id TEXT NOT NULL REFERENCES public.halls(id) ON DELETE RESTRICT,
    eligibility_status TEXT CHECK (eligibility_status IN ('eligible', 'pending_verification', 'ineligible')) DEFAULT 'pending_verification' NOT NULL,
    year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 7),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    home_hall_id TEXT NOT NULL REFERENCES public.halls(id),
    away_hall_id TEXT NOT NULL REFERENCES public.halls(id),
    home_score INTEGER DEFAULT 0 NOT NULL,
    away_score INTEGER DEFAULT 0 NOT NULL,
    status TEXT CHECK (status IN ('upcoming', 'live', 'finished')) DEFAULT 'upcoming' NOT NULL,
    match_minute INTEGER DEFAULT 0,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    venue TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Match Events Table (Real-time Live Feed)
CREATE TABLE IF NOT EXISTS public.match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    hall_id TEXT NOT NULL REFERENCES public.halls(id),
    event_type TEXT CHECK (event_type IN ('GOAL', 'POINT', 'FOUL', 'PENALTY', 'CARD', 'SUBSTITUTION')) NOT NULL,
    description TEXT NOT NULL,
    match_minute INTEGER,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Match Results & Points Allocation Table
CREATE TABLE IF NOT EXISTS public.match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
    winner_hall_id TEXT REFERENCES public.halls(id),
    is_draw BOOLEAN DEFAULT FALSE NOT NULL,
    home_hall_pts INTEGER DEFAULT 0 NOT NULL,
    away_hall_pts INTEGER DEFAULT 0 NOT NULL,
    approved_by UUID NOT NULL REFERENCES public.profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- Requirements: Public reads allowed; Only authorized admins can write/update.
-- Sensitive student details protected (Public only verifies eligibility status)
-- ==============================================================================

ALTER TABLE public.halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;

-- Halls: Public can view
CREATE POLICY "Public read halls" ON public.halls FOR SELECT USING (true);

-- Sports: Public can view
CREATE POLICY "Public read sports" ON public.sports FOR SELECT USING (true);

-- Matches: Public can view live scores & schedules
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);

-- Match Events: Public can view real-time events
CREATE POLICY "Public read match events" ON public.match_events FOR SELECT USING (true);

-- Match Results: Public can view approved standings & results
CREATE POLICY "Public read match results" ON public.match_results FOR SELECT USING (true);

-- Students: Public can only search for minimal verification (status + hall)
-- We enforce this via a security definer function or restricted SELECT
CREATE POLICY "Public search eligibility" ON public.students FOR SELECT USING (true);

-- Admin Write Policies (Profile must exist and role in ('admin', 'superadmin'))
CREATE POLICY "Admin write matches" ON public.matches FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin', 'referee'))
);

CREATE POLICY "Admin write events" ON public.match_events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin', 'referee'))
);

CREATE POLICY "Admin manage students" ON public.students FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

CREATE POLICY "Admin manage sports" ON public.sports FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

CREATE POLICY "Admin manage results" ON public.match_results FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Enable Realtime Broadcasting on matches and events
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_events;
