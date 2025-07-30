'use client';

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] mr-auto">
        <div className="message-bubble ai">
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatroomSkeleton() {
  return (
    <div className="p-3 space-y-2">
      <LoadingSkeleton className="h-4 w-2/3" />
      <LoadingSkeleton className="h-3 w-1/3" />
    </div>
  );
} 