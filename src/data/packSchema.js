export const schema = [
  {
    name: 'type',
    mandatory: true,
    modifiable: false,
    desc:
      'The type of entity this config will pertain to - maps to the Entity.domain attribute',
  },
  {
    name: 'searchAttribute',
    title: 'User Identifier',
    mandatory: true,
    modifiable: true,
    desc: `This is the value used to locate a user's data. It should be something that uniquely identifies the user, such as an email or a userId. This is not part of the custom dataset collected by New Relic's agents, so you may need to add instrumentation in order to collect it.`,
  },
  {
    name: 'rootEvent',
    mandatory: true,
    modifiable: false,
    desc:
      'The root event type that will be evaluted for events matching the searchAttribute',
  },
  {
    name: 'groupingAttribute',
    mandatory: true,
    modifiable: false,
    desc:
      'Matching events found in the rootEvent will be grouped according to this attribute (e.g. session for Browser events)',
  },
  {
    name: 'linkingAttribute',
    mandatory: false,
    modifiable: false,
    desc:
      'The attribute to use to identify related events. Defaults to groupingAttribute',
  },
  {
    name: 'timelineEventTypes',
    mandatory: true,
    modifiable: false,
    desc: 'The related event types that will be included in the timeline',
  },
  {
    name: 'eventTitleAttributes',
    mandatory: false,
    modifiable: false,
    desc:
      'Attributes that will be included in the title of the timeline event segment',
  },
  {
    name: 'eventThresholds',
    mandatory: false,
    modifiable: true,
    desc:
      'These are the threshold definitions that timeline segements will be evaluated against. Segments that violate the threshold definition will be highlight in the timeline view. A set of default thresholds have been provided - modify them to fit the specifics of your app.',
    display: 'block',
    children: [
      {
        name: 'eventType',
        display: 'dropdown',
        source: 'timelineEventTypes',
        mandatory: true,
        modifiable: true,
        desc:
          'This is the event type that the threshold will apply to. E.g. BrowserInteraction',
      },
      {
        name: 'thresholds',
        mandatory: true,
        modifiable: true,
        display: 'line',
        children: [
          {
            name: 'attribute',
            mandatory: true,
            mandatoryMessage: 'Requires string value',
            modifiable: true,
            desc:
              'The event attribute whose value will be compared against the threshold. E.g. duration',
          },
          {
            name: 'threshold',
            mandatory: true,
            mandatoryMessage: 'Requires numeric value',
            modifiable: true,
            typeCheck: val => !isNaN(val),
            desc:
              'The numeric value the attribute will be evaluated against. Attributes that exceed the value will be considered in violation.',
          },
          {
            name: 'categoryAttribute',
            mandatory: false,
            modifiable: true,
            desc:
              'Use this when you wish to evaluate only a subset of events that match a specific value. This is the name of the event attribute that will be evaluated against the categoryValue setting. For instance, in the BrowserInteraction event, there is a "category" attribute that allows us to differentiate between page loads and route changes. To apply this threshold to route changes only, we would enter "category" into this field, and "Route Change" in the categoryValue field.',
          },
          {
            name: 'categoryValue',
            mandatory: false,
            modifiable: true,
            desc:
              'Use this when you wish to evaluate only a subset of events that match a specific value. This is the value that the categoryAttribute will be compared against. For instance, in the BrowserInteraction event, there is a category attribute that allows us to differentiate between page loads and route changes. To apply this threshold to route changes only, we would enter "category" into the categoryAttribute field, and "Route Change" in this field.',
          },
        ],
      },
    ],
  },
]
