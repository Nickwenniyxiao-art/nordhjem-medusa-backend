"use strict";
// 📄 src/scripts/setup-regions.ts
//
// NordHjem - Medusa v2 Region / Shipping / Payment Provider 初始化脚本
// 运行方式：npx medusa exec ./src/scripts/setup-regions.ts
//
// 目标：
// 1) 创建 4 个 Region（全球）
// 2) 每个 Region 创建 1 个 Shipping Option（$9.99 / €9.99，满 $99 / €99 免运费）
// 3) 所有 Region 尝试绑定 Stripe 支付 Provider（pp_stripe_stripe）
//    - 若未安装 Stripe plugin，不让脚本失败：只 warn 并跳过绑定
//
// 重要说明：
// - Medusa 金额 amount 使用最小货币单位（例如 500 表示 $5.00）
// - cart.item_total 等 totals 在系统内也是最小货币单位（cents）整数，因此 price rule 的 value 也应使用 cents
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
// -----------------------------
// 1) 更新 Store 支持的货币（可选但强烈建议）
//    复用官方 seed.ts 风格：用 updateStoresStep 组一个小 workflow
// -----------------------------
const updateStoreCurrenciesWorkflow = (0, workflows_sdk_1.createWorkflow)("nordhjem-update-store-currencies", (input) => {
    const normalized = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return {
            selector: { id: data.input.store_id },
            update: {
                supported_currencies: data.input.supported_currencies.map((c) => ({
                    currency_code: c.currency_code,
                    is_default: c.is_default ?? false,
                })),
            },
        };
    });
    const stores = (0, core_flows_1.updateStoresStep)(normalized);
    return new workflows_sdk_1.WorkflowResponse(stores);
});
// -----------------------------
// 工具函数
// -----------------------------
const uniqLower = (codes) => {
    return Array.from(new Set((codes || [])
        .map((c) => (c || "").trim().toLowerCase())
        .filter(Boolean)));
};
async function run({ container }) {
    // 1. resolve Query 和 logger（与 import-products.ts 同风格）
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    // 模块服务（官方 seed.ts 也会这么用）
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    // ✅ 新增：Payment Module（用于检查 Stripe provider 是否存在）
    let paymentModuleService = null;
    try {
        paymentModuleService = container.resolve(utils_1.Modules.PAYMENT);
    }
    catch (e) {
        // 如果 Payment 模块未启用/未注册，这里会失败
        paymentModuleService = null;
    }
    // 固定 Provider IDs（按你的要求）
    const STRIPE_PROVIDER_ID = "pp_stripe_stripe";
    const FULFILLMENT_PROVIDER_ID = "manual_manual"; // 默认手动履约/运费 provider
    // ✅ 修正 1：金额单位使用 cents（最小货币单位）
    // $9.99 => 999
    const SHIPPING_PRICE = 999;
    // ✅ 修正 1（延伸）：免运费门槛也使用 cents
    // $99.00 => 9900
    // 依据：cart.item_total 等 totals 是整数（cents），price rule 比较的也是同一单位
    const FREE_SHIPPING_THRESHOLD = 9900;
    // 2. 读取 store（必须存在）
    const [store] = await storeModuleService.listStores();
    if (!store) {
        throw new Error("未找到 Store。请先完成 Medusa 初始化/迁移（migrations）再运行本脚本。");
    }
    // 3. 确保 Store 支持 USD / EUR（默认 USD）
    logger.info("Updating store supported currencies (usd, eur)...");
    await updateStoreCurrenciesWorkflow(container).run({
        input: {
            store_id: store.id,
            supported_currencies: [
                { currency_code: "usd", is_default: true },
                { currency_code: "eur" },
            ],
        },
    });
    // 4. 确保默认 Sales Channel 存在（用于库存/门店范围）
    logger.info("Ensuring default sales channel exists...");
    let defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannels.length) {
        const { result } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
            input: {
                // 官方 workflow key：salesChannelsData
                salesChannelsData: [{ name: "Default Sales Channel" }],
            },
        });
        defaultSalesChannels = result;
    }
    const defaultSalesChannel = defaultSalesChannels[0];
    // 5. 确保至少有一个 Stock Location（Shipping / Inventory 通常需要）
    logger.info("Ensuring stock location exists...");
    const STOCK_LOCATION_NAME = "NordHjem Warehouse";
    let stockLocation = null;
    try {
        const { data: stockLocations } = await query.graph({
            entity: "stock_location",
            fields: ["id", "name"],
        });
        stockLocation =
            stockLocations.find((l) => l.name === STOCK_LOCATION_NAME) ??
                stockLocations[0] ??
                null;
    }
    catch (e) {
        stockLocation = null;
    }
    if (!stockLocation) {
        const { result } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
            input: {
                // 官方 workflow key：locations
                locations: [
                    {
                        name: STOCK_LOCATION_NAME,
                        address: {
                            city: "Shanghai",
                            country_code: "cn",
                            address_1: "NordHjem Warehouse",
                        },
                    },
                ],
            },
        });
        stockLocation = result[0];
    }
    // 6. 绑定 Store 的默认 Sales Channel / 默认 Location（提升后台体验）
    logger.info("Updating store defaults (sales channel / location)...");
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: {
                default_sales_channel_id: defaultSalesChannel.id,
                default_location_id: stockLocation.id,
            },
        },
    });
    // 7. 关联 Sales Channel 和 Stock Location（inventory 范围）
    logger.info("Linking sales channel to stock location...");
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: stockLocation.id,
            add: [defaultSalesChannel.id],
        },
    });
    // 8. 关联 Stock Location 与 Fulfillment Provider（manual_manual）
    logger.info("Linking stock location to fulfillment provider...");
    try {
        await link.create({
            [utils_1.Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
            [utils_1.Modules.FULFILLMENT]: { fulfillment_provider_id: FULFILLMENT_PROVIDER_ID },
        });
    }
    catch (e) {
        // 重复执行时可能已存在 link，忽略
    }
    // 9. ✅ 修正 2：Stripe Provider 存在性检查（不存在则降级，不阻断脚本）
    let stripeAvailable = false;
    if (paymentModuleService?.listPaymentProviders) {
        try {
            const providers = await paymentModuleService.listPaymentProviders({
                id: [STRIPE_PROVIDER_ID],
            });
            stripeAvailable = Array.isArray(providers) && providers.length > 0;
        }
        catch (e) {
            stripeAvailable = false;
        }
    }
    if (!stripeAvailable) {
        logger.warn(`⚠️ Stripe payment provider not found (${STRIPE_PROVIDER_ID}). ` +
            `Will create regions WITHOUT binding Stripe. ` +
            `Install/enable Stripe plugin later, then re-run a linking script if needed.`);
    }
    else {
        logger.info(`✅ Stripe payment provider found: ${STRIPE_PROVIDER_ID}`);
    }
    // 10. 构建 Region 配置（前三个固定；ROW 自动补全"剩余国家"）
    const northAmerica = uniqLower(["us", "ca"]);
    const europe = uniqLower(["de", "fr", "gb", "it", "es", "nl", "se", "no", "dk", "fi"]);
    const asiaPacific = uniqLower(["cn", "jp", "kr", "au", "sg", "hk"]);
    const used = new Set([...northAmerica, ...europe, ...asiaPacific]);
    // Rest of World：尽量自动兜底 = 数据库内所有国家 - 已分配国家
    let restOfWorld = [];
    try {
        const { data: countries } = await query.graph({
            entity: "country",
            fields: ["iso_2"],
        });
        restOfWorld = uniqLower((countries || [])
            .map((c) => c.iso_2)
            .filter(Boolean)
            .filter((code) => !used.has(code.toLowerCase())));
    }
    catch (e) {
        logger.warn("无法通过 query.graph(entity: 'country') 拉取全部国家列表，将使用简化 Rest of World 国家集合。");
        restOfWorld = uniqLower([
            "br",
            "mx",
            "ar",
            "cl",
            "za",
            "eg",
            "ae",
            "sa",
            "tr",
            "in",
            "id",
            "my",
            "th",
            "vn",
            "ph",
            "nz",
            "il",
        ]).filter((c) => !used.has(c));
    }
    const regionConfigs = [
        { name: "North America", currency_code: "usd", countries: northAmerica },
        { name: "Europe", currency_code: "eur", countries: europe },
        { name: "Asia Pacific", currency_code: "usd", countries: asiaPacific },
        { name: "Rest of World", currency_code: "usd", countries: restOfWorld },
    ];
    // 11. 查询已有 Regions，避免重复创建（Region 名称通常是唯一的）
    logger.info("Ensuring regions exist...");
    const { data: existingRegions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code"],
    });
    const existingByName = new Map((existingRegions || []).map((r) => [r.name, r]));
    const regionsToCreate = regionConfigs
        .filter((r) => !existingByName.has(r.name))
        .map((r) => {
        const regionData = {
            name: r.name,
            currency_code: r.currency_code,
            countries: r.countries,
        };
        // ✅ 只有 Stripe provider 存在时才绑定，否则跳过（不失败）
        if (stripeAvailable) {
            regionData.payment_providers = [STRIPE_PROVIDER_ID];
        }
        return regionData;
    });
    if (regionsToCreate.length) {
        const { result } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
            input: {
                // 官方 key：regions
                regions: regionsToCreate,
            },
        });
        for (const r of result) {
            existingByName.set(r.name, r);
        }
    }
    else {
        logger.info("All regions already exist. Skipping region creation.");
    }
    // 12. 确保 Shipping Profile（default）存在
    logger.info("Ensuring default shipping profile exists...");
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        const { result } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
            input: {
                data: [
                    {
                        name: "Default Shipping Profile",
                        type: "default",
                    },
                ],
            },
        });
        shippingProfile = result[0];
    }
    // 13. 创建 Fulfillment Set + 4 个 Service Zones（每个 region 一个）
    logger.info("Creating fulfillment set & service zones...");
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "NordHjem Global Delivery",
        type: "shipping",
        service_zones: regionConfigs.map((r) => ({
            name: r.name,
            geo_zones: (r.countries || []).map((cc) => ({
                type: "country",
                country_code: cc,
            })),
        })),
    });
    // 14. 将 Fulfillment Set 关联到 Stock Location
    logger.info("Linking fulfillment set to stock location...");
    try {
        await link.create({
            [utils_1.Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
            [utils_1.Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
        });
    }
    catch (e) {
        // 重复执行时可能已存在 link，忽略
    }
    // 15. 为每个 Region 创建 1 个 Shipping Option（带免运费门槛）
    //     prices.amount 使用 cents；rules.value 使用 cents（与 cart.item_total 同单位）
    logger.info("Creating shipping options (one per region)...");
    // 拉取当前已有 shipping options，避免重复创建
    let existingShippingOptions = [];
    try {
        const { data } = await query.graph({
            entity: "shipping_option",
            fields: ["id", "name"],
        });
        existingShippingOptions = (data || []).map((o) => ({
            id: o.id,
            name: o.name,
        }));
    }
    catch (e) {
        existingShippingOptions = [];
    }
    const optionInputs = [];
    for (const rc of regionConfigs) {
        const region = existingByName.get(rc.name);
        if (!region) {
            throw new Error(`Region 未找到：${rc.name}（创建后应存在）`);
        }
        const serviceZone = (fulfillmentSet.service_zones || []).find((z) => z.name === rc.name);
        if (!serviceZone) {
            throw new Error(`Service Zone 未找到：${rc.name}`);
        }
        const optionName = `Standard Shipping - ${rc.name}`;
        const alreadyExists = existingShippingOptions.some((o) => o.name === optionName);
        if (alreadyExists) {
            logger.info(`Shipping option exists, skipping: ${optionName}`);
            continue;
        }
        optionInputs.push({
            name: optionName,
            price_type: "flat",
            provider_id: FULFILLMENT_PROVIDER_ID,
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
            type: {
                label: "Standard",
                description: "Standard shipping (2-3 days).",
                code: "standard",
            },
            prices: [
                // 默认运费：$9.99 / €9.99（cents）
                {
                    currency_code: rc.currency_code,
                    amount: SHIPPING_PRICE,
                    rules: [],
                },
                // 满 $99 / €99 免运费（item_total 为 cents，因此 value 也为 cents）
                {
                    currency_code: rc.currency_code,
                    amount: 0,
                    rules: [
                        {
                            attribute: "item_total",
                            operator: "gte",
                            value: FREE_SHIPPING_THRESHOLD,
                        },
                    ],
                },
            ],
            rules: [
                { attribute: "enabled_in_store", value: "true", operator: "eq" },
                { attribute: "is_return", value: "false", operator: "eq" },
            ],
        });
    }
    if (optionInputs.length) {
        await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
            // createShippingOptionsWorkflow 的 input 是数组
            input: optionInputs,
        });
    }
    else {
        logger.info("No new shipping options to create.");
    }
    logger.info("✅ setup-regions.ts completed successfully.");
    logger.info(`Regions: ${regionConfigs.map((r) => r.name).join(", ")} | Shipping price (cents): ${SHIPPING_PRICE} | Free shipping threshold (cents): ${FREE_SHIPPING_THRESHOLD} | Stripe bound: ${stripeAvailable ? "yes" : "no"}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NldHVwLXJlZ2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtDQUFrQztBQUNsQyxFQUFFO0FBQ0Ysa0VBQWtFO0FBQ2xFLHNEQUFzRDtBQUN0RCxFQUFFO0FBQ0YsTUFBTTtBQUNOLHVCQUF1QjtBQUN2QixxRUFBcUU7QUFDckUseURBQXlEO0FBQ3pELDhDQUE4QztBQUM5QyxFQUFFO0FBQ0YsUUFBUTtBQUNSLCtDQUErQztBQUMvQyxvRkFBb0Y7O0FBa0VwRixzQkFxWkM7QUFwZEQscURBQThFO0FBQzlFLDREQVNvQztBQUNwQyxxRUFJMEM7QUFFMUMsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QixzREFBc0Q7QUFDdEQsZ0NBQWdDO0FBQ2hDLE1BQU0sNkJBQTZCLEdBQUcsSUFBQSw4QkFBYyxFQUNsRCxrQ0FBa0MsRUFDbEMsQ0FBQyxLQUdBLEVBQUUsRUFBRTtJQUNILE1BQU0sVUFBVSxHQUFHLElBQUEseUJBQVMsRUFBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDL0MsT0FBTztZQUNMLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNyQyxNQUFNLEVBQUU7Z0JBQ04sb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2hFLGFBQWEsRUFBRSxDQUFDLENBQUMsYUFBYTtvQkFDOUIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksS0FBSztpQkFDbEMsQ0FBQyxDQUFDO2FBQ0o7U0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixNQUFNLE1BQU0sR0FBRyxJQUFBLDZCQUFnQixFQUFDLFVBQVUs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