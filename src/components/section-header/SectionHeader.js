import React from 'react'
import { HeadingText } from 'nr1'

const SectionHeader = ({ header, subheader }) => {
  return (
    <>
      <HeadingText className="section-header" type={HeadingText.TYPE.HEADING_4}>
        {header}
      </HeadingText>
      {subheader && (
        <HeadingText
          type={HeadingText.TYPE.HEADING_5}
          className="section-subheader"
        >
          {subheader}
        </HeadingText>
      )}
    </>
  )
}

export default SectionHeader
