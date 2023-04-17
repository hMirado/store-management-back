const model = require("../models/index");

export const getPagination = (page: any, size?: number) => {
  let limit = size ? size : 3;
  let offset = (page && page > 0) ? +page * limit : 0;
  //offset = 4
  
  return { limit, offset };
}

export const getPagingData = (data: any, page: any, limit: number) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +(page) + 1 : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};