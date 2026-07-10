
-- Tighten order_items insert: order must belong to the caller
DROP POLICY IF EXISTS "Users insert own order items" ON public.order_items;
CREATE POLICY "Users insert own order items" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

-- Payment options: hide config from the public. Admins only.
DROP POLICY IF EXISTS "Anyone reads payment options" ON public.payment_options;
CREATE POLICY "Admins read payment options" ON public.payment_options
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));
REVOKE SELECT ON public.payment_options FROM anon;
