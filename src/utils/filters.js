const getActiveFilter = (query) => {
  const { year, month, range } = query;
  let where = "";
  const params = [];

  if (range) {
    const now = new Date();
    const past = new Date();
    let isValidRange = true;

    switch (range) {
      case 'day':
        past.setDate(now.getDate() - 1);
        break;
      case 'week':
        past.setDate(now.getDate() - 7);
        break;
      case 'month':
        past.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        past.setFullYear(now.getFullYear() - 1);
        break;
      default:
        isValidRange = false;
    }

    if (isValidRange) {
      where = "played_at >= ?";
      params.push(Math.floor(past.getTime() / 1000));
      return { where, params };
    }
  }

  const cleanYear = year ? String(year).split('?')[0] : null;
  const cleanMonth = month ? String(month).split('?')[0] : null;

  if (cleanYear) {
    where += "strftime('%Y', played_at, 'unixepoch') = ?";
    params.push(cleanYear);
  }

  if (cleanMonth) {
    if (where) where += " AND ";
    where += "strftime('%m', played_at, 'unixepoch') = ?";
    params.push(cleanMonth.padStart(2, "0"));
  }

  return { where: where || null, params };
};

module.exports = { getActiveFilter };