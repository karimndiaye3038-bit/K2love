import {
  useEffect,
  useMemo,
  useState,
} from "react";

import socket from "../services/socket";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Clock,
  Heart,
  Cake,
  Plane,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// TYPES
// =====================================================

const EVENT_TYPES = [
  {
    value: "date",
    label: "Date",
    icon: CalendarIcon,
    color: "#a855f7",
  },
  {
    value: "anniversary",
    label: "Anniversaire",
    icon: Heart,
    color: "#ec4899",
  },
  {
    value: "birthday",
    label: "Anniversaire de naissance",
    icon: Cake,
    color: "#f59e0b",
  },
  {
    value: "romantic",
    label: "Moment romantique",
    icon: Heart,
    color: "#ef4444",
  },
  {
    value: "travel",
    label: "Voyage",
    icon: Plane,
    color: "#3b82f6",
  },
  {
    value: "other",
    label: "Autre",
    icon: Sparkles,
    color: "#6366f1",
  },
];

// =====================================================
// UTILITAIRES
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
};

const getCurrentUser = () => {
  try {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Erreur lecture utilisateur :",
      error
    );

    return null;
  }
};

const getCoupleId = () => {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  if (typeof user.couple === "string") {
    return user.couple;
  }

  if (user.couple?._id) {
    return user.couple._id;
  }

  if (user.couple?.id) {
    return user.couple.id;
  }

  return null;
};

const formatDateForInput = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (date) => {
  const d = new Date(date);

  const hours = String(
    d.getHours()
  ).padStart(2, "0");

  const minutes = String(
    d.getMinutes()
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const createDateTime = (
  date,
  time
) => {
  return `${date}T${time}:00`;
};

const formatEventTime = (date) => {
  return new Date(date).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

const isSameDay = (
  date1,
  date2
) => {
  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  );
};

// =====================================================
// JOURS DU MOIS
// =====================================================

const getMonthDays = (
  year,
  month
) => {
  const firstDay = new Date(
    year,
    month,
    1
  );

  const firstDayIndex =
    (firstDay.getDay() + 6) % 7;

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  const days = [];

  // Mois précédent
  for (
    let i = firstDayIndex - 1;
    i >= 0;
    i--
  ) {
    days.push({
      date: new Date(
        year,
        month - 1,
        previousMonthDays - i
      ),
      currentMonth: false,
    });
  }

  // Mois actuel
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push({
      date: new Date(
        year,
        month,
        day
      ),
      currentMonth: true,
    });
  }

  // Mois suivant
  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      date: new Date(
        year,
        month + 1,
        nextDay
      ),
      currentMonth: false,
    });

    nextDay++;
  }

  return days;
};

// =====================================================
// COMPOSANT
// =====================================================

const Calendar = () => {
  const today = new Date();

  const [currentDate, setCurrentDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      date: formatDateForInput(
        today
      ),
      startTime: "19:00",
      endTime: "20:00",
      type: "date",
      color: "#a855f7",
      reminder: 0,
    });

  // =====================================================
  // CALENDRIER
  // =====================================================

  const monthDays = useMemo(() => {
    return getMonthDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [currentDate]);

  const monthLabel =
    currentDate.toLocaleDateString(
      "fr-FR",
      {
        month: "long",
        year: "numeric",
      }
    );

  // =====================================================
  // RÉCUPÉRATION
  // =====================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Vous devez être connecté pour voir le calendrier."
        );

        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/calendar`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de récupérer les événements."
        );
      }

      setEvents(
        Array.isArray(data.events)
          ? data.events
          : []
      );
    } catch (err) {
      console.error(
        "❌ Erreur récupération calendrier :",
        err
      );

      setError(
        err.message ||
          "Erreur de récupération."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHARGEMENT INITIAL
  // =====================================================

  useEffect(() => {
    fetchEvents();
  }, []);

  // =====================================================
  // SOCKET.IO
  // =====================================================

  useEffect(() => {
    const token = getToken();
    const coupleId = getCoupleId();

    if (!token) {
      return;
    }

    if (!coupleId) {
      console.warn(
        "⚠️ Aucun coupleId trouvé."
      );

      return;
    }

    console.log(
      "🔌 Connexion Socket.IO..."
    );

    socket.auth = {
      token,
    };

    // Événement créé
    const handleEventCreated = (
      newEvent
    ) => {
      console.log(
        "📅 Événement créé reçu :",
        newEvent
      );

      if (!newEvent?._id) {
        return;
      }

      setEvents((previous) => {
        const exists =
          previous.some(
            (event) =>
              event._id ===
              newEvent._id
          );

        if (exists) {
          return previous.map(
            (event) =>
              event._id ===
              newEvent._id
                ? newEvent
                : event
          );
        }

        return [
          ...previous,
          newEvent,
        ];
      });
    };

    // Événement modifié
    const handleEventUpdated = (
      updatedEvent
    ) => {
      console.log(
        "✏️ Événement modifié reçu :",
        updatedEvent
      );

      if (!updatedEvent?._id) {
        return;
      }

      setEvents((previous) =>
        previous.map((event) =>
          event._id ===
          updatedEvent._id
            ? updatedEvent
            : event
        )
      );
    };

    // Événement supprimé
    const handleEventDeleted = ({
      eventId,
    }) => {
      console.log(
        "🗑️ Événement supprimé reçu :",
        eventId
      );

      if (!eventId) {
        return;
      }

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event._id !== eventId
        )
      );
    };

    // Connexion
    const handleConnect = () => {
      console.log(
        "🟢 Socket connecté :",
        socket.id
      );

      socket.emit(
        "joinCouple",
        coupleId
      );

      console.log(
        "❤️ Room couple rejointe :",
        coupleId
      );
    };

    const handleDisconnect = (
      reason
    ) => {
      console.log(
        "🔴 Socket déconnecté :",
        reason
      );
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "calendarEventCreated",
      handleEventCreated
    );

    socket.on(
      "calendarEventUpdated",
      handleEventUpdated
    );

    socket.on(
      "calendarEventDeleted",
      handleEventDeleted
    );

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "calendarEventCreated",
        handleEventCreated
      );

      socket.off(
        "calendarEventUpdated",
        handleEventUpdated
      );

      socket.off(
        "calendarEventDeleted",
        handleEventDeleted
      );

      socket.emit(
        "leaveCouple",
        coupleId
      );

      socket.disconnect();
    };
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  // =====================================================
  // MODAL
  // =====================================================

  const openCreateModal = (
    date = today
  ) => {
    setSelectedEvent(null);

    setForm({
      title: "",
      description: "",
      date: formatDateForInput(
        date
      ),
      startTime: "19:00",
      endTime: "20:00",
      type: "date",
      color: "#a855f7",
      reminder: 0,
    });

    setError("");
    setShowModal(true);
  };

  const openEditModal = (
    event
  ) => {
    setSelectedEvent(event);

    const eventType =
      EVENT_TYPES.find(
        (item) =>
          item.value === event.type
      ) ||
      EVENT_TYPES[0];

    setForm({
      title:
        event.title || "",
      description:
        event.description || "",
      date:
        formatDateForInput(
          event.startDate
        ),
      startTime:
        formatTimeForInput(
          event.startDate
        ),
      endTime:
        formatTimeForInput(
          event.endDate
        ),
      type:
        event.type || "date",
      color:
        event.color ||
        eventType.color,
      reminder:
        event.reminder || 0,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving || deleting) {
      return;
    }

    setShowModal(false);
    setSelectedEvent(null);
  };

  // =====================================================
  // FORMULAIRE
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "type") {
      const eventType =
        EVENT_TYPES.find(
          (item) =>
            item.value === value
        );

      setForm((previous) => ({
        ...previous,
        type: value,
        color:
          eventType?.color ||
          previous.color,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CRÉER / MODIFIER
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Vous devez être connecté."
        );
      }

      if (!form.title.trim()) {
        throw new Error(
          "Le titre est obligatoire."
        );
      }

      if (
        form.endTime <
        form.startTime
      ) {
        throw new Error(
          "L'heure de fin doit être après l'heure de début."
        );
      }

      const payload = {
        title:
          form.title.trim(),

        description:
          form.description.trim(),

        startDate:
          createDateTime(
            form.date,
            form.startTime
          ),

        endDate:
          createDateTime(
            form.date,
            form.endTime
          ),

        type: form.type,

        color: form.color,

        reminder:
          Number(
            form.reminder
          ) || 0,
      };

      const url =
        selectedEvent
          ? `${API_URL}/api/calendar/${selectedEvent._id}`
          : `${API_URL}/api/calendar`;

      const method =
        selectedEvent
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
          body:
            JSON.stringify(
              payload
            ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'enregistrer l'événement."
        );
      }

      // Mise à jour immédiate locale
      if (selectedEvent) {
        setEvents(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                data.event._id
                  ? data.event
                  : item
            )
        );
      } else {
        setEvents(
          (previous) => {
            const exists =
              previous.some(
                (item) =>
                  item._id ===
                  data.event._id
              );

            if (exists) {
              return previous;
            }

            return [
              ...previous,
              data.event,
            ];
          }
        );
      }

      closeModal();
    } catch (err) {
      console.error(
        "❌ Erreur sauvegarde :",
        err
      );

      setError(
        err.message ||
          "Erreur de sauvegarde."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SUPPRESSION
  // =====================================================

  const handleDelete = async (
    eventId
  ) => {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cet événement ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Vous devez être connecté."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/calendar/${eventId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer l'événement."
        );
      }

      setEvents(
        (previous) =>
          previous.filter(
            (event) =>
              event._id !== eventId
          )
      );

      setShowModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error(
        "❌ Erreur suppression :",
        err
      );

      setError(
        err.message ||
          "Erreur de suppression."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // ÉVÉNEMENTS DU MOIS
  // =====================================================

  const monthEvents =
    useMemo(() => {
      return [...events]
        .filter((event) => {
          const date =
            new Date(
              event.startDate
            );

          return (
            date.getMonth() ===
              currentDate.getMonth() &&
            date.getFullYear() ===
              currentDate.getFullYear()
          );
        })
        .sort(
          (a, b) =>
            new Date(
              a.startDate
            ) -
            new Date(
              b.startDate
            )
        );
    }, [
      events,
      currentDate,
    ]);

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Notre calendrier 📅
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organisez vos moments importants ensemble ❤️
          </p>
        </div>

        <button
          onClick={() =>
            openCreateModal()
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          <Plus size={18} />

          Ajouter
        </button>
      </div>

      {/* =================================================
          ERREUR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          CALENDRIER
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

        {/* Navigation */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

          <div className="flex items-center gap-2">

            <button
              onClick={
                previousMonth
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
            >
              <ChevronLeft
                size={17}
              />
            </button>

            <button
              onClick={
                nextMonth
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
            >
              <ChevronRight
                size={17}
              />
            </button>

            <h2 className="ml-1 text-lg font-bold capitalize text-gray-800">
              {monthLabel}
            </h2>

          </div>

          <button
            onClick={
              goToToday
            }
            className="rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Aujourd'hui
          </button>

        </div>

        {/* Jours */}

        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">

          {[
            "Lun",
            "Mar",
            "Mer",
            "Jeu",
            "Ven",
            "Sam",
            "Dim",
          ].map(
            (day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:text-[11px]"
              >
                {day}
              </div>
            )
          )}

        </div>

        {/* Grille */}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

              <p className="mt-3 text-xs text-gray-500">
                Chargement...
              </p>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7">

            {monthDays.map(
              (
                {
                  date,
                  currentMonth,
                },
                index
              ) => {

                const isToday =
                  isSameDay(
                    date,
                    today
                  );

                return (
                  <button
                    key={`${date.toISOString()}-${index}`}
                    onClick={() =>
                      openCreateModal(
                        date
                      )
                    }
                    className={`flex h-11 items-center justify-center border-b border-r border-gray-100 text-xs transition sm:h-13 ${
                      currentMonth
                        ? "bg-white text-gray-700 hover:bg-pink-50"
                        : "bg-gray-50 text-gray-300"
                    }`}
                  >

                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold ${
                        isToday
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>

                  </button>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =================================================
          CARTE ÉVÉNEMENTS
      ================================================= */}

      <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Nos événements ❤️
            </h2>

            <p className="text-xs text-gray-500">
              Les moments importants de{" "}
              {monthLabel}
            </p>
          </div>

          <CalendarDays
            size={22}
            className="text-purple-500"
          />

        </div>

        {monthEvents.length ===
        0 ? (
          <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">

            <CalendarDays
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-500">
              Aucun événement ce mois-ci
            </p>

            <button
              onClick={() =>
                openCreateModal()
              }
              className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              + Ajouter un événement
            </button>

          </div>
        ) : (
          <div className="space-y-2">

            {monthEvents.map(
              (event) => {

                const eventType =
                  EVENT_TYPES.find(
                    (item) =>
                      item.value ===
                      event.type
                  ) ||
                  EVENT_TYPES[0];

                const Icon =
                  eventType.icon;

                const eventColor =
                  event.color ||
                  eventType.color;

                return (
                  <button
                    key={event._id}
                    onClick={() =>
                      openEditModal(
                        event
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-pink-200 hover:bg-pink-50"
                  >

                    {/* Icône */}

                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          `${eventColor}18`,
                        color:
                          eventColor,
                      }}
                    >
                      <Icon
                        size={19}
                      />
                    </div>

                    {/* Informations */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <h3 className="truncate text-sm font-bold text-gray-800">
                          {event.title}
                        </h3>

                        <span
                          className="hidden shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold sm:block"
                          style={{
                            backgroundColor:
                              `${eventColor}18`,
                            color:
                              eventColor,
                          }}
                        >
                          {
                            eventType.label
                          }
                        </span>

                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">

                        <span>
                          {formatEventDate(
                            event.startDate
                          )}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock
                            size={11}
                          />

                          {formatEventTime(
                            event.startDate
                          )}
                        </span>

                      </div>

                      {event.description && (
                        <p className="mt-1 truncate text-xs text-gray-400">
                          {
                            event.description
                          }
                        </p>
                      )}

                    </div>

                  </button>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedEvent
                    ? "Modifier l'événement"
                    : "Ajouter un événement"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Partagez ce moment avec votre partenaire ❤️
                </p>
              </div>

              <button
                onClick={
                  closeModal
                }
                disabled={
                  saving ||
                  deleting
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                <X size={17} />
              </button>

            </div>

            {/* Formulaire */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4 p-5"
            >

              {/* Titre */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Titre *
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Ex : Dîner romantique"
                  required
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Date */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={
                    form.date
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Heures */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Début
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={
                      form.startTime
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Fin
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={
                      form.endTime
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  />
                </div>

              </div>

              {/* Type */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Type
                </label>

                <select
                  name="type"
                  value={
                    form.type
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                >
                  {EVENT_TYPES.map(
                    (type) => (
                      <option
                        key={
                          type.value
                        }
                        value={
                          type.value
                        }
                      >
                        {
                          type.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Description */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  placeholder="Ajoutez un petit détail..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Couleur */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Couleur
                </label>

                <div className="flex gap-3">

                  {[
                    "#a855f7",
                    "#ec4899",
                    "#ef4444",
                    "#f59e0b",
                    "#3b82f6",
                    "#10b981",
                  ].map(
                    (color) => (
                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          setForm(
                            (
                              previous
                            ) => ({
                              ...previous,
                              color,
                            })
                          )
                        }
                        className={`h-7 w-7 rounded-full transition ${
                          form.color ===
                          color
                            ? "scale-110 ring-2 ring-gray-400 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            color,
                        }}
                      />
                    )
                  )}

                </div>
              </div>

              {/* Rappel */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Rappel
                </label>

                <select
                  name="reminder"
                  value={
                    form.reminder
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="0">
                    Aucun rappel
                  </option>

                  <option value="10">
                    10 minutes avant
                  </option>

                  <option value="30">
                    30 minutes avant
                  </option>

                  <option value="60">
                    1 heure avant
                  </option>

                  <option value="1440">
                    1 jour avant
                  </option>
                </select>
              </div>

              {/* Boutons */}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">

                {selectedEvent ? (
                  <button
                    type="button"
                    disabled={
                      saving ||
                      deleting
                    }
                    onClick={() =>
                      handleDelete(
                        selectedEvent._id
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2
                      size={16}
                    />

                    {deleting
                      ? "Suppression..."
                      : "Supprimer"}
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={
                      saving ||
                      deleting
                    }
                    onClick={
                      closeModal
                    }
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      deleting
                    }
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Heart
                      size={16}
                    />

                    {saving
                      ? "Enregistrement..."
                      : selectedEvent
                      ? "Enregistrer"
                      : "Ajouter"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Calendar;