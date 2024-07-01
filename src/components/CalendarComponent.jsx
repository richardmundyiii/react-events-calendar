import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import {
  Container,
  Grid,
  Typography,
  IconButton,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const eventsData = [
  { date: "2024-07-01", name: "Event 1", info: "Details about event 1..." },
  { date: "2024-07-15", name: "Event 2", info: "Details about event 2..." },
  { date: "2024-08-05", name: "Event 3", info: "Details about event 3..." },
  { date: "2024-09-10", name: "Event 4", info: "Details about event 4..." },
  { date: "2024-10-22", name: "Event 5", info: "Details about event 5..." },
  { date: "2024-11-18", name: "Event 6", info: "Details about event 6..." },
  { date: "2024-12-25", name: "Event 7", info: "Details about event 7..." },
  { date: "2025-01-01", name: "Event 8", info: "Details about event 8..." },
  { date: "2025-02-14", name: "Event 9", info: "Details about event 9..." },
  { date: "2025-03-17", name: "Event 10", info: "Details about event 10..." },
];

export default function CalendarComponent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  function renderHeader() {
    return (
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "20px" }}
      >
        <IconButton onClick={prevMonth}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <IconButton onClick={nextMonth}>
          <ArrowForward />
        </IconButton>
      </Grid>
    );
  }

  function renderDays() {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <Grid item xs={1} key={i} style={{ textAlign: "center" }}>
          {format(addDays(startDate, i), "EEEEEE")}
        </Grid>
      );
    }
    return <Grid container>{days}</Grid>;
  }

  function renderCells() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const eventForDay = eventsData.find((event) =>
          isSameDay(parseISO(event.date), cloneDay)
        );
        days.push(
          <Grid item xs={1} key={day} style={{ textAlign: "center" }}>
            <Paper
              style={{
                backgroundColor: isSameMonth(day, monthStart)
                  ? eventForDay
                    ? "rgba(86, 30, 240, 1) 20%"
                    : "#fff"
                  : "#f5f5f5",
                padding: "20px", // Increased padding to make boxes bigger
                cursor: eventForDay ? "pointer" : "default",
              }}
              onClick={() => eventForDay && handleOpen(eventForDay)}
            >
              <Typography variant="body2">{formattedDate}</Typography>
              {eventForDay && (
                <Typography
                  variant="caption"
                  key={eventForDay.name}
                  style={{ color: "#fff" }}
                >
                  {eventForDay.name}
                </Typography>
              )}
            </Paper>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day}>
          {days}
        </Grid>
      );
      days = [];
    }
    return <>{rows}</>;
  }

  function nextMonth() {
    setCurrentMonth(addMonths(currentMonth, 1));
  }

  function prevMonth() {
    setCurrentMonth(subMonths(currentMonth, 1));
  }

  return (
    <>
      <Container>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="event-modal-title"
          aria-describedby="event-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedEvent && (
              <>
                <Typography id="event-modal-title" variant="h6" component="h2">
                  {selectedEvent.name}
                </Typography>
                <Typography id="event-modal-description" sx={{ mt: 2 }}>
                  {selectedEvent.info}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Date: {selectedEvent.date}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
}
