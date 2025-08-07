import { Heart, MessageCircle } from "lucide-react";

export function FullPostSkeleton() {
  return (
    <div className="bg-neutral-900 rounded-2xl text-white animate-pulse">
      <div className="flex justify-between mb-8 items-center">
        <div className="w-8 h-8 rounded-full bg-neutral-700" />
        <div className="h-6 w-40 bg-neutral-700 rounded" />
        <div className="w-6 h-6 rounded-full bg-neutral-700" />
      </div>

      <div className="flex items-start gap-3 ml-2">
        <div className="w-10 h-10 rounded-full bg-neutral-700" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-24 bg-neutral-700 rounded" />
            <div className="h-3 w-16 bg-neutral-700 rounded" />
          </div>

          <div className="h-6 w-3/4 bg-neutral-700 rounded mb-2" />
          <div className="h-6 w-2/3 bg-neutral-700 rounded mb-2" />
          <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4" />
        </div>

        <div className="flex gap-4 ml-12 mr-4">
          <div className="flex items-center gap-2">
            <Heart color="#404040" />
            <div className="h-3 w-4 bg-neutral-700 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle color="#404040" />
            <div className="h-3 w-4 bg-neutral-700 rounded" />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="h-6 w-32 bg-neutral-700 rounded mb-6" />

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-neutral-800 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-neutral-700" />
                <div className="h-4 w-24 bg-neutral-700 rounded" />
              </div>
              <div className="h-4 w-full bg-neutral-700 rounded mb-1" />
              <div className="h-4 w-3/4 bg-neutral-700 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
