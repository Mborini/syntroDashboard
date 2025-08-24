import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@mantine/core";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns = 3, rows = 5 }: TableSkeletonProps) {
  return (
    <>
      <Button color="gray" size="md" variant="light"></Button>
      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-5.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-[#eee] dark:border-dark-3"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
