# Political Quiz (Next.js + Vercel + Supabase)

A production-ready, Vercel-deployable political quiz app with:

- 20 total questions (10 economic + 10 social)
- 7-point answer scale (`-3..+3` with reverse scoring support)
- Two-axis result output:
  - Economic: Left / Mixed / Right
  - Social: Progressive / Mixed / Traditional
- Compass visualization
- Serverless submission API with Supabase analytics + 24h cooldown by salted IP hash

## Tech stack

- Next.js (App Router)
- TypeScript
- Supabase (analytics storage)
- Vercel serverless route (`/api/submit`)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. In **Project Settings → Environment Variables**, set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `IP_HASH_SALT`
4. Deploy.

No additional Vercel config is required.

## Required Supabase table

The app expects this table:

```sql
create table if not exists attempts(
  id bigserial primary key,
  created_at timestamptz default now(),
  ip_hash text not null,
  ip_country text,
  user_agent text,
  econ_score int not null,
  soc_score int not null,
  quiz_version text default 'v1'
);
```

## Environment variables (server-side only)

These are consumed only in `app/api/submit/route.ts`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IP_HASH_SALT`

Do **not** expose them via `NEXT_PUBLIC_`.

## How question scoring works

Questions are defined in `lib/questions.ts`.

Each question has:

- `axis`: `"econ"` or `"social"`
- `text`: prompt text
- optional `reverse: true` to reverse-score (`+3` becomes `-3`, etc.)

Answers use a 7-point fixed scale:

- Strongly disagree = `-3`
- Disagree = `-2`
- Somewhat disagree = `-1`
- Neutral = `0`
- Somewhat agree = `+1`
- Agree = `+2`
- Strongly agree = `+3`

## How to edit questions

Edit `lib/questions.ts`:

1. Modify the `QUESTIONS` array.
2. Keep exactly 20 total items.
3. Keep 10 with `axis: "econ"` and 10 with `axis: "social"`.
4. Add/remove `reverse: true` per question as needed.

## Analytics and cooldown behavior

When the user submits, the frontend sends:

```json
{ "econScore": 0, "socScore": 0, "quizVersion": "v1" }
```

The API route `/api/submit`:

1. Reads IP from request headers.
2. Hashes IP with SHA-256 using `IP_HASH_SALT`.
3. Checks `attempts` for same `ip_hash` in the last 24 hours.
4. Returns HTTP `429` if a recent attempt exists.
5. Inserts allowed attempts into Supabase.

Stored fields: `ip_hash`, `ip_country`, `user_agent`, `econ_score`, `soc_score`, `quiz_version`.

## Viewing analytics in Supabase

In Supabase SQL editor, examples:

```sql
-- Total attempts
select count(*) from attempts;

-- Attempts by country
select ip_country, count(*)
from attempts
group by ip_country
order by count(*) desc;

-- Average axis scores
select avg(econ_score) as avg_econ, avg(soc_score) as avg_soc
from attempts;

-- Latest attempts
select created_at, ip_country, econ_score, soc_score, quiz_version
from attempts
order by created_at desc
limit 100;
```
