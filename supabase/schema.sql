-- =============================================================================
-- CULTx: PAN-AFRICAN AGRICULTURAL INTELLIGENCE & OPERATING SYSTEM
-- COMPLETE PRODUCTION SUPABASE BACKEND SCHEMA & AUTHENTICATION SPECIFICATION
-- =============================================================================
-- Target: PostgreSQL 15+ / Supabase (with pg_crypto, auth schema integration & RLS)
-- Description: Full schema covering Multi-Role RBAC, Digital Farm Twins, IoT Sensors,
--              Commodity Exchanges, Forward Contracts, e-WRS, Logistics, Cooperatives,
--              Offline Sync Audit Logs, and Sovereign Data Privacy Charters.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. DATABASE EXTENSIONS & SCHEMAS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. CUSTOM ENUMS & DOMAIN TYPES
-- -----------------------------------------------------------------------------

-- Core Platform Roles (Matches RBAC Engine)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'farmer',
        'agribusiness',
        'buyer',
        'logistics',
        'finance',
        'government',
        'cooperative',
        'researcher',
        'input_supplier',
        'superadmin'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Field Parcel Vegetative Health
DO $$ BEGIN
    CREATE TYPE field_health_status AS ENUM (
        'Excellent',
        'Good',
        'Moderate',
        'Attention Required',
        'Critical'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Agronomic Nutrient Status
DO $$ BEGIN
    CREATE TYPE nutrient_status AS ENUM (
        'Deficient',
        'Optimal',
        'Excess'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Soil pH Status
DO $$ BEGIN
    CREATE TYPE ph_balance_status AS ENUM (
        'Acidic',
        'Optimal',
        'Alkaline'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- IoT Sensor Node Health
DO $$ BEGIN
    CREATE TYPE sensor_node_status AS ENUM (
        'online',
        'warning',
        'offline'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Sensor Alert Categories
DO $$ BEGIN
    CREATE TYPE sensor_alert_type AS ENUM (
        'moisture_deficit',
        'nitrogen_leach',
        'ph_imbalance',
        'high_salinity',
        'low_battery'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Alert Severity
DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM (
        'critical',
        'warning',
        'info'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Forward Purchase Contract Lifecycle
DO $$ BEGIN
    CREATE TYPE contract_status AS ENUM (
        'Draft',
        'Under Review',
        'Escrow Funded',
        'In Transit',
        'Completed',
        'Disputed'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Electronic Warehouse Receipt (e-WRS) Status
DO $$ BEGIN
    CREATE TYPE ewrs_status AS ENUM (
        'Active',
        'Loan Disbursed',
        'Liquidated'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Agri-Finance Facilities
DO $$ BEGIN
    CREATE TYPE financing_facility_type AS ENUM (
        'Input Financing',
        'Working Capital',
        'Equipment Finance',
        'Seasonal Loan',
        'Inventory Finance',
        'Export Finance'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Loan Application States
DO $$ BEGIN
    CREATE TYPE loan_application_status AS ENUM (
        'Submitted',
        'Under Review',
        'Pre-Approved',
        'Disbursed',
        'Rejected',
        'Repaid'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Multimodal Logistics Transit Status
DO $$ BEGIN
    CREATE TYPE route_transit_status AS ENUM (
        'Dispatched',
        'In Transit',
        'Customs Clearance',
        'Delivered'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Sovereign Document Vault Categories
DO $$ BEGIN
    CREATE TYPE document_category AS ENUM (
        'Land Title',
        'Certification',
        'Contract',
        'Soil Report',
        'Insurance'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Document Verification States
DO $$ BEGIN
    CREATE TYPE document_verification_status AS ENUM (
        'Verified',
        'Registry Validated',
        'Under Review',
        'Expiring Soon'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Offline Activity Log Status
DO $$ BEGIN
    CREATE TYPE activity_log_status AS ENUM (
        'failed',
        'retry_pending',
        'resolved'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------

-- Universal auto-updating timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. PROFILES & SOVEREIGN DATA PRIVACY
-- -----------------------------------------------------------------------------

-- User profiles tied 1:1 to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    role_label TEXT NOT NULL DEFAULT 'Smallholder & Commercial Farmer',
    organization TEXT,
    country_code VARCHAR(4) NOT NULL DEFAULT 'KE',
    country_name TEXT NOT NULL DEFAULT 'Kenya',
    avatar_initials VARCHAR(4) NOT NULL DEFAULT 'UX',
    phone TEXT,
    is_verified BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country_code);

-- User Sovereign Data Consent Settings (POPIA, NDPR & Kenyan DPA 2019 compliance)
CREATE TABLE IF NOT EXISTS public.user_consent_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    share_with_financial_institutions BOOLEAN NOT NULL DEFAULT true,
    share_with_government_policy BOOLEAN NOT NULL DEFAULT true,
    share_with_marketplace_buyers BOOLEAN NOT NULL DEFAULT true,
    allow_satellite_ndvi_analysis BOOLEAN NOT NULL DEFAULT true,
    retention_months INTEGER NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-sync updated_at on profiles & consent
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_consent_updated_at
BEFORE UPDATE ON public.user_consent_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. DIGITAL FARM TWINS & AGRONOMIC FIELD PARCELS
-- -----------------------------------------------------------------------------

-- Farms (Holding entity with cadastre boundaries and telemetry scores)
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    country_code VARCHAR(4) NOT NULL DEFAULT 'KE',
    country TEXT NOT NULL DEFAULT 'Kenya',
    region TEXT NOT NULL,
    total_hectares NUMERIC(10, 2) NOT NULL CHECK (total_hectares > 0),
    primary_crop TEXT NOT NULL,
    overall_health_score INTEGER NOT NULL CHECK (overall_health_score BETWEEN 0 AND 100) DEFAULT 88,
    soil_health NUMERIC(5, 2) DEFAULT 82.0,
    crop_health NUMERIC(5, 2) DEFAULT 91.0,
    water_index NUMERIC(5, 2) DEFAULT 76.0,
    weather_risk NUMERIC(5, 2) DEFAULT 22.0,
    pest_risk NUMERIC(5, 2) DEFAULT 14.0,
    expected_yield_tonnes_per_ha NUMERIC(6, 2) DEFAULT 6.4,
    trust_score INTEGER NOT NULL CHECK (trust_score BETWEEN 1 AND 5) DEFAULT 5,
    verified_status TEXT NOT NULL DEFAULT 'verified',
    last_satellite_pass TIMESTAMPTZ DEFAULT NOW(),
    boundary_polygon JSONB DEFAULT '[]'::jsonb, -- Array of [lat, lng] or GeoJSON
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_owner ON public.farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_farms_country ON public.farms(country_code);

CREATE TRIGGER set_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Field Zones (Sub-parcels with specific NDVI & nutrient telemetry)
CREATE TABLE IF NOT EXISTS public.field_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    crop TEXT NOT NULL,
    area_ha NUMERIC(8, 2) NOT NULL CHECK (area_ha > 0),
    health field_health_status NOT NULL DEFAULT 'Good',
    ndvi_score NUMERIC(4, 3) NOT NULL CHECK (ndvi_score BETWEEN 0.0 AND 1.0) DEFAULT 0.75,
    soil_moisture NUMERIC(5, 2) NOT NULL DEFAULT 42.0,
    nitrogen_status nutrient_status NOT NULL DEFAULT 'Optimal',
    phosphorus_status nutrient_status NOT NULL DEFAULT 'Optimal',
    potassium_status nutrient_status NOT NULL DEFAULT 'Optimal',
    coordinates JSONB NOT NULL DEFAULT '[]'::jsonb, -- Polygon relative coords
    alerts TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_zones_farm ON public.field_zones(farm_id);

CREATE TRIGGER set_field_zones_updated_at
BEFORE UPDATE ON public.field_zones
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 5. IN-SITU SOIL IOT SENSORS & TELEMETRY MESH
-- -----------------------------------------------------------------------------

-- LoRaWAN / NB-IoT Hardware Sensor Probes
CREATE TABLE IF NOT EXISTS public.soil_sensor_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    field_id UUID REFERENCES public.field_zones(id) ON DELETE SET NULL,
    node_code TEXT UNIQUE NOT NULL,
    field_name TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    battery_pct INTEGER CHECK (battery_pct BETWEEN 0 AND 100) DEFAULT 88,
    signal_rssi INTEGER DEFAULT -85,
    network_type TEXT NOT NULL DEFAULT 'LoRaWAN (868MHz)',
    last_ping_seconds INTEGER DEFAULT 18,
    status sensor_node_status NOT NULL DEFAULT 'online',
    active_irrigation_valve BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_nodes_farm ON public.soil_sensor_nodes(farm_id);
CREATE INDEX IF NOT EXISTS idx_sensor_nodes_code ON public.soil_sensor_nodes(node_code);

CREATE TRIGGER set_soil_sensor_nodes_updated_at
BEFORE UPDATE ON public.soil_sensor_nodes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- High-Frequency In-Situ Soil Telemetry Readings (Depth Strata: 10cm, 30cm, 60cm)
CREATE TABLE IF NOT EXISTS public.sensor_telemetry_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES public.soil_sensor_nodes(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    moisture_depth_10cm NUMERIC(5, 2) NOT NULL,
    moisture_depth_30cm NUMERIC(5, 2) NOT NULL,
    moisture_depth_60cm NUMERIC(5, 2) NOT NULL,
    temperature_celsius NUMERIC(5, 2) NOT NULL,
    nitrogen_ppm NUMERIC(6, 2) NOT NULL,
    phosphorus_ppm NUMERIC(6, 2) NOT NULL,
    potassium_ppm NUMERIC(6, 2) NOT NULL,
    ph NUMERIC(4, 2) NOT NULL,
    ec_milli_siemens NUMERIC(5, 2) NOT NULL,
    organic_matter_pct NUMERIC(4, 2) DEFAULT 3.6,
    battery_pct INTEGER
);

CREATE INDEX IF NOT EXISTS idx_telemetry_node_time ON public.sensor_telemetry_readings(node_id, timestamp DESC);

-- Sensor Telemetry Alerts (Anomalies & Leaching Thresholds)
CREATE TABLE IF NOT EXISTS public.sensor_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES public.soil_sensor_nodes(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    type sensor_alert_type NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'warning',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_alerts_farm ON public.sensor_alerts(farm_id, dismissed);

-- -----------------------------------------------------------------------------
-- 6. COMMODITY PRICES & PAN-AFRICAN MARKETPLACE
-- -----------------------------------------------------------------------------

-- Real-Time Wholesale Spot Prices Across 54 African Commodity Exchanges (SAFEX, ZAMACE, ECX, GCX)
CREATE TABLE IF NOT EXISTS public.commodity_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity TEXT NOT NULL,
    country TEXT NOT NULL,
    city_market TEXT NOT NULL,
    price_per_tonne NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(4) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    daily_change_pct NUMERIC(5, 2) DEFAULT 0.0,
    trend_30day NUMERIC(5, 2) DEFAULT 0.0,
    volume_traded_tonnes NUMERIC(12, 2) DEFAULT 0.0,
    quality_grade TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commodity_prices_query ON public.commodity_prices(commodity, country);

-- Marketplace Farm Produce Listings
CREATE TABLE IF NOT EXISTS public.market_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    commodity TEXT NOT NULL,
    quantity_tonnes NUMERIC(10, 2) NOT NULL CHECK (quantity_tonnes > 0),
    quality_grade TEXT NOT NULL,
    harvest_date DATE NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    min_price_per_tonne TEXT NOT NULL,
    delivery_options TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_listings_status ON public.market_listings(status, commodity);

CREATE TRIGGER set_market_listings_updated_at
BEFORE UPDATE ON public.market_listings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Bankable Forward Off-Take Purchase Contracts & Escrow
CREATE TABLE IF NOT EXISTS public.purchase_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    commodity TEXT NOT NULL,
    quantity_tonnes NUMERIC(10, 2) NOT NULL CHECK (quantity_tonnes > 0),
    price_per_tonne TEXT NOT NULL,
    quality_standard TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_location TEXT NOT NULL,
    payment_terms TEXT NOT NULL,
    arbitration_jurisdiction TEXT NOT NULL DEFAULT 'OHADA / SACU Cross-Border Commercial Chamber',
    escrow_provider TEXT NOT NULL DEFAULT 'PAPSS / Standard Bank Agri-Escrow',
    status contract_status NOT NULL DEFAULT 'Under Review',
    ai_risk_score INTEGER CHECK (ai_risk_score BETWEEN 0 AND 100) DEFAULT 92,
    ai_risks_identified JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_parties ON public.purchase_contracts(buyer_id, seller_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.purchase_contracts(status);

CREATE TRIGGER set_purchase_contracts_updated_at
BEFORE UPDATE ON public.purchase_contracts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 7. WAREHOUSES, SILOS & ELECTRONIC WAREHOUSE RECEIPTS (e-WRS)
-- -----------------------------------------------------------------------------

-- Licensed Terminal Silos & Cold-Chain Storage Warehouses
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    total_capacity_tonnes NUMERIC(12, 2) NOT NULL,
    utilized_tonnes NUMERIC(12, 2) NOT NULL,
    commodities_stored JSONB DEFAULT '[]'::jsonb,
    predicted_days_to_capacity INTEGER DEFAULT 45,
    certified_receipt_enabled BOOLEAN DEFAULT true,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_warehouses_updated_at
BEFORE UPDATE ON public.warehouses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tokenized Electronic Warehouse Receipts (Collateral for Grain Advance Loans)
CREATE TABLE IF NOT EXISTS public.ewrs_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number TEXT UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
    warehouse_name TEXT NOT NULL,
    commodity TEXT NOT NULL,
    tonnes NUMERIC(10, 2) NOT NULL CHECK (tonnes > 0),
    grade TEXT NOT NULL,
    moisture_pct NUMERIC(4, 2) NOT NULL,
    market_value_zar NUMERIC(14, 2) NOT NULL,
    loan_disbursed_zar NUMERIC(14, 2) DEFAULT 0.0,
    loan_eligibility_70pct NUMERIC(14, 2) NOT NULL,
    interest_rate_pct NUMERIC(5, 2) DEFAULT 9.2,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    qr_token TEXT NOT NULL,
    blockchain_hash TEXT,
    status ewrs_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ewrs_owner ON public.ewrs_receipts(owner_id);

CREATE TRIGGER set_ewrs_receipts_updated_at
BEFORE UPDATE ON public.ewrs_receipts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 8. AGRI-FINANCE CREDIT LINES & UNDERWRITING APPLICATIONS
-- -----------------------------------------------------------------------------

-- Institutional Financing Products (Banks, MFIs & DFIs)
CREATE TABLE IF NOT EXISTS public.financing_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type financing_facility_type NOT NULL,
    provider TEXT NOT NULL,
    max_amount TEXT NOT NULL,
    interest_rate_annual TEXT NOT NULL,
    tenure_months INTEGER NOT NULL,
    eligibility_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Underwriting Loan Applications
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.financing_products(id) ON DELETE SET NULL,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    requested_amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(4) NOT NULL DEFAULT 'ZAR',
    purpose TEXT NOT NULL,
    status loan_application_status NOT NULL DEFAULT 'Submitted',
    digital_collateral JSONB DEFAULT '{}'::jsonb,
    ai_credit_score INTEGER CHECK (ai_credit_score BETWEEN 0 AND 100),
    underwriter_notes TEXT,
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_applicant ON public.loan_applications(applicant_id);

CREATE TRIGGER set_loan_applications_updated_at
BEFORE UPDATE ON public.loan_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 9. MULTIMODAL LOGISTICS & TRANSIT TELEMETRY (LOBITO RAIL & ROAD)
-- -----------------------------------------------------------------------------

-- Freight Corridors & Active Transits
CREATE TABLE IF NOT EXISTS public.logistics_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number TEXT UNIQUE NOT NULL,
    carrier TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    cargo TEXT NOT NULL,
    volume_tonnes NUMERIC(10, 2) NOT NULL,
    vehicle_plate TEXT NOT NULL,
    corridor_name TEXT,
    transit_mode TEXT NOT NULL DEFAULT 'Road Freight',
    railway_line TEXT,
    customs_clearance_speed_hours NUMERIC(4, 1) DEFAULT 1.5,
    status route_transit_status NOT NULL DEFAULT 'In Transit',
    eta_hours INTEGER NOT NULL,
    temperature_controlled BOOLEAN NOT NULL DEFAULT false,
    current_temp_celsius NUMERIC(4, 1),
    risk_level TEXT NOT NULL DEFAULT 'Low',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logistics_tracking ON public.logistics_routes(tracking_number);

CREATE TRIGGER set_logistics_routes_updated_at
BEFORE UPDATE ON public.logistics_routes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 10. COOPERATIVE BULK PURCHASING & DEMAND POOLING
-- -----------------------------------------------------------------------------

-- Cooperative Purchasing Campaigns (Factory Gate Direct Buying)
CREATE TABLE IF NOT EXISTS public.cooperative_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    current_tonnage NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    target_tonnage NUMERIC(10, 2) NOT NULL CHECK (target_tonnage > 0),
    discount_pct INTEGER NOT NULL CHECK (discount_pct BETWEEN 1 AND 90),
    individual_price NUMERIC(12, 2) NOT NULL,
    group_price NUMERIC(12, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'MT',
    deadline_days INTEGER NOT NULL DEFAULT 7,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Member Volume Pledges
CREATE TABLE IF NOT EXISTS public.cooperative_pledges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.cooperative_campaigns(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    pledged_quantity NUMERIC(10, 2) NOT NULL CHECK (pledged_quantity > 0),
    unit TEXT NOT NULL,
    estimated_savings_zar NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coop_pledges_member ON public.cooperative_pledges(member_id, campaign_id);

-- -----------------------------------------------------------------------------
-- 11. AGRIBUSINESS INVENTORY & REGIONAL BUFFER COMPLIANCE
-- -----------------------------------------------------------------------------

-- Seed & Fertilizer Inventory Items (15% AfCFTA/SADC Strategic Reserve Tracking)
CREATE TABLE IF NOT EXISTS public.agri_inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Fertilizer', 'Seed')),
    brand_or_grade TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'MT',
    current_stock NUMERIC(10, 2) NOT NULL,
    safety_stock_threshold NUMERIC(10, 2) NOT NULL,
    reorder_point NUMERIC(10, 2) NOT NULL,
    allocated_to_orders NUMERIC(10, 2) DEFAULT 0.0,
    available_stock NUMERIC(10, 2) NOT NULL,
    unit_cost_usd NUMERIC(10, 2) NOT NULL,
    unit_price_usd NUMERIC(10, 2) NOT NULL,
    daily_burn_rate_normal NUMERIC(8, 2) NOT NULL,
    daily_burn_rate_peak NUMERIC(8, 2) NOT NULL,
    seasonal_demand_phase TEXT NOT NULL,
    predicted_stockout_days INTEGER NOT NULL,
    stock_health_status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_agri_inventory_updated_at
BEFORE UPDATE ON public.agri_inventory_items
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 12. DIGITAL DOCUMENT REPOSITORY & LAND CADASTRE VAULT
-- -----------------------------------------------------------------------------

-- Encrypted Document Records (Land Deeds, Phytosanitary Certificates, Soil Assays)
CREATE TABLE IF NOT EXISTS public.farmer_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category document_category NOT NULL,
    file_type VARCHAR(8) NOT NULL,
    file_size VARCHAR(16) NOT NULL,
    file_url TEXT,
    issuing_authority TEXT NOT NULL,
    document_number TEXT NOT NULL,
    parcel_or_contract_ref TEXT,
    sha256_hash VARCHAR(64) NOT NULL,
    verification_status document_verification_status NOT NULL DEFAULT 'Verified',
    security_tier TEXT NOT NULL DEFAULT 'AES-256 Encrypted Vault',
    shared_with TEXT[] NOT NULL DEFAULT '{}'::text[], -- e.g. ['finance', 'government']
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_farm ON public.farmer_documents(farm_id);
CREATE INDEX IF NOT EXISTS idx_documents_hash ON public.farmer_documents(sha256_hash);

CREATE TRIGGER set_farmer_documents_updated_at
BEFORE UPDATE ON public.farmer_documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 13. SYSTEM NOTIFICATIONS & CROSS-ROLE SYNC EVENTS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('urgent', 'important', 'opportunity', 'financial', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT 'Just now',
    read BOOLEAN NOT NULL DEFAULT false,
    action_label TEXT,
    target_view TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- Real-Time Cross-Role Data Synchronization Mesh Ledger
CREATE TABLE IF NOT EXISTS public.cross_role_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_role user_role NOT NULL,
    source_entity TEXT NOT NULL,
    target_roles user_role[] NOT NULL,
    action_type TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    synced BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_events_time ON public.cross_role_sync_events(created_at DESC);

-- -----------------------------------------------------------------------------
-- 14. OFFLINE ACTIVITY LOGS & MUTATION BATCH QUEUE
-- -----------------------------------------------------------------------------

-- Offline Activity Log (Captures failed mutations and sync retries)
CREATE TABLE IF NOT EXISTS public.offline_activity_logs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    entity TEXT NOT NULL,
    status activity_log_status NOT NULL DEFAULT 'failed',
    error_message TEXT NOT NULL,
    error_code TEXT NOT NULL DEFAULT 'ERR_OFFLINE_SYNC',
    retry_count INTEGER NOT NULL DEFAULT 0,
    payload_summary TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_logs_user ON public.offline_activity_logs(user_id, status);

-- -----------------------------------------------------------------------------
-- 15. AUTOMATIC PROFILE PROVISIONING TRIGGER (SUPABASE AUTH LINK)
-- -----------------------------------------------------------------------------

-- Function executed when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    initial_role user_role := 'farmer';
    initial_name text := 'New Operator';
    initial_country_code text := 'KE';
    initial_country_name text := 'Kenya';
    initial_org text := 'Farm & Agro Enterprise';
    initials text := 'UX';
BEGIN
    -- Extract metadata if passed in raw_user_meta_data
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        initial_role := (NEW.raw_user_meta_data->>'role')::user_role;
    END IF;

    IF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
        initial_name := NEW.raw_user_meta_data->>'name';
        initials := UPPER(SUBSTRING(initial_name FROM 1 FOR 2));
    END IF;

    IF NEW.raw_user_meta_data->>'countryCode' IS NOT NULL THEN
        initial_country_code := NEW.raw_user_meta_data->>'countryCode';
    END IF;

    IF NEW.raw_user_meta_data->>'countryName' IS NOT NULL THEN
        initial_country_name := NEW.raw_user_meta_data->>'countryName';
    END IF;

    IF NEW.raw_user_meta_data->>'organization' IS NOT NULL THEN
        initial_org := NEW.raw_user_meta_data->>'organization';
    END IF;

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        role_label,
        organization,
        country_code,
        country_name,
        avatar_initials,
        phone,
        is_verified
    ) VALUES (
        NEW.id,
        initial_name,
        NEW.email,
        initial_role,
        CASE
            WHEN initial_role = 'farmer' THEN 'Smallholder & Commercial Farmer'
            WHEN initial_role = 'agribusiness' THEN 'Agribusiness & Aggregator'
            WHEN initial_role = 'buyer' THEN 'Commodity Buyer & Miller'
            WHEN initial_role = 'logistics' THEN 'Logistics Fleet & Silo Operator'
            WHEN initial_role = 'finance' THEN 'Agri-Lender & Insurer'
            WHEN initial_role = 'government' THEN 'Ministry & Strategic Grain Reserve'
            WHEN initial_role = 'cooperative' THEN 'Farmer Cooperative Union'
            WHEN initial_role = 'researcher' THEN 'Agronomic Researcher & Extension'
            WHEN initial_role = 'input_supplier' THEN 'Seed & Fertilizer Manufacturer'
            ELSE 'System Administrator'
        END,
        initial_org,
        initial_country_code,
        initial_country_name,
        initials,
        NEW.phone,
        true
    ) ON CONFLICT (id) DO NOTHING;

    -- Initialize Data Sovereignty Consent Settings
    INSERT INTO public.user_consent_settings (
        user_id,
        share_with_financial_institutions,
        share_with_government_policy,
        share_with_marketplace_buyers,
        allow_satellite_ndvi_analysis,
        retention_months
    ) VALUES (
        NEW.id,
        true,
        true,
        true,
        true,
        60
    ) ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- -----------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Helper function: Check if current authenticated user has superadmin role
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
DECLARE
    r user_role;
BEGIN
    SELECT role INTO r FROM public.profiles WHERE id = auth.uid();
    RETURN r;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16.1 PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by all authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 16.2 USER CONSENT SETTINGS RLS
ALTER TABLE public.user_consent_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own consent settings"
ON public.user_consent_settings FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 16.3 FARMS & FIELD ZONES RLS
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own farms"
ON public.farms FOR ALL
TO authenticated
USING (auth.uid() = owner_id OR public.is_superadmin())
WITH CHECK (auth.uid() = owner_id OR public.is_superadmin());

CREATE POLICY "Authorized institutions view farms with consent"
ON public.farms FOR SELECT
TO authenticated
USING (
    auth.uid() = owner_id
    OR public.is_superadmin()
    OR (
        public.current_user_role() IN ('finance', 'government', 'agribusiness', 'cooperative')
        AND EXISTS (
            SELECT 1 FROM public.user_consent_settings c
            WHERE c.user_id = farms.owner_id
            AND (
                (public.current_user_role() = 'finance' AND c.share_with_financial_institutions)
                OR (public.current_user_role() = 'government' AND c.share_with_government_policy)
                OR (public.current_user_role() IN ('agribusiness', 'cooperative') AND c.share_with_marketplace_buyers)
            )
        )
    )
);

CREATE POLICY "Users manage field zones for their farms"
ON public.field_zones FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = field_zones.farm_id AND f.owner_id = auth.uid())
    OR public.is_superadmin()
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = field_zones.farm_id AND f.owner_id = auth.uid())
    OR public.is_superadmin()
);

-- 16.4 IOT SENSORS & TELEMETRY RLS
ALTER TABLE public.soil_sensor_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_telemetry_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farm owners and controllers view and configure sensor nodes"
ON public.soil_sensor_nodes FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = soil_sensor_nodes.farm_id AND f.owner_id = auth.uid())
    OR public.is_superadmin()
);

CREATE POLICY "Sensor telemetry readable by farm stakeholders"
ON public.sensor_telemetry_readings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.soil_sensor_nodes n
        JOIN public.farms f ON f.id = n.farm_id
        WHERE n.id = sensor_telemetry_readings.node_id
        AND (f.owner_id = auth.uid() OR public.is_superadmin())
    )
);

CREATE POLICY "Sensors can insert telemetry"
ON public.sensor_telemetry_readings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Farm alerts viewable by owner"
ON public.sensor_alerts FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = sensor_alerts.farm_id AND f.owner_id = auth.uid())
    OR public.is_superadmin()
);

-- 16.5 COMMODITY PRICES & MARKETPLACE RLS
ALTER TABLE public.commodity_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Commodity prices are publicly readable by authenticated users"
ON public.commodity_prices FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Market listings viewable by all authenticated users"
ON public.market_listings FOR SELECT
TO authenticated
USING (status = 'Active' OR seller_id = auth.uid() OR public.is_superadmin());

CREATE POLICY "Producers can create and manage their listings"
ON public.market_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Producers can update their own listings"
ON public.market_listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Contract parties view and manage purchase contracts"
ON public.purchase_contracts FOR ALL
TO authenticated
USING (
    auth.uid() = buyer_id
    OR auth.uid() = seller_id
    OR public.is_superadmin()
    OR public.current_user_role() IN ('finance', 'government', 'logistics')
);

-- 16.6 WAREHOUSES & e-WRS RLS
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewrs_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Warehouses readable by all authenticated users"
ON public.warehouses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Owners and financiers view e-WRS receipts"
ON public.ewrs_receipts FOR SELECT
TO authenticated
USING (
    owner_id = auth.uid()
    OR public.current_user_role() IN ('finance', 'superadmin')
);

CREATE POLICY "Owners can create e-WRS receipts"
ON public.ewrs_receipts FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- 16.7 FINANCING & LOANS RLS
ALTER TABLE public.financing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financing products are viewable by all users"
ON public.financing_products FOR SELECT
TO authenticated
USING (is_active = true OR public.is_superadmin());

CREATE POLICY "Applicants and financiers view loan applications"
ON public.loan_applications FOR SELECT
TO authenticated
USING (
    applicant_id = auth.uid()
    OR public.current_user_role() IN ('finance', 'superadmin')
);

CREATE POLICY "Applicants can submit loan applications"
ON public.loan_applications FOR INSERT
TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- 16.8 LOGISTICS ROUTES RLS
ALTER TABLE public.logistics_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logistics routes viewable by authenticated users"
ON public.logistics_routes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Logistics operators manage routes"
ON public.logistics_routes FOR ALL
TO authenticated
USING (public.current_user_role() IN ('logistics', 'superadmin'));

-- 16.9 COOPERATIVES RLS
ALTER TABLE public.cooperative_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperative_pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cooperative campaigns viewable by all members"
ON public.cooperative_campaigns FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Members view their own pledges"
ON public.cooperative_pledges FOR ALL
TO authenticated
USING (member_id = auth.uid() OR public.is_superadmin());

-- 16.10 AGRIBUSINESS INVENTORY RLS
ALTER TABLE public.agri_inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agribusiness managers control inventory"
ON public.agri_inventory_items FOR ALL
TO authenticated
USING (enterprise_id = auth.uid() OR public.is_superadmin());

-- 16.11 DIGITAL DOCUMENT VAULT RLS
ALTER TABLE public.farmer_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Document owners have full access"
ON public.farmer_documents FOR ALL
TO authenticated
USING (owner_id = auth.uid() OR public.is_superadmin());

CREATE POLICY "Shared parties view verified documents"
ON public.farmer_documents FOR SELECT
TO authenticated
USING (
    owner_id = auth.uid()
    OR public.is_superadmin()
    OR (public.current_user_role()::text = ANY(shared_with))
);

-- 16.12 NOTIFICATIONS & OFFLINE LOGS RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_role_sync_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view only their own notifications"
ON public.notifications FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Sync mesh events readable by all authenticated users"
ON public.cross_role_sync_events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users access their own offline activity logs"
ON public.offline_activity_logs FOR ALL
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL OR public.is_superadmin());

-- -----------------------------------------------------------------------------
-- 17. INITIAL SEED DATA (CORE MARKETS, WAREHOUSES & FACILITIES)
-- -----------------------------------------------------------------------------

-- Seed Wholesale Commodity Prices across African Exchanges
INSERT INTO public.commodity_prices (commodity, country, city_market, price_per_tonne, currency, price_usd, daily_change_pct, trend_30day, volume_traded_tonnes, quality_grade)
VALUES
    ('White Maize', 'South Africa', 'SAFEX Johannesburg', 5420, 'ZAR', 298.0, 1.8, 6.4, 14200, 'Grade 1 (Export)'),
    ('White Maize', 'Kenya', 'Nairobi / Nakuru Silo', 36400, 'KES', 280.0, 1.2, 4.8, 6800, 'Grade 1 (Export)'),
    ('Grade 1 Arabica Coffee', 'Ethiopia', 'ECX Addis Ababa', 4650, 'USD', 4650.0, 2.4, 8.9, 1850, 'Grade 1 (Export)'),
    ('Raw Cocoa Beans', 'Ghana', 'AFEX West Africa', 7800, 'USD', 7800.0, 5.1, 14.2, 24500, 'Certified Fair Trade'),
    ('Soybeans (Non-GMO)', 'Zambia', 'ZAMACE Lusaka', 7200, 'ZMW', 315.0, 0.8, 3.2, 8400, 'Grade 1 (Protein 38%)'),
    ('Cleaned Sesame Seeds', 'Nigeria', 'Dawanau Grain Market', 2450000, 'NGN', 1650.0, -0.6, 11.4, 3200, 'Premium White Humera')
ON CONFLICT DO NOTHING;

-- Seed Accredited Warehouses & Silo Hubs
INSERT INTO public.warehouses (name, city, country, total_capacity_tonnes, utilized_tonnes, commodities_stored, certified_receipt_enabled, latitude, longitude)
VALUES
    ('Nakuru Central Grain Silos', 'Nakuru', 'Kenya', 45000, 31200, '[{"commodity": "White Maize", "tonnes": 24000}, {"commodity": "Sorghum", "tonnes": 7200}]'::jsonb, true, -0.3031, 36.0800),
    ('Zambezi Commercial Silo #04', 'Lusaka', 'Zambia', 60000, 48500, '[{"commodity": "Yellow Maize", "tonnes": 38000}, {"commodity": "Soybeans", "tonnes": 10500}]'::jsonb, true, -15.4167, 28.2833),
    ('Highveld Agro Silo Depot', 'Kroonstad', 'South Africa', 85000, 64000, '[{"commodity": "Yellow Maize", "tonnes": 48000}, {"commodity": "Wheat", "tonnes": 16000}]'::jsonb, true, -27.6504, 27.2349),
    ('Port of Lobito Atlantic Deep-Water Silo Terminal', 'Lobito', 'Angola', 120000, 84000, '[{"commodity": "Soybeans", "tonnes": 44000}, {"commodity": "Fertilizer (DAP/Urea)", "tonnes": 40000}]'::jsonb, true, -12.3500, 13.5500)
ON CONFLICT DO NOTHING;

-- Seed Institutional Agri-Finance Products
INSERT INTO public.financing_products (product_code, name, type, provider, max_amount, interest_rate_annual, tenure_months, eligibility_criteria, features)
VALUES
    ('FIN-INPUT-01', 'Precision Input & Fertilizer Credit', 'Input Financing', 'AfriAgri Development Bank', '$35,000 / KSh 4,500,000', '8.5%', 6, '["Verified farm boundary polygon on CULTx Digital Twin", "Historical NDVI score above 0.65", "Minimum 10 hectares"]'::jsonb, '["Direct disbursement to certified input suppliers (Yara, OCP)", "Zero cash handling fee", "Repayment deferred until post-harvest aggregation"]'::jsonb),
    ('FIN-EWRS-02', 'Electronic Warehouse Receipt (e-WRS) Advance', 'Inventory Finance', 'Ecobank Agri-Finance Division', '70% of certified stored grain market value', '9.2%', 4, '["Certified grain receipt deposited at accredited warehouse", "Moisture content certified below 13.0%", "Commodity price floor hedged on SAFEX / ECX"]'::jsonb, '["Instant 24-hour payout upon warehouse weighbridge scan", "No physical land collateral required", "Automated liquidity settlement upon buyer contract close"]'::jsonb),
    ('FIN-SOLAR-03', 'Smart Solar Irrigation & IoT Capital Lease', 'Equipment Finance', 'African Development Bank (AfDB) Green Agri Facility', '$75,000 / R1,380,000', '6.8%', 36, '["Registered commercial smallholder or estate", "Surface water abstraction permit", "Sensors integrated into CULTx telemetry"]'::jsonb, '["Includes solar pump, sub-surface drip lines, and LoRaWAN soil probes", "Carbon credit generation offset rebates", "Machinery breakdown insurance included"]'::jsonb)
ON CONFLICT (product_code) DO NOTHING;

-- Seed Pan-African Multimodal Logistics Corridors
INSERT INTO public.logistics_routes (tracking_number, carrier, origin, destination, cargo, volume_tonnes, vehicle_plate, corridor_name, transit_mode, status, eta_hours, temperature_controlled, latitude, longitude)
VALUES
    ('CORR-LOB-5520', 'Lobito Atlantic Railway (LAR)', 'Ndola Agri-Silo (Copperbelt, Zambia)', 'Port of Lobito Atlantic Deep-Water Terminal (Angola)', 'Non-GMO Soybeans (HS 1201.90)', 540.0, 'RAIL TRK-AO-5520', 'Lobito Trans-African Rail Corridor', 'Rail Express', 'In Transit', 32, false, -12.4, 19.8),
    ('CORR-KE-04412', 'East African Cold Chain Express', 'Nakuru Highland Orchards (Kenya)', 'Mombasa Kilindini Port (Reefer Berth 16)', 'Hass Avocado & Fresh Horticulture', 26.0, 'TRK-KE-4412 (Reefer)', 'Northern Corridor Expressway', 'Road Freight', 'In Transit', 8, true, -1.8, 37.6),
    ('CORR-ZA-08910', 'Trans-Kalahari Express Logistics', 'Highveld Silos (Kroonstad, South Africa)', 'Durban Agri-Port Container Terminal', 'Grade 1 Yellow Maize (Bulk)', 34.0, 'TRK-ZA-8910', 'N3 Durban High-Speed Freight Corridor', 'Road Freight', 'In Transit', 5, false, -28.5, 28.2)
ON CONFLICT (tracking_number) DO NOTHING;

-- Seed Collective Procurement Campaigns
INSERT INTO public.cooperative_campaigns (title, provider, current_tonnage, target_tonnage, discount_pct, individual_price, group_price, unit, deadline_days)
VALUES
    ('Consolidated Urea 46% N & NPK 10-20-10 Pool', 'Omnia Fertilizer Africa', 1240.0, 1500.0, 14, 12400.0, 10664.0, 'MT', 4),
    ('Certified Drought-Tolerant Hybrid Maize Seed (SC719)', 'Seed Co West & Southern Africa', 85.0, 100.0, 11, 940.0, 836.0, '25kg Bag', 7)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- END OF CULTx SUPABASE PRODUCTION SCHEMA
-- =============================================================================
