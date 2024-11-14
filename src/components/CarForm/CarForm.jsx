import React, { useState } from 'react';
import './CarForm.scss';

export default function CarsForm() {
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    model: '',
    location: '',
    city: '',
    color: '',
    year: '',
    seconds: '',
    speed: '',
    maxPeople: '',
    motor: '',
    transmission: '',
    limitPerDay: '',
    driveSide: '',
    fuel: '',
    deposit: '',
    protectionPrice: '',
    priceAED: '',
    priceUSD: '',
    priceUSD_odd: '',
    priceAED_odd: '',
    inclusive: false,
    carImages: null,
    mainImage: null,
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="form-container">
      <h3>Cars Qo'shish</h3>
      <form onSubmit={handleSubmit} className="car-form">
        {/* Dropdown and Text Inputs */}
        {[
          { label: 'Category', name: 'category', type: 'text' },
          { label: 'Brand', name: 'brand', type: 'text' },
          { label: 'Model', name: 'model', type: 'text' },
          { label: 'Location', name: 'location', type: 'text' },
          { label: 'City', name: 'city', type: 'text' },
          { label: 'Color', name: 'color', type: 'text' },
          { label: 'Year', name: 'year', type: 'number' },
          { label: 'Seconds', name: 'seconds', type: 'number' },
          { label: 'Speed', name: 'speed', type: 'number' },
          { label: 'Max People', name: 'maxPeople', type: 'number' },
          { label: 'Motor', name: 'motor', type: 'text' },
          { label: 'Transmission', name: 'transmission', type: 'text' },
          { label: 'Limit Per Day', name: 'limitPerDay', type: 'number' },
          { label: 'Drive Side', name: 'driveSide', type: 'text' },
          { label: 'Fuel', name: 'fuel', type: 'text' },
          { label: 'Deposit', name: 'deposit', type: 'number' },
          { label: 'Premium Protection Price', name: 'protectionPrice', type: 'number' },
          { label: 'Price in AED', name: 'priceAED', type: 'number' },
          { label: 'Price in USD', name: 'priceUSD', type: 'number' },
          { label: 'Price in USD (Otd)', name: 'priceUSD_odd', type: 'number' },
          { label: 'Price in AED (Otd)', name: 'priceAED_odd', type: 'number' },
        ].map((field, index) => (
          <div key={index} className="form-group">
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}

        {/* Toggle Switch */}
        <div className="form-group">
          <label>Inclusive</label>
          <input
            type="checkbox"
            name="inclusive"
            checked={formData.inclusive}
            onChange={handleInputChange}
          />
        </div>

        {/* File Uploads */}
        {[
          { label: 'Upload car images', name: 'carImages' },
          { label: 'Upload the main image', name: 'mainImage' },
          { label: 'Upload the cover image', name: 'coverImage' },
        ].map((field, index) => (
          <div key={index} className="form-group file-upload">
            <label>{field.label}</label>
            <input
              type="file"
              name={field.name}
              onChange={handleInputChange}
            />
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
}
