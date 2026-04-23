export default function Toast({ notification }) {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 slide-in px-4 py-2.5 rounded-lg border text-xs font-mono ${
        notification.type === "success"
          ? "bg-emerald-900/80 border-emerald-500/40 text-emerald-300"
          : notification.type === "error"
          ? "bg-red-900/80 border-red-500/40 text-red-300"
          : "bg-sky-900/80 border-sky-500/40 text-sky-300"
      }`}
    >
      {notification.msg}
    </div>
  );
}
