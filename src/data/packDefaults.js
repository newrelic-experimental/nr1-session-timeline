export default [
  {
    type: 'BROWSER',
    searchAttribute: 'username',
    rootEvent: 'BrowserInteraction',
    groupingAttribute: 'session',
    linkingAttribute: '',
    timelineEventTypes: [
      { name: 'PageView', selected: false },
      { name: 'BrowserInteraction', selected: true },
      { name: 'AjaxRequest', selected: true },
      { name: 'JavaScriptError', selected: true },
      { name: 'BrowserTiming', selected: true },
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
        secondary: '',
        truncateStart: true,
      },
      {
        name: 'JavaScriptError',
        primary: 'errorMessage',
        secondary: 'errorClass',
        truncateStart: false,
      },
      {
        name: 'BrowserTiming',
        primary: 'browserTimingName',
        secondary: 'browserInteractionName',
        truncateStart: true,
      },
    ],
    eventThresholds: [
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
      { name: 'Mobile', selected: false },
      { name: 'MobileSession', selected: true },
      { name: 'MobileBreadcrumb', selected: true },
      { name: 'MobileCrash', selected: true },
      { name: 'MobileRequest', selected: true },
      { name: 'MobileRequestError', selected: true },
      { name: 'MobileHandledException', selected: true },
    ],
    eventTitleAttributes: [
      {
        name: 'MobileSession',
        primary: 'category',
        secondary: '',
        truncateStart: false,
      },
      {
        name: 'MobileBreadcrumb',
        primary: 'name',
        secondary: '',
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
