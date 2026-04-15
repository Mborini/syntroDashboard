
export const getReports = async () => {
  try {
    const response = await fetch('/api/upload-report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch reports');
    }

    const data = await response.json();
    return data; // ستعود المصفوفة بتنسيق: { plateNumber, organization, totalAlerts, ... }
  } catch (error) {
    console.error("Error in getReports service:", error);
    throw error;
  }
};

export const uploadReport = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-report', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload');
  }

  return response.json();
};

export const deleteReportBySlug = async (plate: string, date: string) => {
  // تأكد من تنسيق التاريخ ليكون YYYY-MM-DD
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const slug = `${plate}_${formattedDate}`;

  const response = await fetch(`/api/upload-report/${slug}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete');
  }
  return await response.json();
};