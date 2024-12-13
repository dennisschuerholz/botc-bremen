'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const ical = require('node-ical');

// Download ics file from source configured in package.json
const icsUrl = packageJSON.custom.eventSource;
fetch(icsUrl)
    .then(response => response.text())
    .then(icsContent => {
        // Store the original ics file into dist folder for easier calendar subscribe links (https://botc-bremen.de/events.ics)
        fs.writeFileSync(upath.resolve(__dirname, '../dist/events.ics'), icsContent);

        // Parse ics data
        return ical.async.parseICS(icsContent);
    })
    .then(parsedIcs => {
        // Ignore all other ics data than events
        const icsEvents = Object.values(parsedIcs).filter(event => event.type === 'VEVENT');

        // Extract the relevant data from the ics events
        const events = icsEvents.map(event => {
            const descriptionLines = event.description.split('\n');
            let url = null;
            let locationUrl = null;
            let storyTellers = [];
            let extra = null;
            for (const line of descriptionLines) {
                // Extract the relevant data from the description
                const text = line.trim();
                if (text.startsWith('URL: ')) {
                    url = text.substring(5);
                }
                else if (text.startsWith('LOC: ')) {
                    locationUrl = text.substring(5);
                }
                else if (text.startsWith('ST: ')) {
                    storyTellers = text.substring(4).split(',').map(st => st.trim());
                }
                else {
                    // Add other lines to the extra data, but ignore the first empty lines
                    extra = extra ? `${extra}\n${text}` : text === '' ? null : text;
                }
            }
            return {
                title: event.summary,
                start: event.start,
                end: event.end,
                location: event.location,
                locationUrl,
                url,
                storyTellers,
                extra
            };
        });

        // Sort the events by start date
        events.sort((a, b) => new Date(a.start) - new Date(b.start));

        const next_mzh = events.find((evt) => evt.location.startsWith('MZH') && new Date(evt.start) > new Date());
        fs.appendFileSync(upath.resolve(__dirname, '../src/pug/events/mzh.pug'), `    - const target = '${next_mzh.url}';`);

        // Store the parsed events into a JSON file
        fs.writeFileSync(upath.resolve(__dirname, '../dist/events.json'), JSON.stringify(events, null, 2));
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
