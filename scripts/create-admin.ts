import { createClient } from "@supabase/supabase-js";

const url = process.env["SUPABASE_URL"];
const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const email = "gamaoutlet1@gmail.com";
const password = "@Godbless1";

const supabaseAdmin = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "Administrador" },
  });

  if (error) {
    console.error("Create user failed:", error.message);
    process.exit(1);
  }

  const userId = data.user?.id;
  if (!userId) {
    console.error("No user id returned");
    process.exit(1);
  }

  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });

  if (roleError) {
    console.error("Role assignment failed:", roleError.message);
    process.exit(1);
  }

  console.log("Admin user created:", userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
