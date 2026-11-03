/** Load the next batch once the viewport nears the end of the loaded rows. */
export function shouldLoadTableBatch({
  visibleEnd,
  rowCount,
  loading,
  hasMore,
  error,
}: {
  visibleEnd: number;
  rowCount: number;
  loading: boolean;
  hasMore: boolean;
  error: string | null;
}): boolean {
  return rowCount > 0 && visibleEnd >= rowCount - 20 && !loading && hasMore && !error;
}

/** Whether "next page" is allowed while the total row count is still unknown or estimated. */
export function canAdvanceFastPage(
  page: number,
  pageSize: number,
  recordCount: number,
  totalCount: number | null,
): boolean {
  return totalCount === null
    ? recordCount === pageSize
    : (page + 1) * pageSize < totalCount;
}
