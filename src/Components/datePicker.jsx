import React from 'react';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DatePicker = ({ dates, setDates }) => {
  return (
    <>
      <button
        className='choose-date-btn'
        type='button'
        data-toggle='collapse'
        data-target='#collapseExample'
        aria-expanded='false'
        aria-controls='collapseExample'
      >
        Choose Date
      </button>
      <p>
        <span className='datespan'>Start Date: </span>
        {moment(dates[0].startDate).format('ll')}
      </p>
      {dates[0].endDate && (
        <p>
          <span className='datespan'>End Date: </span>
          {moment(dates[0].endDate).format('ll')}
        </p>
      )}
      <div className='datepicker'>
        <div className='collapse' id='collapseExample'>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDates([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dates}
          />
        </div>
      </div>
    </>
  );
};

export default DatePicker;
