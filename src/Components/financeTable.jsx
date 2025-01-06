import React from 'react';
// import { Link } from 'react-router-dom';
import moment from 'moment';

const FinanceTable = ({ data: financials, length, dateFromNow }) => {
  if (length) {
    financials = financials.slice(0, length);
  }
  let delay = 0.1;

  return (
    <table className=' orders-table'>
      <thead>
        <tr>
          <th className='hide-col'>Brand</th>
          <th className='hide-col'>Paid</th>
          <th className='hide-col'>Expiry</th>
          <th>Payment</th>
          {/* <th>Status</th>
                    <th></th> */}
        </tr>
      </thead>

      <tbody>
        {financials.map((o) => (
          <tr key={o._id} style={{ animationDelay: `${(delay += 0.1)}s` }}>
            <td className='hide-col'>
              <div className='cutomer'>
                <div
                  className='brand-table-pic'
                  style={{
                    marginRight: '10px',
                    backgroundImage: 'url(' + o.brandPic + ')',
                  }}
                ></div>
                <span className='hide-col'>{o.brandName}</span>
              </div>
            </td>
            <td className='hide-col purchased-col'>
              {dateFromNow
                ? moment(o.publishDate).fromNow()
                : moment(o.publishDate).format('lll')}
            </td>
            <td className='hide-col purchased-col'>
              {dateFromNow
                ? moment(o.expiryDate).fromNow()
                : moment(o.expiryDate).format('lll')}
            </td>
            <td>
              <span className='hide-col'>$</span>
              <b>{o.payment}</b>
            </td>
            <td className={'order-status '}>
              <div className=''>{o.orderStatus}</div>
            </td>
            {/* <td>
                        <Link to={`/dashboard/orders/order/${o._id}`}>
                          <button className='view-order'>View</button>
                        </Link>
                      </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FinanceTable;
