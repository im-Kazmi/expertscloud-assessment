import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/design-system/components/ui/card";

export default function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col bg-muted/20 border border-dashed shadow-sm hover:shadow-none cursor-pointer rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <CardHeader className="p-4 md:p-5">
        <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton-shimmer mb-4 dark:from-neutral-700 dark:to-neutral-600 shadow-inner" />
        <div className="space-y-2">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton-shimmer dark:from-neutral-700 dark:to-neutral-600 shadow-inner "
              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
            />
          ))}
        </div>
        <div className="mt-3 h-4 w-1/3 bg-gradient-to-r from-green-200 to-green-300 rounded skeleton-shimmer dark:from-green-700 dark:to-green-600 shadow-inner" />
      </CardHeader>
      <CardFooter className="bg-muted border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton-shimmer dark:from-neutral-700 dark:to-neutral-600  shadow-inner" />
      </CardFooter>
    </Card>
  );
}
