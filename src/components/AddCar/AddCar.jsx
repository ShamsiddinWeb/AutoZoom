import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../Modal/Modal"; // Import the Modal component
// import "./Cars.scss"; // Import the SCSS file

const AddCar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [city, setCity] = useState();
  const [category, setCategory] = useState();
  const [location, setLocation] = useState();
  const [mainImage, setMainImage] = useState(null);
  const [firstImage, setFirstImage] = useState(null);
  const [lastImage, setLastImage] = useState(null);
  const [load, setLoad] = useState(false);

  const [formData, setFormData] = useState({
    color: "",
    year: "",
    seconds: "",
    max_speed: "",
    max_people: "",
    transmission: "",
    motor: "",
    drive_side: "",
    petrol: "",
    limitperday: "",
    deposit: "",
    premium_protection: "",
    price_in_aed: "",
    price_in_usd: "",
    price_in_aed_sale: "",
    price_in_usd_sale: "",
    inclusive: false,
    brand_id: "",
    model_id: "",
    city_id: "",
    category_id: "",
    location_id: "",
  });

  // Fetch brand, model, city, and category options
  useEffect(() => {
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/brands")
      .then((res) => setBrand(res?.data?.data));
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/models")
      .then((res) => setModel(res?.data?.data));
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/cities")
      .then((res) => setCity(res?.data?.data));
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/locations")
      .then((res) => setLocation(res?.data?.data));
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/categories")
      .then((res) => setCategory(res?.data?.data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);
  const handleFirstImagesChange = (e) => setFirstImage(e.target.files[0]);
  const handleLastImagesChange = (e) => setLastImage(e.target.files[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoad(true);
    const formDataToSend = new FormData();

    const allowedFields = [
      "color",
      "year",
      "seconds",
      "max_speed",
      "max_people",
      "transmission",
      "motor",
      "drive_side",
      "petrol",
      "limitperday",
      "deposit",
      "premium_protection",
      "price_in_aed",
      "price_in_usd",
      "price_in_aed_sale",
      "price_in_usd_sale",
      "inclusive",
      "brand_id",
      "model_id",
      "city_id",
      "category_id",
      "location_id",
    ];

    Object.entries(formData).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        formDataToSend.append(key, value);
      }
    });

    if (mainImage) formDataToSend.append("cover", mainImage);
    if (firstImage) formDataToSend.append("images", firstImage);
    if (lastImage) formDataToSend.append("images", lastImage);

    const token = localStorage.getItem("access_token");

    axios
      .post(
        "https://autoapi.dezinfeksiyatashkent.uz/api/cars",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        toast.success(res?.data?.message);
        setShowModal(false);
        setLoad(false);
      })
      .catch((error) => {
        console.error("Error adding car: ", error);
        setLoad(false);
      });
  };

  return (
    <div className="car-page">
      <div className="header">
        <h2>Cars</h2>
        <button onClick={() => setShowModal(true)} className="add-car-button">
          + Add Car
        </button>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="form-grid">
          {
            [
              /* The form fields go here (color, year, etc.), similar to the example above */
            ]
          }
          <label className="input-label">
            Main Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="file-input"
            />
          </label>
          <label className="input-label">
            First Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleFirstImagesChange}
              className="file-input"
            />
          </label>
          <label className="input-label">
            Last Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleLastImagesChange}
              className="file-input"
            />
          </label>
          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" disabled={load} className="submit-button">
              {load ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddCar;
