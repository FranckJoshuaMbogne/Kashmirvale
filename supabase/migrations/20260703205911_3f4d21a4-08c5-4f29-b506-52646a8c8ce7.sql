
-- ROLES
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin'))
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  destination_preferences text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AUTO PROFILE + ROLE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email, NEW.raw_user_meta_data ->> 'phone');

  IF lower(NEW.email) = 'super@admin.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  ELSIF lower(NEW.email) = 'admin@kashmirvale.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SITE CONFIG (single-row key/value style)
CREATE TABLE public.site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads config" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage config" ON public.site_config FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
INSERT INTO public.site_config (key, value) VALUES
  ('social_links', '{"instagram":"","facebook":"","twitter":"","youtube":""}'::jsonb),
  ('payment_settings', '{"stripe_enabled":true,"paypal_enabled":true,"upi_enabled":false}'::jsonb);

-- DESTINATIONS
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  image_url text,
  video_url text,
  advantages text[],
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT ALL ON public.destinations TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.destinations TO authenticated;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads destinations" ON public.destinations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage destinations" ON public.destinations FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SHOP ITEMS
CREATE TABLE public.shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  price integer NOT NULL DEFAULT 0,
  image_url text,
  category text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shop_items TO anon, authenticated;
GRANT ALL ON public.shop_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.shop_items TO authenticated;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads shop items" ON public.shop_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage shop items" ON public.shop_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- PAYMENT OPTIONS
CREATE TABLE public.payment_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_options TO anon, authenticated;
GRANT ALL ON public.payment_options TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.payment_options TO authenticated;
ALTER TABLE public.payment_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads payment options" ON public.payment_options FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Super admin manage payment options" ON public.payment_options FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
INSERT INTO public.payment_options (name, provider, enabled) VALUES
  ('Stripe (Cards)', 'stripe', true),
  ('PayPal', 'paypal', true);

-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  contact_email text,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own orders" ON public.orders FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all orders" ON public.orders FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- TRIP REQUESTS
CREATE TABLE public.trip_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_requests TO authenticated;
GRANT ALL ON public.trip_requests TO service_role;
ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own trip requests" ON public.trip_requests FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all trip requests" ON public.trip_requests FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update trip requests" ON public.trip_requests FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
