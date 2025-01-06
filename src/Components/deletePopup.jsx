import React from 'react';

const DeletePopUp = ({
  deleteRequestedProduct,
  handleDeletePopUP,
  handleDelete,
}) => {
  return (
    <React.Fragment>
      <div
        className='delete-popup-background'
        onClick={handleDeletePopUP}
      ></div>
      <div className='delete-pop-up'>
        <h5>Are you sure to delete this bundle?</h5>
        <br />
        <div className='inner-pop'>
          {/* <img src={deleteRequestedProduct.imageUrl} alt='pop' /> */}
          <div className='inner-pop-text'>
            <h2>
              <span className='gray-span'>Name: </span>
              {deleteRequestedProduct.name}
            </h2>
            <h2>
              <span className='gray-span'>Offers: </span>
              {deleteRequestedProduct.offers.length}
            </h2>
            <h2>
              <span className='gray-span'>Price: </span>$
              {deleteRequestedProduct.offers[0].price}
            </h2>
          </div>
        </div>
        <br />

        <button onClick={() => handleDelete(deleteRequestedProduct)}>
          Yes
        </button>
        <button onClick={handleDeletePopUP}>No</button>
      </div>
    </React.Fragment>
  );
};

export default DeletePopUp;
