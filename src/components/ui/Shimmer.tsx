export function Shimmer({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-md bg-line/70 ${className}`} />;
}