import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Brand.scss";
import CustomModal from "../../../components/CustomModal/CustomModal";
import not from "../../../assets/img/brand__not.png";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState({ title: "" });
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();
  const imageUrl =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const [customModal, setCustomModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const getBrands = () => {
    setLoading(true);
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/brands")
      .then((response) => {
        setBrands(response.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/brands");
    getBrands();
  }, []);

  const handleAddOrEditBrand = () => {
    const formData = new FormData();
    formData.append("images", imageFile);
    formData.append("title", selectedBrand.title);

    const url =
      modalType === "add"
        ? "https://autoapi.dezinfeksiyatashkent.uz/api/brands/"
        : `https://autoapi.dezinfeksiyatashkent.uz/api/brands/${selectedBrand.id}`;
    const method = modalType === "add" ? "post" : "put";

    axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then(() => {
        getBrands();
        setModalOpen(false);
        toast.success(
          `Brand ${modalType === "add" ? "created" : "updated"} successfully!`
        );
        setSelectedBrand({ title: "" });
        setImageFile(null);
      })
      .catch((error) => {
        setCustomModal({
          isOpen: true,
          message: `Error: ${error.message}`,
          onConfirm: null,
        });
        setModalOpen(false);
        toast.error(error.message);
      });
  };

  const handleEdit = (item) => {
    setSelectedBrand({ id: item.id, title: item.title });
    setModalType("edit");
    setModalOpen(true);
  };

  const deleteBrand = (id) => {
    setCustomModal({
      isOpen: true,
      message: "Do you want to delete this brand?",
      onConfirm: () => {
        axios
          .delete(`https://autoapi.dezinfeksiyatashkent.uz/api/brands/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then(() => {
            setBrands((prevBrands) =>
              prevBrands.filter((brand) => brand.id !== id)
            );
            setCustomModal({ isOpen: false, message: "", onConfirm: null });
            toast.success("Brand deleted successfully!");
          })
          .catch((error) => {
            console.error(
              "Delete request failed:",
              error.response || error.message
            );
            setCustomModal({
              isOpen: true,
              message: `Error deleting brand: ${
                error.response?.data?.message || error.message
              }`,
              onConfirm: null,
            });
            toast.error(
              error.response?.data?.message || "Error deleting brand"
            );
          });
      },
    });
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const filteredBrands = brands.filter((brand) =>
    brand.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brand-container">
      <div className="brand__card">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => {
            setModalOpen(true);
            setModalType("add");
            setSelectedBrand({ title: "" });
          }}
          className="button add"
        >
          Add Brand
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filteredBrands.length > 0 ? (
        <table className="brand-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>
                  <img
                    src={`${imageUrl}${item.image_src}`}
                    alt="Brand Logo"
                    width="100"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="button edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteBrand(item.id)}
                    className="button delete"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-results">
          <br />
          <img src={not} alt="No results" width={500}/>
        </div>
      )}

      <ToastContainer />

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
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">
              {modalType === "add" ? "Add Brand" : "Edit Brand"}
            </h3>
            <div className="form-group">
              <label>Brand Name:</label>
              <input
                type="text"
                className="nima"
                value={selectedBrand.title}
                onChange={(e) =>
                  setSelectedBrand({ ...selectedBrand, title: e.target.value })
                }
                required
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <button onClick={handleAddOrEditBrand} className="submit-button">
              Save
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
