export default [
  {
    type: 'BROWSER',
    searchAttribute: 'session',
    rootEvent: 'PageView', //'BrowserInteraction',
    groupingAttribute: 'session',
    linkingAttribute: '',
    timelineEventTypes: [
      { name: 'PageView', selected: true },
      { name: 'BrowserInteraction', selected: true },
      { name: 'AjaxRequest', selected: true },
      { name: 'JavaScriptError', selected: true },
      { name: 'BrowserTiming', selected: true },
    ],
    eventTitleAttributes: [
      {
        name: 'PageView',
        primary: 'pageUrl',
        secondary: '',
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
    ],
    eventThresholds: [
      {
        eventType: 'PageView',
        thresholds: [
          {
            attribute: 'firstContentfulPaint',
            categoryAttribute: '',
            categoryValue: '',
            threshold: 1.8,
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
