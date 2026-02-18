const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
};

const sendOrderConfirmation = async (order) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️ SendGrid API Key missing. Skipping email.');
        return;
    }

    const itemsList = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.product.name}</strong><br>
                <small>${item.size}</small>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">S/ ${formatCurrency(item.price)}</td>
        </tr>
    `).join('');

    const msg = {
        to: order.customerEmail,
        from: process.env.FROM_EMAIL, // Verified sender
        subject: `Confirmación de Orden #${order.orderNumber} - VALÚ Baby`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #eebbba;">¡Gracias por tu compra! 🌸</h1>
                <p>Hola ${order.customerName},</p>
                <p>Hemos recibido tu pedido correctamente. Aquí están los detalles:</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3>Orden #${order.orderNumber}</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${itemsList}
                    </table>
                    <p style="text-align: right; font-size: 1.2em;">
                        <strong>Total: S/ ${formatCurrency(order.total)}</strong>
                    </p>
                </div>

                <h3>Datos de Envío:</h3>
                <p>
                    ${order.shippingAddress.direccion}<br>
                    ${order.shippingAddress.distrito}, ${order.shippingAddress.provincia}<br>
                    ${order.shippingAddress.referencia ? `Ref: ${order.shippingAddress.referencia}` : ''}
                </p>

                <p>
                    <strong>Método de Pago:</strong> ${order.paymentMethod}<br>
                    Si elegiste transferencia o Yape/Plin, por favor envía el comprobante a nuestro WhatsApp.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="text-align: center; color: #888; font-size: 0.9em;">
                    VALÚ Baby - Ropa hermosa para momentos únicos
                </p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Order confirmation sent to ${order.customerEmail}`);
    } catch (error) {
        console.error('❌ Error sending confirmation email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

const sendAdminNotification = async (order) => {
    if (!process.env.SENDGRID_API_KEY) return;

    // Send to admin email (for now same as FROM_EMAIL or hardcoded)
    const adminEmail = process.env.FROM_EMAIL;

    const msg = {
        to: adminEmail,
        from: process.env.FROM_EMAIL,
        subject: `🔔 Nueva Venta: S/ ${formatCurrency(order.total)} (#${order.orderNumber})`,
        html: `
            <h2>¡Nueva venta en VALÚ Baby!</h2>
            <p><strong>Cliente:</strong> ${order.customerName} (${order.customerPhone})</p>
            <p><strong>Monto:</strong> S/ ${formatCurrency(order.total)}</p>
            <p><strong>Pago:</strong> ${order.paymentMethod}</p>
            <a href="${process.env.FRONTEND_URL}/admin.html" style="background: #eebbba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver en Dashboard</a>
        `
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Admin notification sent to ${adminEmail}`);
    } catch (error) {
        console.error('❌ Error sending admin notification:', error);
    }
};

module.exports = {
    sendOrderConfirmation,
    sendAdminNotification
};
