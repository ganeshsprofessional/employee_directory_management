CREATE TABLE IF NOT EXISTS roles (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('hr') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('employee') ON CONFLICT DO NOTHING;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role_id integer REFERENCES roles(id) NOT NULL,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS departments (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  first_name text NOT NULL,
  last_name text,
  full_name text NOT NULL,
  email text,
  phone text,
  department_id integer REFERENCES departments(id),
  designation text,
  date_of_birth date,
  date_of_joining date,
  gender text,
  address text,
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_employee_full_name() RETURNS trigger AS $$
BEGIN
  NEW.full_name := concat_ws(' ', NEW.first_name, NEW.last_name);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_employee_full_name ON employees;
CREATE TRIGGER trg_employee_full_name
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION set_employee_full_name();

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_employees_full_name_trgm ON employees USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_employees_email_trgm ON employees USING gin (email gin_trgm_ops);
