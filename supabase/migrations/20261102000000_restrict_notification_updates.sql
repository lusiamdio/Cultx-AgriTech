-- Recipients can acknowledge notifications, but cannot rewrite their content or ownership.
revoke update on public.notifications from public, anon, authenticated;
grant update (read) on public.notifications to authenticated;
