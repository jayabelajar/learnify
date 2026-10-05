import { notifications } from '../../../data/users';
import { FloatingPanel } from '../FloatingPanel';

export function NotificationsPanel() {
  return (
    <FloatingPanel className="right-3 top-16 w-[min(360px,calc(100vw-24px))]">
      <p className="mb-3 font-bold">Notifications</p>
      <div className="space-y-2">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold">{item.title}</p>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>
    </FloatingPanel>
  );
}
