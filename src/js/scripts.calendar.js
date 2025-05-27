events = [];
past_events = [];
document.addEventListener('DOMContentLoaded', function () {
    fetch('/events.json')
        .then(response => response.json())
        .then(all_events => {
            const now = new Date();
            events = all_events.filter((event) => new Date(event.end) >= now);
            past_events = all_events.filter((event) => new Date(event.end) < now);
            past_events = past_events.map(evt => { evt.url = ''; return evt; });
            fillCalendar();
        })
        .catch(error => {
            console.error(error);
        });
});

function fillCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        firstDay: 1,
        /*events: {
            url: '/events.ics',
            format: 'ics',
        },*/
        eventSources: [
            {
                events: events,
                color: 'rgb(49, 21, 62)',
            },
            {
                events: past_events,
                color: 'gray',
            }
        ],
        height: '800px',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth,multiMonthYear',
        },
        allDaySlot: false,
        slotMinTime: "10:00:00",
        weekNumbers: true,
    });
    calendar.render();
}
