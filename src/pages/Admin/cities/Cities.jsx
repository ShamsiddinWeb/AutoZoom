import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Cities.scss'; 
import CustomModal from "../../../components/CustomModal/CustomModal"; 

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [customModal, setCustomModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();
  const urlimage = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dataSource = filteredCities.map((item, index) => ({
    key: item.id,
    number: index + 1,
    name: item.name,
    text: item.text,
    images: <img style={{ width: "100px" }} src={`${urlimage}${item.image_src}`} alt={item.name} />,
    action: (
      <>
        <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>
          Edit
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => handleDelete(item.id)}
        >
          Delete
        </button>
      </>
    ),
  }));

  const getData = () => {
    setLoading(true);
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/cities")
      .then((response) => {
        setCities(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting cities.", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/cities");
    getData();
  }, []);

  const handleEdit = (item) => {
    setSelectedCity(item);
    setVisible(true);
  };

  const handleDelete = (id) => {
    setCustomModal({
      isOpen: true,
      message: "Are you sure you want to delete this city?",
      onConfirm: () => {
        setLoading(true);
        axios
          .delete(
            `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          )
          .then(() => {
            setCities((prevCities) => prevCities.filter((city) => city.id !== id));
       
            setCustomModal({ isOpen: false, message: "", onConfirm: null });
            setLoading(false);
          })
          .catch((error) => {
            setErrorMessage(`Error: ${error.message}`);
            setCustomModal({
              isOpen: true,
              message: `Error: ${error.message}`,
              onConfirm: null,
            });
            setLoading(false);
          });
      },
    });
  };

  const handleAdd = () => {
    setSelectedCity({
      name: '',
      text: '',
      images: null
    });
    setVisible(true); 
    setErrorMessage(""); 
  };

  const handleOk = () => {
    const authToken = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("name", selectedCity.name);
    formData.append("text", selectedCity.text);
    if (selectedCity.images) {
      formData.append("images", selectedCity.images);
    }

    const url = selectedCity.id
      ? `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${selectedCity.id}`
      : "https://autoapi.dezinfeksiyatashkent.uz/api/cities";
    const method = selectedCity.id ? "PUT" : "POST";

    axios({
      url,
      method,
      data: formData,
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => {
      
        setVisible(false);
        getData();
      })
      .catch((error) => {
        setErrorMessage("Error adding/updating city.");
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="cities-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search City"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button className="add-btn" onClick={handleAdd}>
        Add City
      </button>

      
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Text</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSource.map((city) => (
              <tr key={city.key}>
                <td>{city.number}</td>
                <td>{city.name}</td>
                <td>{city.text}</td>
                <td>{city.images}</td>
                <td>{city.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomModal
        isOpen={customModal.isOpen}
        message={customModal.message}
        onClose={() => setCustomModal({ ...customModal, isOpen: false })}
        onConfirm={() => {
          if (customModal.onConfirm) customModal.onConfirm();
          setCustomModal({ ...customModal, isOpen: false });
        }}
        confirmButton={!!customModal.onConfirm}
      />

      {visible && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal__title">{selectedCity.id ? "Edit City" : "Add City"}</h2>
            <div className="form-container">
              <label>Name</label>
              <input
                type="text"
                value={selectedCity.name}
                onChange={(e) => setSelectedCity({ ...selectedCity, name: e.target.value })}
              />
              <label>Text</label>
              <textarea
                value={selectedCity.text}
                onChange={(e) => setSelectedCity({ ...selectedCity, text: e.target.value })}
              />
              <label>Image</label>
              <input
                type="file"
                onChange={(e) => setSelectedCity({ ...selectedCity, images: e.target.files[0] })}
                accept="image/jpeg, image/png"
              />
            </div>
            <button className="modal-btn" onClick={handleOk}>Save</button>
            <button className="modal-btns" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cities;
