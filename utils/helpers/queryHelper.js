/* ================= QUERY HELPER ================= */
export const buildQuery = (queryParams, allowedFilters = []) => {
  const query = {};

  allowedFilters.forEach((field) => {
    if (queryParams[field]) {
      // Multiple values support: genre=Action,Comedy
      if (queryParams[field].includes(",")) {
        query[field] = { $in: queryParams[field].split(",") };
      } else {
        query[field] = queryParams[field];
      }
    }
  });

  // Range filters
  if (queryParams.minRating || queryParams.maxRating) {
    query["stats.rating"] = {};
    if (queryParams.minRating)
      query["stats.rating"].$gte = Number(queryParams.minRating);
    if (queryParams.maxRating)
      query["stats.rating"].$lte = Number(queryParams.maxRating);
  }

  if (queryParams.minYear || queryParams.maxYear) {
    query.releaseYear = {};
    if (queryParams.minYear)
      query.releaseYear.$gte = Number(queryParams.minYear);
    if (queryParams.maxYear)
      query.releaseYear.$lte = Number(queryParams.maxYear);
  }

  // Full-text search
  if (queryParams.search) {
    query.$text = { $search: queryParams.search };
  }

  return query;
};

export const buildOptions = (queryParams) => {
  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.min(100, parseInt(queryParams.limit) || 10); // max 100
  const skip = (page - 1) * limit;

  const sort = {};
  if (queryParams.sortBy) {
    const parts = queryParams.sortBy.split(":"); // sortBy=releaseYear:desc
    const field = parts[0];
    const order = parts[1] === "desc" ? -1 : 1;
    sort[field] = order;
  } else {
    sort.createdAt = -1;
  }

  const projection = {};
  if (queryParams.fields) {
    queryParams.fields.split(",").forEach((f) => (projection[f] = 1));
  }

  return { page, limit, skip, sort, projection };
};
