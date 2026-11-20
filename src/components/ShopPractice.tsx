import { useState, type FormEvent } from "react"
import type { ReviewDTO } from "../types/shop.types"

const POST_FILTER_IDS = [1, 2, 3, 4, 5]

/**
 * Практичне завдання для студентів: Модерація відгуків товарів (JSONPlaceholder /comments).
 *
 * Базовий URL: https://jsonplaceholder.typicode.com
 *
 * Завдання:
 * 1. Створіть useEffect, який реагує на зміну selectedPostId та завантажує відгуки:
 *    GET /comments?postId=${selectedPostId}&_limit=5
 *    Обов'язково використайте AbortController (або AbortSignal в Axios), щоб при швидкому
 *    перемиканні фільтрів #1..#5 попередній запит скасовувався.
 * 2. Обробіть стани isLoading, error (перевіряючи response.ok у fetch або axios.isAxiosError у axios).
 * 3. Реалізуйте handleCreateReview(e): відправте POST /comments із полями
 *    { postId: selectedPostId, name, email, body }, очистіть форму та додайте новий відгук
 *    у початок масиву reviews.
 * 4. Реалізуйте handleDeleteReview(id): виконайте DELETE /comments/:id та видаліть відгук зі списку.
 */
export const ShopPractice = () => {
  const [selectedPostId, setSelectedPostId] = useState<number>(1)
  const [reviews, setReviews] = useState<ReviewDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [body, setBody] = useState("")

  const handleSelectPostFilter = (postId: number) => {
    setSelectedPostId(postId)
    setIsLoading(false)
    setError(null)
    setStatusMessage(
      `TODO 1–2: Завантажте GET /comments?postId=${postId}&_limit=5 у useEffect з AbortController`,
    )
  }

  const handleCreateReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO 3: Відправити POST /comments та додати відповідь сервера у початок reviews
    setStatusMessage(
      `TODO 3: Надішліть POST /comments від "${name || "Анонім"}" для товару #${selectedPostId}`,
    )
  }

  const handleDeleteReview = async (id: number) => {
    // TODO 4: Відправити DELETE /comments/:id та видалити відгук зі списку
    setReviews((prev) => prev.filter((item) => item.id !== id))
    setStatusMessage(`TODO 4: Виконайте DELETE /comments/${id}`)
  }

  return (
    <div className="page-shell">
      <header className="card page-header">
        <div className="header-badges">
          <span className="badge badge--practice">Практика студентів</span>
          <span className="badge">Фільтрація з AbortController + POST + DELETE</span>
        </div>
        <h1 className="page-title">Практика: Модерація відгуків товарів</h1>
        <p className="page-subtitle">
          Виконайте кроки TODO у файлі{" "}
          <code className="code-inline">src/components/ShopPractice.tsx</code>.
        </p>
      </header>

      <main className="dashboard-grid">
        <section className="card stack" aria-labelledby="review-form-title">
          <h2 id="review-form-title" className="section-title">
            Додати відгук до товару #{selectedPostId}
          </h2>
          <form
            className="contact-form"
            aria-labelledby="review-form-title"
            onSubmit={handleCreateReview}
          >
            <div className="form-field">
              <label htmlFor="review-author">Ім&apos;я або заголовок відгуку</label>
              <input
                id="review-author"
                name="name"
                type="text"
                required
                placeholder="Швидка доставка та гарна якість"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="review-email">Email автора</label>
              <input
                id="review-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="review-body">Текст відгуку</label>
              <textarea
                id="review-body"
                name="body"
                required
                placeholder="Напишіть враження про товар..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <button type="submit">Опублікувати відгук</button>
          </form>
        </section>

        <section className="card stack" aria-labelledby="review-list-title">
          <h2 id="review-list-title" className="section-title">
            Відгуки для товару #{selectedPostId} ({reviews.length})
          </h2>

          <div className="toolbar" role="group" aria-label="Фільтр товару за ID">
            {POST_FILTER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className="btn-chip"
                aria-pressed={selectedPostId === id}
                onClick={() => handleSelectPostFilter(id)}
              >
                Товар #{id}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="loading-box">
              <span>Завантаження відгуків...</span>
              <progress className="loading-bar" aria-label="Завантаження відгуків" />
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

          {reviews.length === 0 ? (
            <div className="empty-state">
              Відгуків ще не завантажено. Додайте <code className="code-inline">useEffect</code>{" "}
              для завантаження коментарів за <code className="code-inline">selectedPostId</code>.
            </div>
          ) : (
            <ul className="item-list">
              {reviews.map((review) => (
                <li key={review.id} className="item-card">
                  <div className="item-card__main">
                    <p className="item-card__title">{review.name}</p>
                    <p className="item-card__meta">{review.email}</p>
                    <p className="item-card__meta">{review.body}</p>
                  </div>
                  <div className="item-card__actions">
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
