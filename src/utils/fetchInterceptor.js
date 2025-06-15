export const setupFetchInterceptor = (triggerSessionExpired) => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        triggerSessionExpired(); // Muestra el modal
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
};

