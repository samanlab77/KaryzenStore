import { useState } from "react";
import { Users, Shield, Ban, CheckCircle2 } from "lucide-react";
import { userProfiles } from "@/lib/data/dummy";
import { formatShortDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const roleConfig = {
  customer: { label: "Customer", class: "badge-muted" },
  staff: { label: "Staff", class: "badge-info" },
  superadmin: { label: "Superadmin", class: "badge-warning" },
};

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState(userProfiles);
  const isSuperadmin = user?.role === "superadmin";

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: newRole as "customer" | "staff" | "superadmin" }
          : u
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text mb-1">
          Kelola Pengguna
        </h1>
        <p className="text-text-secondary text-sm">
          {users.length} pengguna terdaftar
        </p>
        {!isSuperadmin && (
          <p className="text-xs text-info mt-2">
            Hanya superadmin yang dapat mengubah peran pengguna.
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Terdaftar
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Peran
                </th>
                {isSuperadmin && (
                  <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const rc = roleConfig[u.role];
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-9 h-9 rounded-full bg-white/10"
                        />
                        <div>
                          <p className="font-medium text-text text-xs">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-text-secondary sm:hidden">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden sm:table-cell">
                      {u.email}
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden md:table-cell">
                      {formatShortDate(u.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      {isSuperadmin && u.id !== user?.id ? (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                          className={cn(
                            "text-[10px] font-medium bg-transparent border border-white/10 rounded-lg px-2 py-1 appearance-none cursor-pointer",
                            rc.class
                          )}
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      ) : (
                        <span className={cn("text-[10px]", rc.class)}>
                          {rc.label}
                        </span>
                      )}
                    </td>
                    {isSuperadmin && (
                      <td className="px-5 py-3">
                        {u.id !== user?.id && (
                          <button className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors">
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
