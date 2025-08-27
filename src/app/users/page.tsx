"use client";

import UsersTable from "@/components/users/UsersTable";
import AuthChecker from "@/components/AuthChecker";

export default function UsersPage() {
  return (
    <AuthChecker>
      <div className="container mx-auto p-3 h-[81vh] ">
        <UsersTable />
      </div>
    </AuthChecker>
  );
}
