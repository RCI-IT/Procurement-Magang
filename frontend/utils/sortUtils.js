export const sortData = (data, config) => {
    if (!config.key) return data;
  
    return [...data].sort((a, b) => {
      let aVal = a[config.key];
      let bVal = b[config.key];
  
      if (config.key === 'tanggal') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
  
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
  
      if (aVal < bVal) return config.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };
  