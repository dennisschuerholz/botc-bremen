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
            const details = event.description.split('\n').reduce((acc, line) => {
                if (line.trim() === '') {
                    return acc;
                }
                const [key, ...values] = line.split(':');
                const value = values.join(':');
                if (values.length === 0) {
                    acc["extra"] = key;
                    return acc;
                }
                acc[key.trim().toLowerCase()] = value.trim();
                return acc;
            }, {});
            const storyTellers = details['st'] ? details['st'].split(',').map(st => st.trim()) : [];
            return {
                title: event.summary,
                start: event.start,
                end: event.end,
                location: event.location,
                locationUrl: details['loc'] || null,
                url: details['url'] || null,
                storyTellers,
                extra: details['extra'] || null,
            };
        });

        // Store the parsed events into a JSON file
        fs.writeFileSync(upath.resolve(__dirname, '../dist/events.json'), JSON.stringify(events, null, 2));
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
