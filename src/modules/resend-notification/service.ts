import { AbstractNotificationProviderService } from "@medusajs/framework/utils";
import { Resend } from "resend";
import { Logger } from "@medusajs/framework/types";

type ResendNotificationConfig = {
  apiKey: string;
  fromEmail: string;
  replyToEmail?: string;
};

type SendNotificationInput = {
  to: string;
  channel: string;
  template: string;
  data: Record<string, unknown>;
};

type SendNotificationResult = {
  id: string;
};

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend-notification";
  private resend: Resend;
  private fromEmail: string;
  private replyToEmail?: string;
  private logger: Logger;

  constructor(container: Record<string, unknown>, config: ResendNotificationConfig) {
    super();
    this.logger = container.logger as Logger;
    this.resend = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.replyToEmail = config.replyToEmail;
  }

  async send(notification: SendNotificationInput): Promise<SendNotificationResult> {
    if (notification.channel === "email") {
      const notifData = notification.data as Record<string, any>;
      const subject = notifData.subject || "NordHjem Notification";
      const html = this.generateHtml(notification.template, notifData);

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: notification.to,
        replyTo: this.replyToEmail,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend send failed: ${JSON.stringify(error)}`);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.info(`Email sent via Resend: ${data?.id}`);
      return { id: data?.id || "unknown" };
    }

    throw new Error(`Channel ${notification.channel} not supported`);
  }

  private generateHtml(template: string, data: Record<string, any>): string {
    switch (template) {
      case "order-confirmation":
        return this.orderConfirmationHtml(data);
      case "shipping-notification":
        return this.shippingNotificationHtml(data);
      case "password-reset":
        return this.passwordResetHtml(data);
      case "order-canceled":
        return this.orderCanceledHtml(data);
      case "return-requested":
        return this.returnRequestedHtml(data);
      case "return-received":
        return this.returnReceivedHtml(data);
      case "claim-created":
        return this.claimCreatedHtml(data);
      case "exchange-created":
        return this.exchangeCreatedHtml(data);
      case "refund-completed":
        return this.refundCompletedHtml(data);
      case "customer-welcome":
        return this.customerWelcomeHtml(data);
      case "abandoned-cart":
        return this.abandonedCartHtml(data);
      case "low-stock-alert":
        return data.html || "<p>Low stock alert — see details in data.</p>";
      case "data-erasure-confirm":
        return this.dataErasureConfirmHtml(data);
      default:
        return data.html || `<p>${JSON.stringify(data)}</p>`;
    }
  }

  private orderConfirmationHtml(data: Record<string, any>): string {
    const order = data.order || {};
    const items = (order.items || []) as any[];
    const address = order.shipping_address || {};
    const itemRows = items
      .map(
        (item: any) =>
          `<tr>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;">${item.title || ""}${item.variant_title ? ` - ${item.variant_title}` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity || 1}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:right;">$${(item.unit_price || 0).toFixed(2)}</td>
      </tr>`,
      )
      .join("");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">订单确认 | Order Confirmation</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>感谢您的订购！以下是您的订单详情：<br>Thank you for your order! Here are your order details:</p>
    <table style="width:100%;border-collapse:collapse;margin:15px 0;">
      <thead>
        <tr style="background:#f5f5f0;">
          <th style="padding:8px;text-align:left;">商品 Item</th>
          <th style="padding:8px;text-align:center;">数量 Qty</th>
          <th style="padding:8px;text-align:right;">价格 Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    ${
      address.address_1
        ? `<div style="margin-top:15px;padding:10px;background:#f5f5f0;border-radius:4px;">
      <strong>收货地址 Shipping Address:</strong><br>
      ${address.first_name || ""} ${address.last_name || ""}<br>
      ${address.address_1 || ""}${address.address_2 ? ", " + address.address_2 : ""}<br>
      ${address.city || ""}, ${address.province || ""} ${address.postal_code || ""}<br>
      ${(address.country_code || "").toUpperCase()}
    </div>`
        : ""
    }
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private shippingNotificationHtml(data: Record<string, any>): string {
    const order = data.order || {};
    const trackingNumber = data.trackingNumber || null;

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">发货通知 | Shipping Notification</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的订单已发货！<br>Your order has been shipped!</p>
    ${
      trackingNumber
        ? `<div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <strong>物流单号 Tracking Number:</strong><br>
      <span style="font-size:18px;font-family:monospace;">${trackingNumber}</span>
    </div>`
        : ""
    }
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private passwordResetHtml(data: Record<string, any>): string {
    const resetUrl = data.resetUrl || "#";

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">密码重置 | Password Reset</h2>
    <p>您请求了密码重置。请点击下方按钮设置新密码：<br>You requested a password reset. Click the button below to set a new password:</p>
    <div style="text-align:center;margin:25px 0;">
      <a href="${resetUrl}" style="display:inline-block;padding:12px 30px;background:#2C3E2D;color:#FAFAF8;text-decoration:none;border-radius:4px;font-weight:bold;">重置密码 Reset Password</a>
    </div>
    <p style="color:#999;font-size:12px;">如果按钮不起作用，请复制此链接到浏览器：<br>If the button doesn't work, copy this link:<br><a href="${resetUrl}" style="color:#2C3E2D;word-break:break-all;">${resetUrl}</a></p>
    <p style="color:#999;font-size:12px;">此链接有效期为 1 小时。如非本人操作，请忽略。<br>This link expires in 1 hour. Ignore if you didn't request this.</p>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
  </div>
</body>
</html>`;
  }

  private orderCanceledHtml(data: Record<string, any>): string {
    const order = data.order || {};
    const items = (order.items || []) as any[];
    const itemRows = items
      .map(
        (item: any) =>
          `<tr>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;">${item.title || ""}${item.variant_title ? ` - ${item.variant_title}` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity || 1}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:right;">$${(item.unit_price || 0).toFixed(2)}</td>
      </tr>`,
      )
      .join("");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">订单已取消 | Order Canceled</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的订单已被取消。如有已付款项，退款将在 5-10 个工作日内退回原支付方式。<br>Your order has been canceled. If payment was made, a refund will be processed within 5-10 business days.</p>
    <table style="width:100%;border-collapse:collapse;margin:15px 0;">
      <thead>
        <tr style="background:#f5f5f0;">
          <th style="padding:8px;text-align:left;">商品 Item</th>
          <th style="padding:8px;text-align:center;">数量 Qty</th>
          <th style="padding:8px;text-align:right;">价格 Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private returnRequestedHtml(data: Record<string, any>): string {
    const order = data.order || {};
    const returnId = data.returnId || "";

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">退货申请已确认 | Return Request Confirmed</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的退货申请已收到并确认。<br>Your return request has been received and confirmed.</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;">
      <strong>退货流程 Return Process:</strong>
      <ol style="margin:10px 0;padding-left:20px;color:#555;">
        <li>请将商品包装好，确保原包装完整<br>Pack the item securely in its original packaging</li>
        <li>使用退货运单寄回商品<br>Ship the item back using the return shipping label</li>
        <li>我们收到商品后将进行检查<br>We will inspect the item upon receipt</li>
        <li>检查通过后退款将在 5-10 个工作日内处理<br>Refund will be processed within 5-10 business days after inspection</li>
      </ol>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private returnReceivedHtml(data: Record<string, any>): string {
    const order = data.order || {};

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">退货已收到 | Return Received</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>我们已收到您的退货商品，正在进行检查。<br>We have received your returned item and it is being inspected.</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <p style="margin:0;font-size:16px;color:#2C3E2D;"><strong>退款处理中 | Refund in Progress</strong></p>
      <p style="margin:8px 0 0;color:#666;">退款将在 5-10 个工作日内退回原支付方式<br>Refund will be returned to your original payment method within 5-10 business days</p>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private claimCreatedHtml(data: Record<string, any>): string {
    const order = data.order || {};

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">索赔申请已确认 | Claim Confirmed</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的索赔申请已收到并确认，我们的客户服务团队正在处理。<br>Your claim request has been received and confirmed. Our team is now reviewing and processing it.</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <p style="margin:0;font-size:16px;color:#2C3E2D;"><strong>处理中 | Under Review</strong></p>
      <p style="margin:8px 0 0;color:#666;">我们将尽快通过邮件通知您后续进展<br>We will email you with updates as soon as possible</p>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private exchangeCreatedHtml(data: Record<string, any>): string {
    const order = data.order || {};

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">换货申请已确认 | Exchange Confirmed</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的换货申请已收到并确认，新商品将尽快发出。<br>Your exchange request has been received and confirmed. The replacement item will be shipped as soon as possible.</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <p style="margin:0;font-size:16px;color:#2C3E2D;"><strong>准备发货 | Preparing Shipment</strong></p>
      <p style="margin:8px 0 0;color:#666;">发货后您将收到包含追踪信息的邮件<br>You will receive a tracking email once the replacement ships</p>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private refundCompletedHtml(data: Record<string, any>): string {
    const order = data.order || {};

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">退款已完成 | Refund Completed</h2>
    <p>订单号 Order #${order.display_id || "N/A"}</p>
    <p>您的退款已完成，并已退回原支付方式。<br>Your refund has been completed and returned to your original payment method.</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <p style="margin:0;font-size:16px;color:#2C3E2D;"><strong>退款到账时间 | Refund Timeline</strong></p>
      <p style="margin:8px 0 0;color:#666;">通常将在 5-10 个工作日内到账<br>Funds typically appear within 5-10 business days</p>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private customerWelcomeHtml(data: Record<string, any>): string {
    const customer = data.customer || {};
    const firstName = data.firstName || customer.first_name || "";
    const greeting = firstName ? `${firstName}，` : "";

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">欢迎加入 NordHjem | Welcome to NordHjem</h2>
    <p>${greeting}感谢您注册 NordHjem 账户！<br>${firstName ? `Dear ${firstName}, ` : ""}Thank you for creating your NordHjem account!</p>
    <p>NordHjem 致力于为您带来精选北欧设计家居产品。作为会员，您将享受：<br>NordHjem is dedicated to bringing you curated Nordic design home products. As a member, you will enjoy:</p>
    <ul style="color:#555;line-height:1.8;">
      <li>新品优先通知 | Early access to new arrivals</li>
      <li>专属会员优惠 | Exclusive member discounts</li>
      <li>订单追踪与管理 | Order tracking and management</li>
    </ul>
    <div style="text-align:center;margin:25px 0;">
      <a href="${process.env.STOREFRONT_URL || "https://nordhjem.store"}" style="display:inline-block;padding:12px 30px;background:#2C3E2D;color:#FAFAF8;text-decoration:none;border-radius:4px;font-weight:bold;">开始购物 Start Shopping</a>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private dataErasureConfirmHtml(data: Record<string, any>): string {
    const confirmationToken = data.confirmation_token || "";

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">账户数据删除确认 | Data Erasure Confirmation</h2>
    <p>您请求删除您在 NordHjem 的所有个人数据。<br>You requested erasure of your personal data at NordHjem.</p>
    <p>如确认删除，请在 24 小时内使用以下确认码完成操作：<br>To confirm, use the following confirmation token within 24 hours:</p>
    <div style="margin:15px 0;padding:15px;background:#f5f5f0;border-radius:4px;text-align:center;">
      <strong>确认码 Confirmation Token:</strong><br>
      <span style="font-size:18px;font-family:monospace;word-break:break-all;">${confirmationToken}</span>
    </div>
    <p style="color:#666;">此操作不可逆。删除后，您的个人信息将被匿名化，但订单记录将保留（符合财务合规要求）。<br>This action is irreversible. Your personal information will be anonymized, while order records are retained for financial compliance.</p>
    <p style="color:#666;">如非本人操作，请忽略此邮件。<br>If this wasn't you, please ignore this email.</p>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
    <p>如有问题请回复此邮件 | Reply to this email for support</p>
  </div>
</body>
</html>`;
  }

  private abandonedCartHtml(data: Record<string, any>): string {
    const items = (data.items || []) as any[];
    const cartId = data.cartId || "";
    const itemList = items
      .map(
        (item: any) =>
          `<li style="padding:5px 0;">${item.title || item.variant?.title || "Item"}</li>`,
      )
      .join("");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#2C3E2D;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #2C3E2D;">
    <h1 style="margin:0;font-size:24px;color:#2C3E2D;">NordHjem</h1>
    <p style="margin:5px 0 0;color:#666;">Nordic Living, Timeless Design</p>
  </div>
  <div style="padding:20px 0;">
    <h2 style="color:#2C3E2D;">您的购物车还在等您 | Your Cart is Waiting</h2>
    <p>您的购物车中还有未完成的商品：<br>You still have items in your cart:</p>
    ${itemList ? `<ul style="color:#555;line-height:1.8;">${itemList}</ul>` : ""}
    <div style="text-align:center;margin:25px 0;">
      <a href="${process.env.STOREFRONT_URL || "https://nordhjem.store"}/cart" style="display:inline-block;padding:12px 30px;background:#2C3E2D;color:#FAFAF8;text-decoration:none;border-radius:4px;font-weight:bold;">完成购买 Complete Purchase</a>
    </div>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e5e5;color:#999;font-size:12px;">
    <p>NordHjem — 北欧生活，永恒设计</p>
  </div>
</body>
</html>`;
  }
}

export default ResendNotificationProviderService;
