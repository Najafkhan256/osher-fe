import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const BrandsTable = ({
  data: users,
  orders,
  customers,
  length,
  dateFromNow,
}) => {
  const { t } = useTranslation();

  if (length) {
    users = users.slice(0, length);
  }
  let delay = 0.1;

  const isActive = (date) => {
    if (new Date() - new Date(date) > -432000000)
      return (
        <span style={{ color: '#e20606', fontSize: '20px', lineHeight: '2px' }}>
          {' '}
          *
        </span>
      );
  };

  const calculateTotalOrders = (id) => {
    return orders.filter((o) => o.brandId === id).length;
  };

  const calculateTotalCustomers = (id) => {
    const myOrders = orders.filter((o) => o.brandId === id);

    let myCustomers = [];

    for (var i = 0; i < myOrders.length; i++) {
      if (i === 0) myCustomers.push(myOrders[i].userId);
      else if (myCustomers.indexOf(myOrders[i].userId) === -1)
        myCustomers.push(myOrders[i].userId);
    }

    let newCustomers = [];

    for (var x = 0; x < customers.length; x++) {
      for (var j = 0; j < myCustomers.length; j++)
        if (customers[x]._id === myCustomers[j])
          newCustomers.push(customers[x]);
    }

    return myCustomers.length;
  };

  return (
    <table className=' orders-table'>
      <thead>
        <tr>
          <th>{t('Brand')}</th>
          <th className='hide-col'>{t('Joined')}</th>
          <th className='hide-col'>{t('Expiry')}</th>
          <th className='hide-col'>{t('Orders')}</th>
          <th className='hide-col'>{t('Customers')}</th>
          <th className='hide-col'>{t('Status')}</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {users

          .filter((u) => u.isBrand)
          .reverse()
          .map((o) => (
            <tr key={o._id} style={{ animationDelay: `${(delay += 0.1)}s` }}>
              <td className=''>
                <div className='cutomer'>
                  <div
                    className='brand-table-pic'
                    style={{
                      marginRight: '10px',
                      backgroundImage: 'url(' + o.profilePic + ')',
                    }}
                  ></div>
                  <span className='brand-table-title'>{o.name}</span>
                </div>
              </td>
              <td className='hide-col purchased-col'>
                {dateFromNow
                  ? moment(o.publishDate).fromNow()
                  : moment(o.publishDate).format('lll')}
              </td>
              <td className='hide-col purchased-col'>
                {dateFromNow
                  ? moment(o.paymentExpiry).fromNow()
                  : moment(o.paymentExpiry).format('ll') +
                    ' - ' +
                    moment(o.paymentExpiry).fromNow()}
                {isActive(o.paymentExpiry)}
              </td>
              <td className='hide-col purchased-col'>
                {calculateTotalOrders(o._id)}
              </td>
              <td className='hide-col purchased-col'>
                {calculateTotalCustomers(o._id)}
              </td>
              {/* <td className='hide-col'>
                {o.isActive? "Active": 'Disabled'}
              </td> */}

              <td
                className={
                  o.isActive
                    ? 'hide-col brand-main-status active-brand'
                    : 'hide-col brand-main-status disabled-brand'
                }
              >
                <div className=''>{o.isActive ? 'Active' : 'Disabled'}</div>
              </td>

              <td>
                <Link to={`/dashboard/brands/brand/${o._id}`}>
                  <button className='view-order'>{t('View')}</button>
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default BrandsTable;
