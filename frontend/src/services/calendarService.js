const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getToken = () => {
  return localStorage.getItem("token");
};

// ========================================
// RÉCUPÉRER LES ÉVÉNEMENTS
// ========================================

export const getCalendarEvents = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/calendar`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de récupérer les événements."
    );
  }

  return data.events || [];
};

// ========================================
// CRÉER UN ÉVÉNEMENT
// ========================================

export const createCalendarEvent = async (
  eventData
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/calendar`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(eventData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de créer l'événement."
    );
  }

  return data.event;
};

// ========================================
// MODIFIER UN ÉVÉNEMENT
// ========================================

export const updateCalendarEvent = async (
  eventId,
  eventData
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/calendar/${eventId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(eventData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de modifier l'événement."
    );
  }

  return data.event;
};

// ========================================
// SUPPRIMER UN ÉVÉNEMENT
// ========================================

export const deleteCalendarEvent = async (
  eventId
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/calendar/${eventId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de supprimer l'événement."
    );
  }

  return data;
};