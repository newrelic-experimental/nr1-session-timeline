[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# New Relic One Session Timeline (nr1-session-timeline)

![CI](https://github.com/newrelic-experimental/nr1-session-timeline/workflows/CI/badge.svg) ![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic-experimental/nr1-session-timeline?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic-experimental/nr1-session-timeline/badge.svg)](https://snyk.io/test/github/newrelic-experimental/nr1-session-timeline)

This nerdlet is designed to show all Browser events recorded over time against a single session. This is intended in particular to assist in use cases where a single customer raises an issue over a specific issue or help request.

## Features

- Event stream of all browser events triggered by a specific session
- Gauge of events in elapsed time (ordered by time of occurence)
- Drilldown to see all attributes recorded for each event in the event stream
- Filter event stream to view only events of specific event types
- Define performance thresholds and flag events that breach those thresholds

![Session Timeline Screenshot](screenshots/demo.gif)

## Installation

- Download repo
- run `npm install`
- run `nr1 nerdpack:uuid -gf`
- update [config.js](/src/config/config.js) as needed (see `Configuration` below)
- Serve locally with `nr1 nerdpack:serve` or [deploy](https://developer.newrelic.com/build-tools/new-relic-one-applications/publish-deploy) to your New Relic account using the `nr1` CLI.

## Configuration

Currently, app-specific configuration is hardcoded into the `/src/config/config.js` script, and changes will need to be made in this file at the moment. The following cofiguration attributes are available:

### duration

This is not set in the config.js script - the timeframe used for the search is derived from the common timepicker setting.

### searchAttribute

(_mandatory_) This is the attribute used to locate sessions. It is recommended to use a custom attribute such as userId (default) or email, but this can be any string value recorded into the root entity type (see `event` below)

### event

The root entity type that will be queried to locate sessions based on the `searchAttribute`. Defaults to `BrowserInteraction`.

### groupingAttribute

The attribute to use to locate related events across the in-scope set of event types (see `timelineEventTypes` below). Defaults to the `session` attribute.

### timelineEventTypes

The set of event types to include in the timeline and event stream. These should be limited to [Browser event types](https://docs.newrelic.com/docs/insights/insights-data-sources/default-data/browser-default-events-insights#). Events will be located based on the `groupingAttribute`. Defaults to `BrowserInteraction`, `AjaxRequest` and `JavaScriptError`

### eventTitleAttributes

Each segment in the event stream can include an additional descriptive attribute (for instance, a URL or error message). Use these settings to indicate which attribute should be used. This config entry consists of an array containing the following object definitions:

- **name**: The event type (_mandatory_)
- **primary**: The attribute to first check for. If the value is null, fall through to the secondary attribute (_mandatory_)
- **secondary**: The attribute to check for if the primary value is null (_optional_)
- **truncateStart**: `true` to truncate the beginning of long values, `false` to truncate the end of long values. (_optional_ - defaults to false if not included).

### eventThresholds

The thresholds each event will be assessed against. Events that breach any one of the defined thresholds are flagged in the UI. _Currently, thresholds only support numeric, and assume the comparison is greater than._ This config entry consists of an array containing the following object definitions:

- **eventType**: The target event type (_mandatory_)
- **thresholds**: An array of
  - **categoryAttribute**: scopes this threshold to event instances of a certain type. Use with `categoryValue` (_optional_)
  - **categoryValue**: scopes this threshold to event instances of a certain type. (_mandator_ if `categoryAttribute` is provided)
  - **attribute**: the attribute to compare to the threshold (_mandatory_)
  - **threshold**: the threshold to compare the value against (_mandatory_)

## Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](https://github.com/newrelic-experimental/nr1-session-timeline/issues). Please search for and review the existing open issues before submitting a new issue.

## Security

As noted in our [security policy](https://github.com/newrelic-experimental/nr1-session-timeline/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.
If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](./CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.
