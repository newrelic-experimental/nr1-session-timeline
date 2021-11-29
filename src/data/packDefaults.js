export default [
  {
    type: 'BROWSER',
    searchAttribute: 'username',
    rootEvent: 'BrowserInteraction',
    groupingAttribute: 'session',
    linkingAttribute: '',
    timelineEventTypes: [
      'BrowserInteraction',
      'AjaxRequest',
      'JavaScriptError',
      'BrowserTiming',
    ],
    eventTitleAttributes: [
      {
        name: 'BrowserInteraction',
        primary: 'actionText',
        secondary: 'browserInteractionName',
        truncateStart: true,
      },
      {
        name: 'AjaxRequest',
        primary: 'requestUrl',
        truncateStart: true,
      },
      {
        name: 'JavaScriptError',
        primary: 'errorMessage',
        secondary: 'errorClass',
        truncateStart: false,
      },
    ],
    eventThresholds: [
      {
        eventType: 'AjaxRequest',
        thresholds: [{ attribute: 'timeToSettle', threshold: 10 }],
      },
      {
        eventType: 'BrowserInteraction',
        thresholds: [
          {
            categoryAttribute: 'category',
            categoryValue: 'Initial page load',
            attribute: 'firstContentfulPaint',
            threshold: 1.8,
          },
          {
            categoryAttribute: 'category',
            categoryValue: 'Initial page load',
            attribute: 'timeToDomComplete',
            threshold: 3,
          },
          {
            categoryAttribute: 'category',
            categoryValue: 'Route Change',
            attribute: 'duration',
            threshold: 1,
          },
        ],
      },
    ],
  },
]
