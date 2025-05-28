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
        eventSources: [
            {
                events: events,
                color: 'rgb(49, 21, 62)',
            },
            {
                events: past_events,
                color: 'gray',
            },
            {
                url: 'https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&subdivisionCode=DE-HB&languageIsoCode=DE&validFrom=2024-01-01&validTo=2026-12-31',
                eventDataTransform: function (eventData) {
                    return {title: eventData['name'][0]['text'], start: eventData['startDate'], end: eventData['endDate']};
                },
                display: 'background',
                color: '#80698f',
            }
        ],
        height: '100%',
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '00:00',
            endTime: '24:00',
        },
        nowIndicator: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth,multiMonthYear',
        },
        allDaySlot: true,
        slotMinTime: "10:00:00",
        weekNumbers: true,
    });
    calendar.render();
}
