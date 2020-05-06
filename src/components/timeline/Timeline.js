import React, { Component } from 'react'
import { Stack, StackItem, Spinner } from 'nr1'
import Gauge from '../gauge/Gauge'
import eventGroup from './EventGroup'

export default class Timeline extends Component {
  buildGauge(data) {
    const eventStream = []
    let prevEvent = null
    let startTime = null

    data.forEach(result => {
      if (!prevEvent) {
        prevEvent = result
        startTime = result.timestamp
      }

      const value = result.timestamp - prevEvent.timestamp
      const sessionGroup = eventGroup(prevEvent.eventAction)

      eventStream.push({
        label: sessionGroup.timelineDisplay.label,
        value: value > 0 ? value : 1,
        color: sessionGroup.timelineDisplay.color,
        timeSinceStart: this.getSecondsSinceStart(startTime, result.timestamp),
      })
      prevEvent = result
    })

    return eventStream
  }

  getSecondsSinceStart = (start, current) => {
    return (current - start) / 1000
  }

  render() {
    const { data, loading, legend, legendClick } = this.props

    const stream = this.buildGauge(data)

    const gaugeContent = loading ? (
      <Spinner />
    ) : !loading && stream.length > 0 ? (
      <Gauge
        data={stream}
        height={25}
        showLegend={true}
        legend={legend}
        legendClick={legendClick}
      />
    ) : (
      <Stack
        fullWidth
        className="emptyState timelineEmptyState"
        directionType={Stack.DIRECTION_TYPE.VERTICAL}
        verticalType={Stack.VERTICAL_TYPE.CENTER}
        horizontalType={Stack.HORIZONTAL_TYPE.CENTER}
      >
        <StackItem>
          <p className="emptyStateHeader">Could not load session timeline</p>
        </StackItem>
      </Stack>
    )

    return (
      <div>
        <Stack
          className="gaugeStack"
          directionType={Stack.DIRECTION_TYPE.VERTICAL}
        >
          <StackItem className="gaugeStackItem sessionSectionBase">
            {gaugeContent}
          </StackItem>
        </Stack>
      </div>
    )
  }
}
