begin;

do $$
begin
  if exists (select from booking_private.driver) or exists (select from booking_private.driver_tester) then
    raise exception 'Run this test on an unassigned local stack';
  end if;
end;
$$;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000101', 'work-hours-driver@example.test'),
  ('00000000-0000-0000-0000-000000000102', 'work-hours-tester@example.test'),
  ('00000000-0000-0000-0000-000000000103', 'work-hours-other@example.test');
insert into booking_private.driver (user_id) values ('00000000-0000-0000-0000-000000000101');
insert into booking_private.driver_tester (user_id) values ('00000000-0000-0000-0000-000000000102');

set local role anon;
do $$
begin
  begin
    perform public.get_work_hours();
    raise exception 'anon could read working hours';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_work_hours(0, '[null,null,null,null,null,null,null]');
    raise exception 'anon could write working hours';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000103';
do $$
begin
  begin
    perform public.get_work_hours();
    raise exception 'another account could read working hours';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_work_hours(0, '[null,null,null,null,null,null,null]');
    raise exception 'another account could write working hours';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000101';
do $$
declare
  regular jsonb := '[["09:00","17:00"],null,null,null,null,null,["22:00","02:00"]]';
  off_week jsonb := '[null,null,null,null,null,null,null]';
  invalid jsonb;
begin
  assert public.get_work_hours() = '{"revision":0,"hours":null}'::jsonb;
  foreach invalid in array array['[]'::jsonb, '{"bad":true}'::jsonb,
      '[["09:00","09:00"],null,null,null,null,null,null]'::jsonb,
      '[["24:00","03:00"],null,null,null,null,null,null]'::jsonb] loop
    begin
      perform public.save_work_hours(0, invalid);
      raise exception 'invalid working hours accepted';
    exception when invalid_parameter_value then null;
    end;
  end loop;
  assert public.save_work_hours(0, regular) = jsonb_build_object('revision', 1, 'hours', regular);
  assert public.save_work_hours(0, regular) = jsonb_build_object('revision', 1, 'hours', regular);
  begin
    perform public.save_work_hours(0, off_week);
    raise exception 'stale save overwrote the newer schedule';
  exception when sqlstate 'PT409' then null;
  end;
  begin
    perform 1 from booking_private.work_hours;
    raise exception 'driver could bypass RPC permissions';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000102';
do $$
begin
  assert public.get_work_hours()->>'revision' = '1';
  assert public.save_work_hours(1, '[null,null,null,null,null,null,null]')->>'revision' = '2';
end;
$$;

rollback;
