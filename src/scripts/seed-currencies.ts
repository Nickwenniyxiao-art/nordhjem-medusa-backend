import { ExecArgs } from "@medusajs/framework/types"

type StoreRecord = {
  id: string
  supported_currencies?: { currency_code: string }[]
}

export default async function seedCurrencies({ container }: ExecArgs) {
  const logger = container.resolve("logger") as {
    info: (msg: string) => void
    warn: (msg: string) => void
    error: (msg: string) => void
  }

  logger.info("[seed-currencies] Starting currency configuration...")

  const targetCurrencies = ["usd", "eur", "gbp"]

  let storeModule: any

  try {
    storeModule = container.resolve("store")
  } catch (error: any) {
    logger.error(
      `[seed-currencies] Store Module unavailable: ${error?.message ?? "unknown error"}`
    )
    return
  }

  try {
    // Medusa v2 generally has a single default store; list defensively to support API shape variations.
    const listResult = await storeModule.listStores()

    const stores: StoreRecord[] = Array.isArray(listResult)
      ? Array.isArray(listResult[0])
        ? listResult[0]
        : listResult
      : []

    if (!stores.length) {
      logger.error("[seed-currencies] No store found. Skipping currency seed.")
      return
    }

    const store = stores[0]

    await storeModule.updateStores(store.id, {
      supported_currencies: targetCurrencies.map((currencyCode) => ({
        currency_code: currencyCode.toLowerCase(),
        is_default: currencyCode === "usd",
      })),
    })

    logger.info(
      `[seed-currencies] Store currencies updated: ${targetCurrencies.join(", ")}`
    )

    const updatedStore = (await storeModule.retrieveStore(store.id, {
      relations: ["supported_currencies"],
    })) as StoreRecord

    const currencyCodes =
      updatedStore.supported_currencies?.map((currency) => currency.currency_code) ?? []

    logger.info(`[seed-currencies] Verified currencies: ${currencyCodes.join(", ")}`)
    logger.info(
      "[seed-currencies] ✅ Currency seed complete. Stripe automatically supports all Medusa-configured currencies."
    )
  } catch (error: any) {
    logger.error(`[seed-currencies] Error: ${error?.message ?? "unknown error"}`)
    throw error
  }
}
