import { Trash2 } from 'lucide-react';
import type { UserProfile } from '../../types';
import { Badge } from '../../components/common/Badge';
import { IconButton } from '../../components/common/IconButton';
import { Panel } from '../../components/common/Panel';

type AdminUsersProps = {
  users: UserProfile[];
  onUsers: (users: UserProfile[]) => void;
};

export function AdminUsers({ users, onUsers }: AdminUsersProps) {
  return (
    <Panel title="User Management">
      <div className="grid gap-3">
        {users.map((user) => (
          <div key={user.email} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center">
            <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt={user.name} />
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <Badge tone={user.role === 'admin' ? 'indigo' : user.role === 'instructor' ? 'green' : 'gray'}>{user.role}</Badge>
            <IconButton label="Remove" icon={Trash2} danger onClick={() => onUsers(users.filter((item) => item.email !== user.email))} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
