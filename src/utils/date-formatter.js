const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

export const formatSinceAndCompare = timeRange => {
  const { begin_time, end_time, duration } = timeRange
  let clauses = { timeRange }

  if (duration) {
    const minutes = duration / 1000 / 60
    clauses.since = ` SINCE ${minutes} MINUTES AGO `
    clauses.compare = ` COMPARE WITH ${minutes} MINUTES AGO `
  } else if (begin_time && end_time) {
    const diff = Math.round((end_time - begin_time) / 1000 / 60)
    clauses.since = ` SINCE ${begin_time} UNTIL ${end_time} `
    clauses.compare = ` COMPARE WITH ${diff} MINUTES AGO `
  } else {
    clauses.since = ` SINCE 60 MINUTES AGO `
    clauses.compare = ` COMPARE WITH 60 MINUTES AGO `
  }

  return clauses
}

export const formatForDisplay = timeRange => {
  const { begin_time, end_time, duration } = timeRange

  if (duration) {
    dayjs.extend(relativeTime)
    const formatted = dayjs().to(dayjs().subtract(duration, 'ms'))
    return `Since ${formatted}`
  } else if (begin_time && end_time) {
    return `Since ${dayjs(begin_time).format('MMM DD hh:mm')} Until ${dayjs(
      end_time
    ).format('MMM DD hh:mm')}`
  } else {
    return 'Since 60 minutes ago'
  }
}
