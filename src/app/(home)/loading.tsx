export default function Loading() {
  return (
    <main className="container mx-auto py-4 md:py-6 space-y-4 px-3 md:px-0">
      <div className="rounded-lg shadow-md border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 bg-white">
        <div className="p-3 md:p-4 space-y-4 md:space-y-6 animate-pulse">

          {/* SKELETON: TOP BAR */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="h-9 md:h-10 w-full bg-slate-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-9 md:h-10 w-10 md:w-12 bg-slate-200 dark:bg-neutral-800 rounded-md shrink-0" />
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="h-9 md:h-10 w-24 md:w-28 bg-slate-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-9 md:h-10 flex-1 md:w-32 bg-slate-200 dark:bg-neutral-800 rounded-md" />
            </div>
          </div>

          {/* SKELETON: FILTERS ROW */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Checkboxes (folder filters) */}
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-slate-200 dark:bg-neutral-800 rounded" />
                  <div className="w-12 md:w-16 h-3.5 md:h-4 bg-slate-200 dark:bg-neutral-800 rounded" />
                </div>
              ))}
            </div>

            {/* Sort/Filter selects + Total count skeleton */}
            <div className="flex items-center gap-2">
              {/* Total count skeleton */}
              <div className="flex flex-col mr-1">
                <div className="h-2.5 w-8 bg-slate-200 dark:bg-neutral-800 rounded mb-1" />
                <div className="h-5 w-6 bg-slate-200 dark:bg-neutral-800 rounded" />
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800 mx-1" />
              <div className="h-8 md:h-9 w-[120px] md:w-[150px] bg-slate-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-8 md:h-9 w-[120px] md:w-[150px] bg-slate-200 dark:bg-neutral-800 rounded-md" />
              <div className="flex gap-1 border p-1 rounded-md border-slate-200 dark:border-neutral-800">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-slate-200 dark:bg-neutral-800 rounded-sm" />
                <div className="w-6 h-6 md:w-7 md:h-7 bg-slate-200 dark:bg-neutral-800 rounded-sm" />
              </div>
            </div>
          </div>

          {/* SKELETON: TABLE (Desktop) */}
          <div className="rounded-md border border-slate-200 dark:border-neutral-800 overflow-hidden hidden md:block">
            {/* Header */}
            <div className="h-11 bg-slate-100 dark:bg-neutral-800/50 border-b border-slate-200 dark:border-neutral-800 px-4 flex items-center gap-4">
              <div className="w-8 h-4 bg-slate-200 dark:bg-neutral-700 rounded" />
              <div className="w-20 h-4 bg-slate-200 dark:bg-neutral-700 rounded" />
              <div className="w-32 h-4 bg-slate-200 dark:bg-neutral-700 rounded" />
              <div className="w-16 h-4 bg-slate-200 dark:bg-neutral-700 rounded ml-auto" />
              <div className="w-20 h-4 bg-slate-200 dark:bg-neutral-700 rounded" />
              <div className="w-16 h-4 bg-slate-200 dark:bg-neutral-700 rounded" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 flex items-center px-4 border-b border-slate-200 dark:border-neutral-800 gap-4">
                <div className="w-6 h-4 bg-slate-200 dark:bg-neutral-800 rounded shrink-0" />
                <div className="w-16 h-16 bg-slate-200 dark:bg-neutral-800 rounded-md shrink-0" />
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-neutral-800 rounded-md" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-neutral-800 rounded-md ml-auto" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-neutral-800 rounded-full" />
                <div className="h-4 w-28 bg-slate-200 dark:bg-neutral-800 rounded-md" />
                <div className="h-8 w-16 bg-slate-200 dark:bg-neutral-800 rounded-md shrink-0" />
              </div>
            ))}
          </div>

          {/* SKELETON: CARDS (Mobile) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col gap-3">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-slate-200 dark:bg-neutral-800 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-full bg-slate-200 dark:bg-neutral-800 rounded-md" />
                    <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-neutral-800 rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-5 w-14 bg-slate-200 dark:bg-neutral-800 rounded-full" />
                      <div className="h-5 w-10 bg-slate-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Bottom action row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-neutral-800 rounded" />
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-slate-200 dark:bg-neutral-800 rounded-full" />
                    <div className="w-7 h-7 bg-slate-200 dark:bg-neutral-800 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
