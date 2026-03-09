"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core_flows_1 = require("@medusajs/medusa/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const BATCH_SIZE = 50;
async function run({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("🚀 NordHjem 商品导入开始");
    // --------------------------------------------------
    // 1️⃣ 读取转换后的 JSON
    // --------------------------------------------------
    const filePath = path_1.default.join(process.cwd(), "medusa-products.json");
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error("medusa-products.json 不存在，请先运行 transform-products.ts");
    }
    const products = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    logger.info(`📦 读取 ${products.length} 个商品`);
    // --------------------------------------------------
    // 2️⃣ 创建 Sales Channel
    // --------------------------------------------------
    const { result: salesChannels } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
        input: {
            salesChannelsData: [
                {
                    name: "Default Store",
                    description: "NordHjem Default Sales Channel",
                },
            ],
        },
    });
    const salesChannel = salesChannels[0];
    logger.info("✅ Sales Channel 创建完成");
    // --------------------------------------------------
    // 3️⃣ 创建 Stock Location
    // --------------------------------------------------
    const { result: stockLocations } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
        input: {
            locations: [
                {
                    name: "Default Warehouse",
                    address: {
                        address_1: "NordHjem Warehouse",
                        city: "Shanghai",
                        country_code: "cn",
                    },
                },
            ],
        },
    });
    const stockLocation = stockLocations[0];
    logger.info("✅ Stock Location 创建完成");
    // --------------------------------------------------
    // 4️⃣ 关联 Sales Channel 和 Stock Location
    // --------------------------------------------------
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: stockLocation.id,
            add: [salesChannel.id],
        },
    });
    logger.info("✅ Sales Channel 已关联到 Stock Location");
    // --------------------------------------------------
    // 5️⃣ 创建 Product Categories
    // --------------------------------------------------
    const uniqueCategories = [
        ...new Set(products.map((p) => p.collection)),
    ];
    const { result: categories } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: uniqueCategories.map((name) => ({
                name,
                is_active: true,
            })),
        },
    });
    const categoryMap = new Map();
    categories.forEach((c) => {
        categoryMap.set(c.name, c.id);
    });
    logger.info("✅ 分类创建完成");
    // --------------------------------------------------
    // 6️⃣ 分批创建商品
    // --------------------------------------------------
    let processed = 0;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE);
        const productsToCreate = batch.map((p) => {
            const { collection, ...productData } = p;
            return {
                ...productData,
                category_ids: [categoryMap.get(collection)],
                sales_channels: [{ id: salesChannel.id }],
            };
        });
        await (0, core_flows_1.batchProductsWorkflow)(container).run({
            input: {
                create: productsToCreate,
                update: [],
            },
        });
        processed += batch.length;
        logger.info(`✅ 已创建 ${processed}/${products.length}`);
    }
    // --------------------------------------------------
    // 7️⃣ 批量查询 inventory_item
    // --------------------------------------------------
    logger.info("📦 批量查询 inventory_item...");
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id", "sku"],
    });
    const inventoryMap = new Map();
    inventoryItems.forEach((item) => {
        if (item.sku) {
            inventoryMap.set(item.sku, item.id);
        }
    });
    logger.info(`📦 inventory_item 数量: ${inventoryItems.length}`);
    // --------------------------------------------------
    // 8️⃣ 批量创建库存等级
    // --------------------------------------------------
    const inventoryLevels = [];
    for (const product of products) {
        for (const variant of product.variants) {
            const inventoryItemId = inventoryMap.get(variant.sku);
            if (inventoryItemId) {
                inventoryLevels.push({
                    location_id: stockLocation.id,
                    inventory_item_id: inventoryItemId,
                    stocked_quantity: 1000,
                });
            }
        }
    }
    await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
        input: {
            inventory_levels: inventoryLevels,
        },
    });
    logger.info("✅ 库存等级创建完成");
    logger.info("🎉 NordHjem 所有商品导入完成");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXByb2R1Y3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvaW1wb3J0LXByb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBaUJBLHNCQTJLQztBQTVMRCw0Q0FBbUI7QUFDbkIsZ0RBQXVCO0FBRXZCLDREQU9vQztBQUdwQyxxREFBcUU7QUFFckUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBRU4sS0FBSyxVQUFVLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUN2RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEUsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0lBRWpDLHFEQUFxRDtJQUNyRCxrQkFBa0I7SUFDbEIscURBQXFEO0lBQ3JELE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUE7SUFFakUsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUE7SUFDeEUsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUUvRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0sTUFBTSxDQUFDLENBQUE7SUFFM0MscURBQXFEO0lBQ3JELHVCQUF1QjtJQUN2QixxREFBcUQ7SUFDckQsTUFBTSxFQUFFLE1BQU0s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