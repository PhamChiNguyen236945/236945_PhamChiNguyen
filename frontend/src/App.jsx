import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

function App() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadFoods(keyword = "") {
    try {
      setLoading(true);
      setError("");

      const url = keyword.trim()
        ? `${API_URL}/api/foods?search=${encodeURIComponent(keyword.trim())}`
        : `${API_URL}/api/foods`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách món ăn");
      }

      const data = await response.json();
      setFoods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        foodId: form.foodId.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        cuisine: form.cuisine.trim(),
        ingredients: form.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };

      const url = editingId
        ? `${API_URL}/api/foods/${editingId}`
        : `${API_URL}/api/foods`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Thao tác thất bại");
      }

      setMessage(
        editingId ? "Cập nhật món ăn thành công" : "Thêm món ăn thành công",
      );

      resetForm();
      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(food) {
    setEditingId(food.foodId);

    setForm({
      foodId: food.foodId || "",
      name: food.name || "",
      category: food.category || "",
      cuisine: food.cuisine || "",
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : "",
      price: food.price ?? "",
      quantity: food.quantity ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(foodId) {
    if (!window.confirm(`Bạn có chắc muốn xóa món ${foodId}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/api/foods/${foodId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xóa món ăn thất bại");
      }

      setMessage("Xóa món ăn thành công");

      if (selectedFood?.foodId === foodId) {
        setSelectedFood(null);
      }

      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetail(foodId) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/foods/${foodId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không lấy được chi tiết món ăn");
      }

      setSelectedFood(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadFoods(search);
  }

  function clearSearch() {
    setSearch("");
    loadFoods("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Hệ thống quản lý món ăn</h1>
        <p>Phạm Chí Nguyên - MSSV 236945</p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn"}</h2>

          <form className="food-form" onSubmit={handleSubmit}>
            <input
              name="foodId"
              placeholder="Mã món ăn"
              value={form.foodId}
              onChange={handleChange}
              required
            />

            <input
              name="name"
              placeholder="Tên món ăn"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Loại món ăn"
              value={form.category}
              onChange={handleChange}
              required
            />

            <input
              name="cuisine"
              placeholder="Ẩm thực / vùng miền"
              value={form.cuisine}
              onChange={handleChange}
              required
            />

            <input
              name="ingredients"
              placeholder="Nguyên liệu, cách nhau bằng dấu phẩy"
              value={form.ingredients}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Giá bán"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              required
            />

            <input
              name="imageUrl"
              placeholder="Đường dẫn hình ảnh"
              value={form.imageUrl}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Mô tả món ăn"
              value={form.description}
              onChange={handleChange}
              required
            />

            <div className="form-actions">
              <button type="submit">
                {editingId ? "Cập nhật" : "Thêm món"}
              </button>

              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Hủy sửa
                </button>
              )}
            </div>
          </form>
        </section>

        {message && <div className="message success">{message}</div>}

        {error && <div className="message error">{error}</div>}

        <section className="panel">
          <div className="list-header">
            <h2>Danh sách món ăn</h2>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, loại hoặc vùng miền"
              />

              <button type="submit">Tìm kiếm</button>

              <button type="button" className="secondary" onClick={clearSearch}>
                Tất cả
              </button>
            </form>
          </div>

          {loading && <p className="loading">Đang tải dữ liệu...</p>}

          {!loading && foods.length === 0 && <p>Không tìm thấy món ăn.</p>}

          <div className="food-grid">
            {foods.map((food) => (
              <article className="food-card" key={food._id}>
                {food.imageUrl && (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="food-content">
                  <span className="food-id">{food.foodId}</span>

                  <h3>{food.name}</h3>

                  <p>
                    <strong>Loại:</strong> {food.category}
                  </p>

                  <p>
                    <strong>Ẩm thực:</strong> {food.cuisine}
                  </p>

                  <p>
                    <strong>Giá:</strong>{" "}
                    {Number(food.price).toLocaleString("vi-VN")}đ
                  </p>

                  <p>
                    <strong>Số lượng:</strong> {food.quantity}
                  </p>

                  <div className="card-actions">
                    <button onClick={() => handleViewDetail(food.foodId)}>
                      Chi tiết
                    </button>

                    <button className="edit" onClick={() => handleEdit(food)}>
                      Sửa
                    </button>

                    <button
                      className="danger"
                      onClick={() => handleDelete(food.foodId)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selectedFood && (
          <section className="panel">
            <h2>Chi tiết món ăn</h2>

            <p>
              <strong>Mã món:</strong> {selectedFood.foodId}
            </p>

            <p>
              <strong>Tên:</strong> {selectedFood.name}
            </p>

            <p>
              <strong>Loại:</strong> {selectedFood.category}
            </p>

            <p>
              <strong>Ẩm thực:</strong> {selectedFood.cuisine}
            </p>

            <p>
              <strong>Nguyên liệu:</strong>{" "}
              {selectedFood.ingredients?.join(", ")}
            </p>

            <p>
              <strong>Giá:</strong>{" "}
              {Number(selectedFood.price).toLocaleString("vi-VN")}đ
            </p>

            <p>
              <strong>Số lượng:</strong> {selectedFood.quantity}
            </p>

            <p>
              <strong>Mô tả:</strong> {selectedFood.description}
            </p>

            <button className="secondary" onClick={() => setSelectedFood(null)}>
              Đóng
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
