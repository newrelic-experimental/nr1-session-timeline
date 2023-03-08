import React from 'react'
import { Spinner, Button, Icon, Stack, StackItem } from 'nr1'
import dayjs from 'dayjs'
import startCase from 'lodash.startcase'

export default class EventStream extends React.Component {
  state = {
    expandedTimelineItem: null,
  }

  handleTimelineItemClick = e => {
    e.preventDefault()
    const { expandedTimelineItem } = this.state

    let timelineItemId = e.currentTarget.getAttribute('data-timeline-item-id')
    if (timelineItemId == expandedTimelineItem) {
      this.setState({ expandedTimelineItem: null })
    } else {
      this.setState({ expandedTimelineItem: timelineItemId })
    }
  }

  buildStreamTimeline = event => {
    let timeline = Object.keys(event)
    timeline = timeline.sort()
    let data = []

    timeline.forEach((attr, i) => {
      if (!attr.startsWith('nr.') && event[attr]) {
        data.push(
          <li key={i} className="timeline-item-contents-item">
            <span className="key">{attr}</span>
            <span className="value">{event[attr]}</span>
          </li>
        )
      }
    })
    return data
  }

  getTitleDetails = event => {
    const {
      config: { eventTitleAttributes },
    } = this.props
    const title = eventTitleAttributes.find(
      attr => attr.name === event.eventType
    )

    if (title)
      return this.truncateTitle(
        event[title.primary] || event[title.secondary],
        title.truncateStart || false
      )
  }

  truncateTitle = (original, truncateStart) => {
    const maxLength = 60

    let truncated = original
    if (original?.length > maxLength) {
      if (truncateStart)
        truncated = '...' + original.slice(original.length - maxLength)
      else truncated = original.slice(0, maxLength) + '...'
    }

    return truncated
  }

  buildStreamEventWarningPanel = event => {
    const conditions = event['nr.warningConditions']
    return (
      <React.Fragment>
        <div className="warning-header">
          We found the following violations for this event:
        </div>
        <ul>
          {conditions.map((c, idx) => {
            return (
              <li key={idx} className="warning-condition">
                {c.attribute} &gt; {c.threshold}
                <span className="warning-condition__actual-value ">
                  [this event: {c.actual}]
                </span>
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    )
  }

  buildStream = (data, legend) => {
    const { showWarningsOnly } = this.props
    const sessionEvents = []

    data.forEach((event, i) => {
      const hasWarnings = event['nr.warnings']

      if (!showWarningsOnly || (showWarningsOnly && hasWarnings)) {
        let legendItem = null
        for (let item of legend) {
          if (item.group.actionNames.includes(event.eventAction)) {
            legendItem = item
            break
          }
        }
        if (!legendItem)
          legendItem = legend.find(item => item.group.name === 'GENERAL')

        const date = new Date(event.timestamp)
        let open =
          this.state.expandedTimelineItem == i ? 'timeline-item-expanded' : ''
        const streamTimeline = this.buildStreamTimeline(event)

        legendItem &&
          legendItem.visible &&
          sessionEvents.push(
            <div
              key={i}
              data-timeline-item-id={i}
              onClick={this.handleTimelineItemClick}
              className={`timeline-item ${legendItem.group.eventDisplay.class} ${open}`}
            >
              <div className="timeline-item-timestamp">
                <span className="timeline-timestamp-date">
                  {dayjs(date).format('MM/DD/YYYY')}
                </span>
                <span className="timeline-timestamp-time">
                  {dayjs(date).format('H:mm:ss.SSS')}
                </span>
              </div>
              <div className="timeline-item-dot"></div>
              <div
                className={
                  hasWarnings
                    ? 'timeline-item-body warning'
                    : 'timeline-item-body'
                }
              >
                <div className="timeline-item-body-header">
                  <div className="timeline-item-symbol">
                    <Icon
                      className="timeline-item-symbol-icon"
                      type={legendItem.group.eventDisplay.icon}
                      color={legendItem.group.eventDisplay.color}
                    ></Icon>
                  </div>
                  <div className="timeline-item-title">
                    {startCase(event.eventAction)}:{' '}
                    <span className="timeline-item-title-detail">
                      {this.getTitleDetails(event)}
                    </span>
                  </div>
                  <Button
                    className="timeline-item-dropdown-arrow"
                    type={Button.TYPE.PLAIN}
                    iconType={
                      Button.ICON_TYPE
                        .INTERFACE__CHEVRON__CHEVRON_BOTTOM__V_ALTERNATE
                    }
                  ></Button>
                </div>
                <div className="timeline-item-contents-container">
                  {hasWarnings && (
                    <div className="timeline-item-contents__warning-panel">
                      {this.buildStreamEventWarningPanel(event)}
                    </div>
                  )}
                  <ul className="timeline-item-contents">{streamTimeline}</ul>
                </div>
              </div>
            </div>
          )
      }
    })
    return sessionEvents
  }

  render() {
    const { data, loading, legend } = this.props

    const stream = this.buildStream(data, legend)

    const eventContent = loading ? (
      <Spinner />
    ) : !loading && stream.length > 0 ? (
      <div className="timeline-container">{stream}</div>
    ) : (
      <Stack
        fullWidth
        fullHeight
        className="emptyState eventStreamEmptyState"
        directionType={Stack.DIRECTION_TYPE.VERTICAL}
        horizontalType={Stack.HORIZONTAL_TYPE.CENTER}
        verticalType={Stack.VERTICAL_TYPE.CENTER}
      >
        <StackItem>
          <p className="emptyStateHeader">Event Stream data not available.</p>
        </StackItem>
      </Stack>
    )

    return (
      <div className="eventStreamSectionBase sessionSectionBase">
        {eventContent}
      </div>
    )
  }
}
