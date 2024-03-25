/*!
* Start Bootstrap - botc-bremen-website v1.0.0 (https://botc-bremen.de)
* Copyright 2013-2024 Dennis Schürholz (https://dennisschuerholz.de/)
* Licensed under MIT (https://github.com/StartBootstrap/botc-bremen-website/blob/master/LICENSE)
*/
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementsByClassName('botc-event-widget')[0];
    fetch('/events.json')
        .then(response => response.json())
        .then(events => {
            rootElement.innerHTML = '';
            events.sort((a, b) => new Date(a.start) - new Date(b.start));
            const now = new Date();
            const dateFormat = new Intl.DateTimeFormat('de-DE', {
               weekday: 'short',
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
            });
            events.forEach(event => {
                if (new Date(event.end) < now) {
                    return;
                }
                const eventElement = document.createElement('li');
                eventElement.classList.add('d-flex', 'list-group-item', 'justify-content-between', 'align-items-center', 'event');
                eventElement.innerHTML = `
                    <div>
                        <b class="title d-inline-block mb-1">${event.title}</b>
                        <div title="Start">
                            <i class="fa-solid fa-calendar-days"></i>
                            <time class="ms-1" datetime="${event.start}">${dateFormat.formatRange(new Date(event.start), new Date(event.end))}</time>
                        </div>
                        <div title="Ort">
                            <i class="fa-solid fa-location-dot"></i>
                            ${event.locationUrl ? `<a href="${event.locationUrl}" target="_blank">` : ''}
                            <span class="ms-1">${event.location || '<i>Noch nicht bestimmt</i>'}</span>
                            ${event.locationUrl ? '</a>' : ''}
                        </div>
                        <div title="Storyteller">
                            <i class="fa-solid fa-person-chalkboard"></i>
                            <span class="ms-1">${event.storyTellers.length > 0 ? event.storyTellers.join(", ") : '<i>Noch nicht bestimmt</i>'}</span>
                        </div>
                        ${event.extra ? `<div title="Extra" class="extra"><i class="fa-solid fa-info-circle"></i> <span class="ms-1">${event.extra}</span></div>` : ''}
                    </div>
                    ${event.url ? `<a href="${event.url}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i></a>` : ''}
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
        })
        .catch(error => {
            console.error(error);
        });
});
