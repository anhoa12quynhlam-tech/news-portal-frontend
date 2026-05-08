import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import LoadingCard from "@/components/LoadingCard";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
