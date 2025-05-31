import "../styles/style-agenda.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import ModalAgenda from "../components/ModalAgenda";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import {
  format,
  parseISO,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { exibirAgendas } from "../utils/agenda";

export default function Agenda() {
  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  async function carregarAgendas() {
    const agendas = await exibirAgendas();
    setEvents(agendas);
  }

  useEffect(() => {
    document.title = `Agenda`;
    carregarAgendas();
  }, []);

  const dailyEvents = events.filter((event) => {
    const eventDate = format(parseISO(event.start), "yyyy-MM-dd");
    const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
    return eventDate === selectedDateFormatted;
  });

  const generateWeekDays = () => {
    const start = startOfWeek(currentDate, { locale: ptBR });
    const end = endOfWeek(currentDate, { locale: ptBR });
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => ({
      date: format(day, "dd"),
      dayName: format(day, "EEEE", { locale: ptBR }).replace("-feira", ""),
      fullDate: day,
    }));
  };

  const weekDays = generateWeekDays();

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
  };

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const addNewEvent = (newEvent) => {
    setEvents([
      ...events,
      {
        id: `event-${Date.now()}`,
        title: `${newEvent.service} (${newEvent.pet})`,
        start: newEvent.date + "T" + newEvent.startTime,
        end: newEvent.date + "T" + newEvent.endTime,
        backgroundColor: "#307e95",
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="agenda-root">
      <SideBar selecionado="agenda" />

      <div className="agenda-container">
        <main className="agenda-main">
          <div className="agenda-header">
            <span>
              {format(selectedDate, "dd 'de' MMMM yyyy, EEEE", {
                locale: ptBR,
              })}
            </span>
            <button className="btn-novo" onClick={() => setShowModal(true)}>
              + Novo Agendamento
            </button>
            {showModal && (
              <ModalAgenda
                showModal={setShowModal}
                onSave={addNewEvent}
                selectedDate={selectedDate}
                recarregarAgendas={carregarAgendas}
              />
            )}
          </div>

          <div className="agenda-content">
            <section className="agenda-sidebar">
              <div className="agenda-mini-calendar">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  headerToolbar={{
                    start: "title",
                    end: "prev,next",
                  }}
                  height="300px"
                  dateClick={handleDateClick}
                  events={events}
                  eventColor="#307e95"
                  eventContent={() => null} // Isso esconde o conteúdo do evento
                  dayCellContent={(args) => {
                    // Mostra apenas o número do dia
                    return { html: `<div class="fc-daygrid-day-number">${args.dayNumberText}</div>` };
                  }}
                />
              </div>

              <div className="agenda-lista">
                <h4>Agendamentos do Dia</h4>
                {dailyEvents.length > 0 ? (
                  <ul>
                    {dailyEvents.map((event, i) => (
                      <li key={i}>
                        <span>
                          {format(parseISO(event.start), "HH:mm")} -{" "}
                          {format(parseISO(event.end), "HH:mm")}
                        </span>{" "}
                        - {event.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-events">Nenhum agendamento para este dia</p>
                )}
              </div>
            </section>

            <section className="agenda-week-view">
              <div className="week-header">
                <button onClick={handlePrevWeek}>&lt;</button>
                <h3>
                  {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                  <button onClick={handleToday} className="today-btn">
                    Hoje
                  </button>
                </h3>
                <button onClick={handleNextWeek}>&gt;</button>
              </div>

              <div className="week-grid">
                <div className="time-column">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="time-slot">
                      {i + 8}:00
                    </div>
                  ))}
                </div>

                <div className="days-container">
                  {weekDays.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`day-column ${format(day.fullDate, "yyyy-MM-dd") ===
                        format(selectedDate, "yyyy-MM-dd")
                        ? "selected"
                        : ""
                        }`}
                      onClick={() => setSelectedDate(day.fullDate)}
                    >
                      <div className="day-header">
                        <span className="day-name">{day.dayName}</span>
                        <span className="day-date">{day.date}</span>
                      </div>
                      <div className="day-events">
                        {events
                          .filter(
                            (event) =>
                              format(parseISO(event.start), "yyyy-MM-dd") ===
                              format(day.fullDate, "yyyy-MM-dd")
                          )
                          .map((event, eventIdx) => (
                            <div
                              key={eventIdx}
                              className="event-block"
                              style={{
                                top: `${(parseInt(
                                  format(parseISO(event.start), "H")
                                ) -
                                  8) *
                                  60 +
                                  parseInt(format(parseISO(event.start), "m"))
                                  }px`,
                                height: `${(new Date(event.end) -
                                  new Date(event.start)) /
                                  (1000 * 60)
                                  }px`,
                                width: "calc(100% - 8px)",
                              }}
                            >
                              <div className="event-time">
                                {format(parseISO(event.start), "HH:mm")} -{" "}
                                {format(parseISO(event.end), "HH:mm")}
                              </div>
                              <div className="event-title">{event.title}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}