import { Icon } from 'nr1'

const groups = [
  {
    name: 'PAGE_LOAD',
    eventDisplay: {
      class: 'timeline-item-type-pageload',
      icon: Icon.TYPE.INTERFACE__STATE__PUBLIC,
      label: 'Page Load',
      color: '#02acfa',
    },
    timelineDisplay: {
      color: '#02acfa',
      label: 'Page Load',
    },
    actionNames: ['Initial page load', 'PageView'],
  },
  {
    name: 'MOBILE_SESSION',
    eventDisplay: {
      class: 'timeline-item-type-pageload',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__MOBILE,
      label: 'Mobile Session',
      color: '#02acfa',
    },
    timelineDisplay: {
      color: '#02acfa',
      label: 'Mobile Session',
    },
    actionNames: ['MobileSession'],
  },
  {
    name: 'BREADCRUMB',
    eventDisplay: {
      class: 'timeline-item-type-custom',
      icon: Icon.TYPE.LOCATION__LOCATION__PIN,
      label: 'Breadcrumb',
      color: '#016911',
    },
    timelineDisplay: {
      color: '#bdf2c6',
      label: 'Breadcrumb',
    },
    actionNames: ['MobileBreadcrumb'],
  },
  {
    name: 'DOWNLOAD',
    eventDisplay: {
      class: 'timeline-item-type-download',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__DOWNSTREAM_DEPLOYMENT,
      label: 'Download',
      color: '#01355c',
    },
    timelineDisplay: {
      color: '#add7f7',
      label: 'Download',
    },
    actionNames: ['DOWNLOAD'],
  },
  {
    name: 'ROUTE_CHANGE',
    eventDisplay: {
      class: 'timeline-item-type-routechange',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__NODE,
      label: 'Route Change',
      color: '#9C5400',
    },
    timelineDisplay: {
      color: '#fcdd77',
      label: 'Route Change',
    },
    actionNames: ['Route change'],
  },
  {
    name: 'AJAX',
    eventDisplay: {
      class: 'timeline-item-type-ajax',
      icon: Icon.TYPE.INTERFACE__ARROW__ARROW_VERTICAL,
      label: 'Ajax',
      color: '#a752d5',
    },
    timelineDisplay: {
      color: '#cea3e6',
      label: 'Ajax',
    },
    actionNames: ['AjaxRequest'],
  },
  {
    name: 'REQUEST',
    eventDisplay: {
      class: 'timeline-item-type-ajax',
      icon: Icon.TYPE.INTERFACE__ARROW__ARROW_VERTICAL,
      label: 'Request',
      color: '#a752d5',
    },
    timelineDisplay: {
      color: '#cea3e6',
      label: 'Request',
    },
    actionNames: ['MobileRequest'],
  },
  {
    name: 'ERROR',
    eventDisplay: {
      class: 'timeline-item-type-error',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR,
      label: 'Error',
      color: '#bf0015',
    },
    timelineDisplay: {
      color: '#bf0015',
      label: 'Error',
    },
    actionNames: ['JavaScriptError', 'MobileRequestError'],
  },
  {
    name: 'EXCEPTION',
    eventDisplay: {
      class: 'timeline-item-type-exception',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__MOBILE__S_WARNING,
      label: 'Handled Exception',
      color: '#51524c',
    },
    timelineDisplay: {
      color: '#e4e133',
      label: 'Handled Exception',
    },
    actionNames: ['MobileHandledException'],
  },
  {
    name: 'CRASH',
    eventDisplay: {
      class: 'timeline-item-type-error',
      icon: Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR,
      label: 'Crash',
      color: '#bf0015',
    },
    timelineDisplay: {
      color: '#bf0015',
      label: 'Crash',
    },
    actionNames: ['MobileCrash'],
  },
  {
    name: 'CUSTOM',
    eventDisplay: {
      class: 'timeline-item-type-custom',
      icon: Icon.TYPE.INTERFACE__OPERATIONS__SELECTION,
      label: 'Custom Interaction',
      color: '#016911',
    },
    timelineDisplay: {
      color: '#bdf2c6',
      label: 'Custom Interaction',
    },
    actionNames: ['Custom Interaction'],
  },
]

const defaultGroup = {
  name: 'GENERAL',
  eventDisplay: {
    class: 'timeline-item-type-general',
    icon: Icon.TYPE.INTERFACE__INFO__INFO,
    label: 'General',
    color: '#00496b',
  },
  timelineDisplay: {
    color: '#00496b',
    label: 'Uncategorized',
  },
  actionNames: [],
}

const eventGroup = event => {
  const found = groups.filter(group => {
    return group.actionNames.includes(event)
  })
  if (found.length > 0) return found[0]
  else {
    console.info('uncategorized event', event)
    return defaultGroup
  }
}

export default eventGroup
