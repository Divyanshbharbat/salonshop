import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const categoryIcons = {
  'Hair Care': '💇',
  'Skin Care': '💅',
  'Tools': '🔧',
  'Furniture': '🪑',
  'Makeup': '💄',
  'Nails': '💅',
  'Spa': '🧖',
  'Grooming': '🧔'
};

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/category/${category.name}`);
  };

  const icon = categoryIcons[category.name] || '📦';

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <div className="category-icon-circle">{icon}</div>
      <h3 className="category-name">{category.name}</h3>
    </div>
  );
}
