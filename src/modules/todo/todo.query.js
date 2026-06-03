const buildTodoQuery = (query) => {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.horizonType) {
    filters.horizonType = query.horizonType;
  }

  if (query.startDate || query.endDate) {
    filters.createdAt = {};

    if (query.startDate) {
      filters.createdAt.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.createdAt.$lte = new Date(query.endDate);
    }
  }

  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  return filters;
};

export { buildTodoQuery };
