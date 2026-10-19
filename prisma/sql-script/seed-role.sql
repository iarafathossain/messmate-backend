INSERT INTO roles (id, name, "createdAt")
VALUES
    (gen_random_uuid(), 'MESS', NOW()),
    (gen_random_uuid(), 'MEMBER', NOW())
ON CONFLICT (name) DO NOTHING;