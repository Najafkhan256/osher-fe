import React from 'react';

const ThemeCategory = ({ category, current, setCategory }) => {
  return (
    <div
      className={
        category === current ? 'theme-category active-theme' : 'theme-category'
      }
      onClick={() => setCategory(category)}
    >
      {category}
    </div>
  );
};

export default ThemeCategory;
