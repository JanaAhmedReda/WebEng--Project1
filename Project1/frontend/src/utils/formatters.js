export const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  return new Date(dateString).toLocaleString();
};

export const formatAge = (age, ageUnit) => {
  if (age === null || age === undefined || age === '') {
    return 'N/A';
  }

  const numericAge = Number(age);
  if (Number.isNaN(numericAge)) {
    return 'N/A';
  }

  const normalizedUnit = (ageUnit || 'Years').toLowerCase();
  const singularMap = {
    years: 'year',
    months: 'month',
    weeks: 'week',
  };

  const unitLabel = numericAge === 1 ? singularMap[normalizedUnit] || normalizedUnit : normalizedUnit;
  return `${numericAge} ${unitLabel}`;
};