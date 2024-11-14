import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import "./models.scss";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal/CustomModal";
import not from "../../../assets/img/404.png";

const Models = () => {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [customModal, setCustomModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const getModels = () => {
    setLoading(true);
    axios
      .get("https://autoapi.dezinfeksiyatashkent.uz/api/models")
      .then((response) => {
        setModels(response.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

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
    if (!localStorage.getItem("authToken")) navigate("/models");
    getModels();
    getBrands();
  }, []);

  const handleAddOrEditModel = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url =
      modalType === "add"
        ? "https://autoapi.dezinfeksiyatashkent.uz/api/models"
        : `https://autoapi.dezinfeksiyatashkent.uz/api/models/${selectedModel.id}`;

    const method = modalType === "add" ? "post" : "put";
    setLoading(true);
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
        setModalOpen(false);
        toast.success(
          `Model ${modalType === "add" ? "created" : "updated"} successfully!`
        );
        getModels();
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (model) => {
    setSelectedModel(model);
    setModalType("edit");
    setModalOpen(true);
  };

  const deleteModel = (id) => {
    setCustomModal({
      isOpen: true,
      message: "Do you want to delete this model?",
      onConfirm: () => {
        setLoading(true);
        axios
          .delete(`https://autoapi.dezinfeksiyatashkent.uz/api/models/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then(() => {
            setModels((prevModels) =>
              prevModels.filter((model) => model.id !== id)
            );
            setCustomModal({ isOpen: false, message: "", onConfirm: null });
            setLoading(false);
            toast.success("Model deleted successfully!");
          })
          .catch((error) => {
            setCustomModal({
              isOpen: true,
              message: `Error: ${error.message}`,
              onConfirm: null,
            });
            setLoading(false);
            toast.error(error.message);
          });
      },
    });
  };

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="models-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search models..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={() => {
          setModalOpen(true);
          setModalType("add");
          setSelectedModel({ name: "", brand_id: "" });
        }}
        className="add-button"
      >
        Add Model
      </button>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {filteredModels.length > 0 ? (
            <table className="model-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id}>
                    <td>{model.name}</td>
                    <td>{model.brand_title}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(model)}
                        className="edit-button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteModel(model.id)}
                        className="delete-button"
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
              <img src={not} alt="No results" width={500} />
            </div>
          )}
        </>
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
              {modalType === "add" ? "Add Model" : "Edit Model"}
            </h3>
            <form onSubmit={handleAddOrEditModel}>
              <div className="form-group">
                <label>Model Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedModel?.name || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select
                  name="brand_id"
                  defaultValue={selectedModel?.brand_id || ""}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.title}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="save-button">
                Save
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

export default Models;
