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
            attribute: 'firstContentfulPaint',
            threshold: 1.8,
            categoryAttribute: 'category',
            categoryValue: 'Initial page load',
          },
          {
            attribute: 'timeToDomComplete',
            threshold: 3,
            categoryAttribute: 'category',
            categoryValue: 'Initial page load',
          },
          {
            attribute: 'duration',
            threshold: 1,
            categoryAttribute: 'category',
            categoryValue: 'Route Change',
          },
        ],
      },
    ],
  },
  {
    type: 'MOBILE',
    searchAttribute: 'sessionId',
    rootEvent: 'Mobile',
    groupingAttribute: 'sessionId',
    linkingAttribute: '',
    timelineEventTypes: [
      'MobileSession',
      'MobileBreadcrumb',
      'MobileCrash',
      'MobileRequest',
      'MobileRequestError',
      'MobileHandledException',
    ],
    eventTitleAttributes: [
      {
        name: 'MobileSession',
        primary: 'category',
        truncateStart: false,
      },
      {
        name: 'MobileBreadcrumb',
        primary: 'name',
        truncateStart: true,
      },
      {
        name: 'MobileCrash',
        primary: 'crashMessage',
        secondary: 'crashLocation',
        truncateStart: true,
      },
      {
        name: 'MobileRequest',
        primary: 'requestUrl',
        secondary: 'requestPath',
        truncateStart: true,
      },
      {
        name: 'MobileRequestError',
        primary: 'networkError',
        secondary: 'requestUrl',
        truncateStart: true,
      },
      {
        name: 'MobileHandledException',
        primary: 'exceptionMessage',
        secondary: 'exceptionName',
        truncateStart: true,
      },
    ],
    eventThresholds: [],
  },
]
