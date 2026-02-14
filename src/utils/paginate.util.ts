export const paginate = (
  query: { page?: string; pageSize?: string; limit?: string },
  defaultPage: number = 1,
  defaultPageSize: number = 10
): { limit: number; offset: number; page: number } => {
  const page = parseInt(query.page ?? defaultPage.toString(), 10);

  // prefer "limit" over "pageSize"
  const pageSize = parseInt(
    query.limit ?? query.pageSize ?? defaultPageSize.toString(),
    10
  );

  if (isNaN(page) || page <= 0) throw new Error("Invalid page number");
  if (isNaN(pageSize) || pageSize <= 0) throw new Error("Invalid page size/limit");

  const offset = (page - 1) * pageSize;

  return { limit: pageSize, offset, page };
};
