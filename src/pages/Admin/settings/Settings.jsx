import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CustomModal from "../../../components/CustomModal/CustomModal";
import "./Settings.scss";

const Settings = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name_en: "",
    name_ru: "",
    images: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [customModal, setCustomModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();
  const imageUrl =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const getCategories = () => {
    setLoading(true);
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/categories")
      .then((response) => {
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setCustomModal({
          isOpen: true,
          message: `Error: ${error.message}`,
          onConfirm: null,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/settings");
    getCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setModalOpen(false);
    const data = new FormData();
    data.append("name_en", formData.name_en);
    data.append("name_ru", formData.name_ru);
    if (formData.images) {
      data.append("images", formData.images);
    }

    const requestType = modalType === "add" ? "post" : "put";
    const requestUrl =
      modalType === "add"
        ? "https://autoapi.dezinfeksiyatashkent.uz/api/categories/"
        : `https://autoapi.dezinfeksiyatashkent.uz/api/categories/${selectedCategory.id}`;

    axios({
      method: requestType,
      url: requestUrl,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (modalType === "add") {
  
          setCategories((prevCategories) => [
            ...prevCategories,
            response.data.data,
          ]);
        } else {
        
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === selectedCategory.id
                ? { ...category, ...response.data.data }
                : category
            )
          );
        }

        setModalOpen(false);
        setFormData({ name_en: "", name_ru: "", images: null });
      })
      .catch((error) => {
        setModalOpen(false);
        setCustomModal({
          isOpen: true,
          message: `Error: ${error.message}`,
          onConfirm: null,
        });
      });
  };
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setModalOpen(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedCategory(item);
    setFormData({ name_en: item.name_en, name_ru: item.name_ru, images: null });
    setModalOpen(true);
    setModalType("edit");
  };

  const deleteCategory = (id) => {
    setCustomModal({
      isOpen: true,
      message: "Do you want to delete this category?",
      onConfirm: () => {
        setLoading(true);
        axios
          .delete(
            `https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          )
          .then(() => {
            setCategories((prevCategories) =>
              prevCategories.filter((category) => category.id !== id)
            );

            setCustomModal({ isOpen: false, message: "", onConfirm: null });
            setLoading(false);
          })
          .catch((error) => {
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

  const handleImageChange = (event) => {
    setFormData({ ...formData, images: event.target.files[0] });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredCategories = categories.filter(
    (item) =>
      item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name_ru.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="settings">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="add-button"
        onClick={() => {
          setModalOpen(true);
          setModalType("add");
          setSelectedCategory(null);
          setFormData({ name_en: "", name_ru: "", images: null });
        }}
      >
        Add Category
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>Name - ENG</th>
              <th>Name - RU</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((item) => (
              <tr key={item.id}>
                <td>{item.name_en}</td>
                <td>{item.name_ru}</td>
                <td>
                  <img
                    src={`${imageUrl}${item.image_src}`}
                    alt="Category"
                    className="category-image"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit-button"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteCategory(item.id)}
                    className="delete-button"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

      {modalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <h3 className="modal__title">Add Category</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name (EN):</label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name (RU):</label>
                <input
                  type="text"
                  name="name_ru"
                  value={formData.name_ru}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload Image:</label>
                <input
                  type="file"
                  name="images"
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.files[0] })
                  }
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
