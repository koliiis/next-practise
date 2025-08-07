export function CommentSkeleton() {
  return (
    <div className="bg-neutral-800 p-4 rounded animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
        <div className="h-4 bg-neutral-700 rounded w-32"></div>
      </div>
      <div className="h-3 bg-neutral-700 rounded w-full"></div>
      <div className="h-3 bg-neutral-700 rounded w-5/6"></div>
    </div>
  );
}