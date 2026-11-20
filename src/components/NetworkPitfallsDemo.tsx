import { useEffect, useRef, useState } from "react"
import type { ProductDTO, RequestLogEntry } from "../types/shop.types"

const DEMO_IDS = [1, 2, 3, 4]

/**
 * Готовий інтерактивний стенд: 3 головні пастки Fetch API на одному екрані.
 * Ідеально для старту заняття за 10 хвилин перед Live-кодингом.
 */
export const NetworkPitfallsDemo = () => {
  const [logs, setLogs] = useState<RequestLogEntry[]>([])
  const [isBusy, setIsBusy] = useState(false)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loadedProduct, setLoadedProduct] = useState<ProductDTO | null>(null)
  const timersRef = useRef<number[]>([])

  const addLog = (status: RequestLogEntry["status"], message: string) => {
    const entry: RequestLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toLocaleTimeString("uk-UA"),
      status,
      message,
    }
    setLogs((prev) => [entry, ...prev].slice(0, 14))
  }

  // Пастка 1А: 404 без перевірки response.ok
  const handleTrap1WithoutOkCheck = async () => {
    setIsBusy(true)
    addLog("info", "Запит 404 БЕЗ перевірки response.ok...")

    try {
      const response = await fetch("https://fakestoreapi.com/wrong-endpoint-404")
      addLog(
        "error",
        `fetch НЕ впав у catch! Статус: ${response.status}, response.ok = ${String(response.ok)}`,
      )
      await response.json()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Невідома помилка"
      addLog("error", `У catch впав лише парсер JSON: ${message}`)
    } finally {
      setIsBusy(false)
    }
  }

  // Пастка 1Б: 404 з перевіркою response.ok
  const handleTrap1WithOkCheck = async () => {
    setIsBusy(true)
    addLog("info", "Запит 404 З перевіркою if (!response.ok)...")

    try {
      const response = await fetch("https://fakestoreapi.com/wrong-endpoint-404")
      if (!response.ok) {
        throw new Error(`HTTP помилка ${response.status}`)
      }
      await response.json()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Помилка"
      addLog("success", `Коректно перехоплено у catch: ${message}`)
    } finally {
      setIsBusy(false)
    }
  }

  // Пастка 2: Подвійне читання потоку response.json()
  const handleTrap2DoubleBodyRead = async () => {
    setIsBusy(true)
    addLog("info", "Спроба викликати response.json() двічі для однієї відповіді...")

    try {
      const response = await fetch("https://fakestoreapi.com/products/1")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const firstRead: ProductDTO = await response.json()
      addLog("success", `Перше читання успішне: "${firstRead.title}"`)

      // ❌ Друга спроба прочитати вже закритий потік ReadableStream
      await response.json()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Помилка потоку"
      addLog("error", `Друге читання впало з помилкою: ${message}`)
    } finally {
      setIsBusy(false)
    }
  }

  // Пастка 3: Race Condition та AbortController у useEffect
  useEffect(() => {
    if (selectedId === null) return

    const controller = new AbortController()

    const loadDetails = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${selectedId}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data: ProductDTO = await response.json()
        setLoadedProduct(data)
        addLog("success", `[RESOLVED] Отримано товар #${data.id}: ${data.title}`)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          addLog("abort", `[ABORTED] Запит для товару #${selectedId} скасовано!`)
          return
        }
        const message = err instanceof Error ? err.message : "Помилка"
        addLog("error", `[FAILED] Товар #${selectedId}: ${message}`)
      }
    }

    loadDetails()

    return () => {
      controller.abort()
    }
  }, [selectedId])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  const selectProductId = (id: number) => {
    addLog("info", `[START] Завантаження товару #${id}...`)
    setSelectedId(id)
  }

  const handleSimulateRapidClicks = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    timersRef.current = []

    DEMO_IDS.forEach((id, index) => {
      const timerId = window.setTimeout(() => {
        selectProductId(id)
      }, index * 60)
      timersRef.current.push(timerId)
    })
  }

  return (
    <div className="page-shell">
      <header className="card page-header">
        <div className="header-badges">
          <span className="badge badge--fetch">Стенд теорії (10 хв)</span>
          <span className="badge">3 головні підводні камені Fetch API</span>
        </div>
        <h1 className="page-title">Інтерактивний стенд пасток Fetch API</h1>
        <p className="page-subtitle">
          Натискайте кнопки ліворуч та спостерігайте в реальному часі за журналом
          виконання мережевих запитів праворуч.
        </p>
      </header>

      <main className="dashboard-grid">
        <div className="stack">
          <section className="card stack" aria-labelledby="trap-1-title">
            <h2 id="trap-1-title" className="section-title">
              Пастка №1: Чому 404 — це не catch у Fetch
            </h2>
            <p className="field-hint">
              Fetch відхиляє проміс лише при обриві мережі, але не на HTTP 404/500.
            </p>
            <div className="toolbar">
              <button
                type="button"
                className="btn-warning"
                onClick={handleTrap1WithoutOkCheck}
                disabled={isBusy}
              >
                404 без response.ok
              </button>
              <button
                type="button"
                onClick={handleTrap1WithOkCheck}
                disabled={isBusy}
              >
                404 з if (!response.ok)
              </button>
            </div>
          </section>

          <section className="card stack" aria-labelledby="trap-2-title">
            <h2 id="trap-2-title" className="section-title">
              Пастка №2: Одноразовий потік ReadableStream
            </h2>
            <p className="field-hint">
              Тіло відповіді <code className="code-inline">response.json()</code> можна
              прочитати лише один раз.
            </p>
            <button
              type="button"
              className="btn-danger"
              onClick={handleTrap2DoubleBodyRead}
              disabled={isBusy}
            >
              Викликати response.json() двічі
            </button>
          </section>

          <section className="card stack" aria-labelledby="trap-3-title">
            <h2 id="trap-3-title" className="section-title">
              Пастка №3: Race Condition та AbortController
            </h2>
            <p className="field-hint">
              Запустіть швидку серію запитів, щоб побачити автоматичне скасування попередніх.
            </p>
            <div className="toolbar" role="group" aria-label="Швидке перемикання ID">
              {DEMO_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="btn-chip"
                  aria-pressed={selectedId === id}
                  onClick={() => selectProductId(id)}
                >
                  ID #{id}
                </button>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSimulateRapidClicks}
              >
                Серія швидких кліків 1 → 2 → 3 → 4
              </button>
            </div>

            {loadedProduct && (
              <div className="details-box">
                <p className="item-card__title">
                  Фінальний завантажений товар: #{loadedProduct.id} — {loadedProduct.title}
                </p>
                <span className="price-tag">${loadedProduct.price.toFixed(2)}</span>
              </div>
            )}
          </section>
        </div>

        <aside className="card stack" aria-labelledby="log-title">
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <h2 id="log-title" className="section-title" style={{ marginBottom: 0 }}>
              Журнал мережевих подій
            </h2>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setLogs([])}
              disabled={logs.length === 0}
            >
              Очистити лог
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="empty-state">
              Натисніть будь-яку демо-кнопку ліворуч, щоб побачити поведінку Fetch.
            </div>
          ) : (
            <ul className="log-list" aria-live="polite">
              {logs.map((entry) => (
                <li
                  key={entry.id}
                  className={`log-entry log-entry--${entry.status}`}
                >
                  [{entry.time}] {entry.message}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </div>
  )
}
