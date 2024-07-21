let events = [];
let chunksize = 3;
let startCounter = 0;

function nextEvents(decrease = false) {
    const oc = startCounter;
    if (decrease) startCounter = Math.max(0, startCounter-chunksize);
    else startCounter = Math.min(events.length -  events.length % chunksize, startCounter + chunksize);
    if (startCounter >= events.length) startCounter = oc;
    if (oc !== startCounter) fillEvents();
}

function fillEvents() {
    const rootElement = document.getElementById('botc-event-widget');
    rootElement.innerHTML = '';
    const eventsCounter = document.getElementById('eventsCounter');
    eventsCounter.innerHTML = `Seite ${Math.floor(startCounter/chunksize)+1} von ${Math.ceil(events.length/chunksize)}`;
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
       weekday: 'short',
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit',
       minute: '2-digit',
    });
    let counter = 0;
    events.forEach(event => {
        counter++;
        if (counter <= startCounter || counter > startCounter+chunksize) {
            return;
        }
        const eventElement = document.createElement('li');
        eventElement.classList.add('d-flex', 'list-group-item', 'justify-content-between', 'align-items-center', 'event');
        eventElement.innerHTML = `
            <div>
                <b class="title d-inline-block mb-1">${event.title}</b>
                <div title="Start">
                    <i class="bi bi-calendar-event"></i>
                    <time class="ms-1" datetime="${event.start}">${dateFormat.formatRange(new Date(event.start), new Date(event.end))}</time>
                </div>
                <div title="Ort">
                    <i class="bi bi-pin-map-fill"></i>
                    ${event.locationUrl ? `<a href="${event.locationUrl}" target="_blank">` : ''}
                    <span class="ms-1">${event.location || '<i>Noch nicht bestimmt</i>'}</span>
                    ${event.locationUrl ? '</a>' : ''}
                </div>
                <div title="Storyteller">
                    <i class="bi bi-person-workspace"></i>
                    <span class="ms-1">${event.storyTellers.length > 0 ? event.storyTellers.join(", ") : '<i>Noch nicht bestimmt</i>'}</span>
                </div>
                ${event.extra ? `<div title="Extra" class="extra"><i class="bi bi-info-lg"></i> <span class="ms-1">${event.extra}</span></div>` : ''}
            </div>
            ${event.url ? `<a href="${event.url}" target="_blank"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
        `;
        eventElement.addEventListener('mouseover', () => {
            eventElement.classList.add('bg-light');
        });
        eventElement.addEventListener('mouseout', () => {
            eventElement.classList.remove('bg-light');
        });
        if (event.url) {
            eventElement.addEventListener('click', (clickEvent) => {
                if (clickEvent.target.parentElement.tagName === 'A') {
                    return;
                }
                window.open(event.url, '_blank');
            });
            eventElement.classList.add('cursor-pointer');
        }
        rootElement.appendChild(eventElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/events.json')
        .then(response => response.json())
        .then(all_events => {
            all_events.sort((a, b) => new Date(a.start) - new Date(b.start));
            const now = new Date();
            events = all_events.filter((event) => new Date(event.end) >= now);
            fillEvents(0);
        })
        .catch(error => {
            console.error(error);
        });
});

window.onscroll = () => {
    let current = "";
    for (const section of document.getElementsByTagName('section')) {
        if (window.scrollY >= section.offsetTop - window.innerHeight * 0.45) {
            current = section.id;
        }
    }

    const active = document.querySelector('.navbar .nav-item .nav-link.active');
    if (active != null && active.href !== `#${current}`) active.classList.remove('active');

    if (active == null || active.href !== `#${current}`) {
        const link = document.querySelector(`.navbar .nav-item .nav-link[href="#${current}"]`)
        if (link != null) link.classList.add('active');
    }
};

document.querySelectorAll('.navbar a.navbar-brand, #navbarResponsive .nav-item .nav-link').forEach(link => {
    link.addEventListener('click', (evt) => {
        const navbar = bootstrap.Collapse.getInstance(document.querySelector('#navbarResponsive'));
        if (navbar != null) navbar.hide();
    });
});
