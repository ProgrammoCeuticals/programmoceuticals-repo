export default function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
      {status.toUpperCase()}
    </span>
  );
}
