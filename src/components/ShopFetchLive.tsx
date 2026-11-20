import { useState, type FormEvent } from "react"
import type { ProductDTO } from "../types/shop.types"

/**
 * Live-кодинг №1: Магазин на чистому Fetch API.
 * На уроці реалізуємо GET списку, GET деталей (з AbortController), POST та DELETE,
 * щоб студенти побачили обсяг коду нативного Fetch перед рефакторингом у ShopAxiosLive.
 */
export const ShopFetchLive = () => {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("120.00")
  const [category, setCategory] = useState("electronics")
  const [image, setImage] = useState("https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg")

  // TODO (Live Fetch — Крок 1): Завантажити товари через fetch("https://fakestoreapi.com/products?limit=6")
  // Не забудьте перевірити if (!response.ok) throw new Error(...) та викликати await response.json()
  const handleLoadProducts = async () => {
    setIsLoading(false)
    setError(null)
    setStatusMessage("TODO (Fetch): Реалізуйте GET /products?limit=6")
  }

  // TODO (Live Fetch — Крок 2): Отримати деталі одного товару GET /products/:id з AbortController
  const handleSelectProduct = async (id: number) => {
    setError(null)
    setSelectedProduct(null)
    setStatusMessage(`TODO (Fetch): Реалізуйте GET /products/${id} (деталі товару)`)
  }

  // TODO (Live Fetch — Крок 3): Створити товар через POST /products + headers + JSON.stringify
  const handleCreateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(false)
    setError(null)
    setStatusMessage(`TODO (Fetch): Реалізуйте POST /products для "${title || "Новий товар"}"`)
  }

  // TODO (Live Fetch — Крок 4): Видалити товар через DELETE /products/:id та оновити state
  const handleDeleteProduct = async (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
    setStatusMessage(`TODO (Fetch): Виконайте DELETE /products/${id}`)
  }

  return (
    <div className="page-shell">
      <header className="card page-header">
        <div className="header-badges">
          <span className="badge badge--fetch">Live Coding №1 · Fetch Engine</span>
          <span className="badge">FakeStoreAPI · GET / POST / DELETE</span>
        </div>
        <h1 className="page-title">Вітрина магазину (Чистий Fetch API)</h1>
        <p className="page-subtitle">
          Крок 1 битви підходів: пишемо повний CRUD на вбудованому{" "}
          <code className="code-inline">fetch()</code>.
        </p>
      </header>

      <main className="dashboard-grid">
        <div className="stack">
          <section className="card stack" aria-labelledby="fetch-shop-form">
            <h2 id="fetch-shop-form" className="section-title">
              Додати товар у вітрину
            </h2>

            <form
              className="contact-form"
              aria-labelledby="fetch-shop-form"
              onSubmit={handleCreateProduct}
            >
              <div className="form-field">
                <label htmlFor="fetch-shop-title">Назва товару</label>
                <input
                  id="fetch-shop-title"
                  name="title"
                  type="text"
                  required
                  placeholder="Ігрова мишка"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="fetch-shop-price">Ціна (USD)</label>
                  <input
                    id="fetch-shop-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="fetch-shop-category">Категорія</label>
                  <select
                    id="fetch-shop-category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="electronics">electronics</option>
                    <option value="jewelery">jewelery</option>
                    <option value="men's clothing">men&apos;s clothing</option>
                    <option value="women's clothing">women&apos;s clothing</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="fetch-shop-image">URL зображення</label>
                <input
                  id="fetch-shop-image"
                  name="image"
                  type="url"
                  required
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Надсилання..." : "Додати товар (Fetch POST)"}
              </button>
            </form>
          </section>

          <section className="card stack" aria-labelledby="fetch-shop-list">
            <div className="toolbar" style={{ justifyContent: "space-between" }}>
              <h2 id="fetch-shop-list" className="section-title" style={{ marginBottom: 0 }}>
                Товари ({products.length})
              </h2>
              <button
                type="button"
                onClick={handleLoadProducts}
                disabled={isLoading}
              >
                Завантажити товари
              </button>
            </div>

            {isLoading && (
              <div className="loading-box">
                <span>Завантаження товарів...</span>
                <progress className="loading-bar" aria-label="Завантаження товарів" />
              </div>
            )}

            {statusMessage && (
              <div className="alert alert--info" role="status" aria-live="polite">
                {statusMessage}
              </div>
            )}

            {error && (
              <div className="alert alert--error" role="alert">
                {error}
              </div>
            )}

            {products.length === 0 ? (
              <div className="empty-state">
                Список порожній. Реалізуйте <code className="code-inline">handleLoadProducts</code>{" "}
                у файлі <code className="code-inline">ShopFetchLive.tsx</code>.
              </div>
            ) : (
              <ul className="item-list">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className={`item-card ${selectedProduct?.id === product.id ? "item-card--selected" : ""}`}
                  >
                    <div className="item-card__main">
                      <p className="item-card__title">{product.title}</p>
                      <p className="item-card__meta">
                        {product.category} · ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="item-card__actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleSelectProduct(product.id)}
                      >
                        Деталі
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="card stack" aria-labelledby="fetch-shop-details">
          <h2 id="fetch-shop-details" className="section-title">
            Детальна картка товару
          </h2>
          {selectedProduct ? (
            <article className="details-box">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="details-image"
              />
              <h3 className="sub-heading">{selectedProduct.title}</h3>
              <span className="price-tag">${selectedProduct.price.toFixed(2)}</span>
              <p className="item-card__meta">{selectedProduct.description}</p>
            </article>
          ) : (
            <div className="empty-state">
              Оберіть товар у списку ліворуч, щоб завантажити його деталі за ID.
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
