import { useState, type FormEvent } from "react"
import type { ProductDTO } from "../types/shop.types"

/**
 * Live-кодинг №2: Ідентична вітрина магазину, але на базі Axios (src/api/shopAxiosClient.ts).
 * На уроці рефакторимо CRUD із ShopFetchLive на Axios та показуємо Interceptors.
 */
export const ShopAxiosLive = () => {
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

  // TODO (Live Axios — Крок 1): Імпортуйте getShopProducts з ../api/shopAxiosClient та отримайте товари
  const handleLoadProducts = async () => {
    setIsLoading(false)
    setError(null)
    setStatusMessage("TODO (Axios): Завантажте товари через getShopProducts()")
  }

  // TODO (Live Axios — Крок 2): Імпортуйте getShopProductById та отримайте деталі товару за ID
  const handleSelectProduct = async (id: number) => {
    setError(null)
    setSelectedProduct(null)
    setStatusMessage(`TODO (Axios): Завантажте деталі товару #${id} через getShopProductById()`)
  }

  // TODO (Live Axios — Крок 3): Імпортуйте createShopProduct та надішліть новий товар без JSON.stringify
  const handleCreateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(false)
    setError(null)
    setStatusMessage(`TODO (Axios): Створіть товар "${title || "Новий товар"}" через createShopProduct()`)
  }

  // TODO (Live Axios — Крок 4): Імпортуйте deleteShopProduct та видаліть товар
  const handleDeleteProduct = async (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
    setStatusMessage(`TODO (Axios): Видаліть товар #${id} через deleteShopProduct()`)
  }

  return (
    <div className="page-shell">
      <header className="card page-header">
        <div className="header-badges">
          <span className="badge badge--axios">Live Coding №2 · Axios Engine</span>
          <span className="badge">Instance + DTO + Interceptors</span>
        </div>
        <h1 className="page-title">Вітрина магазину (Axios Instance)</h1>
        <p className="page-subtitle">
          Крок 2 битви підходів: переносимо ту саму бізнес-логіку на{" "}
          <code className="code-inline">shopAxiosClient</code> та порівнюємо читабельність.
        </p>
      </header>

      <main className="dashboard-grid">
        <div className="stack">
          <section className="card stack" aria-labelledby="axios-shop-form">
            <h2 id="axios-shop-form" className="section-title">
              Додати товар у вітрину
            </h2>

            <form
              className="contact-form"
              aria-labelledby="axios-shop-form"
              onSubmit={handleCreateProduct}
            >
              <div className="form-field">
                <label htmlFor="axios-shop-title">Назва товару</label>
                <input
                  id="axios-shop-title"
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
                  <label htmlFor="axios-shop-price">Ціна (USD)</label>
                  <input
                    id="axios-shop-price"
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
                  <label htmlFor="axios-shop-category">Категорія</label>
                  <select
                    id="axios-shop-category"
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
                <label htmlFor="axios-shop-image">URL зображення</label>
                <input
                  id="axios-shop-image"
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
                {isSubmitting ? "Надсилання..." : "Додати товар (Axios POST)"}
              </button>
            </form>
          </section>

          <section className="card stack" aria-labelledby="axios-shop-list">
            <div className="toolbar" style={{ justifyContent: "space-between" }}>
              <h2 id="axios-shop-list" className="section-title" style={{ marginBottom: 0 }}>
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
                <span>Завантаження товарів через Axios...</span>
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
                Список порожній. Підключіть методи з{" "}
                <code className="code-inline">src/api/shopAxiosClient.ts</code>.
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

        <aside className="card stack" aria-labelledby="axios-shop-details">
          <h2 id="axios-shop-details" className="section-title">
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
              Оберіть товар у списку ліворуч, щоб отримати його деталі через Axios.
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
