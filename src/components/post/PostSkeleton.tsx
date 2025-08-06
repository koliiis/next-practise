export function PostSkeleton() {
  return (
    <div className="mt-4 relative bg-neutral-800 text-white rounded-xl p-4 max-w-2xl mx-auto border border-neutral-700 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-700" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-24 bg-neutral-700 rounded" />
            <div className="h-3 w-16 bg-neutral-700 rounded" />
          </div>

          <div className="h-5 w-1/2 bg-neutral-700 rounded mb-2" />

          <div className="space-y-1">
            <div className="h-3 w-30 bg-neutral-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
