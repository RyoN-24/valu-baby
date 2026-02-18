/* ============================================
   Order Confirmation Page JavaScript
   Payment instructions for Peru methods
   ============================================ */

class OrderConfirmation {
  constructor() {
    this.whatsappNumber = '51901440221';
    this.init();
  }

  init() {
    // Get payment method from URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentMethod = urlParams.get('payment') || 'yape';

    // Get order from localStorage
    const orderData = JSON.parse(localStorage.getItem('pending_order') || '{}');

    if (!orderData.customerName) {
      // No pending order, redirect to home
      window.location.href = 'index.html';
      return;
    }

    // Use the real order number from backend
    const orderNumber = orderData.orderNumber || 'N/A';
    document.getElementById('orderNumber').textContent = orderNumber;

    // Build full order object for display
    const fullOrder = {
      ...orderData,
      orderNumber,
      orderDate: orderData.orderDate || new Date().toISOString(),
      status: orderData.status || 'PENDING'
    };

    // Clear pending order from localStorage (order is already saved in backend DB)
    localStorage.removeItem('pending_order');

    // Render payment instructions
    this.renderPaymentInstructions(paymentMethod, fullOrder);

    // Render order summary
    this.renderOrderSummary(fullOrder);
  }



  renderPaymentInstructions(method, order) {
    const container = document.getElementById('paymentInstructions');
    const total = order.total.toFixed(2);

    const instructions = {
      yape: this.getYapeInstructions(total),
      plin: this.getPlinInstructions(total),
      transfer: this.getTransferInstructions(total),
      cod: this.getCODInstructions(total)
    };

    container.innerHTML = instructions[method] || instructions.yape;
  }

  getYapeInstructions(total) {
    const whatsappMsg = encodeURIComponent(
      `Hola! He realizado mi pedido en VALÚ Baby.\n` +
      `Adjunto comprobante de pago por Yape.\n` +
      `Monto: S/ ${total}`
    );

    return `
      <h2>Paga con Yape</h2>
      
      <div class="payment-qr">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">Escanea el código QR o envía a:</p>
        <div class="payment-number">901 440 221</div>
      </div>

      <ol class="payment-steps">
        <li>
          <strong>Escanea el QR</strong> o envía a <strong>901 440 221</strong>
        </li>
        <li>
          Monto exacto: <span class="payment-amount">S/ ${total}</span>
        </li>
        <li>
          <strong>Toma una captura</strong> de tu comprobante de pago
        </li>
        <li>
          <strong>Envíanos la captura</strong> por WhatsApp para confirmar tu pedido
        </li>
      </ol>

      <a href="https://wa.me/${this.whatsappNumber}?text=${whatsappMsg}" 
         class="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.963 11.963 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar Comprobante por WhatsApp
      </a>
    `;
  }

  getPlinInstructions(total) {
    const whatsappMsg = encodeURIComponent(
      `Hola! He realizado mi pedido en VALÚ Baby.\n` +
      `Adjunto comprobante de pago por Plin.\n` +
      `Monto: S/ ${total}`
    );

    return `
      <h2>Paga con Plin</h2>
      
      <div class="payment-qr">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">Escanea el código QR o envía a:</p>
        <div class="payment-number">901 440 221</div>
      </div>

      <ol class="payment-steps">
        <li>
          <strong>Abre tu app de Plin</strong> y selecciona "Enviar dinero"
        </li>
        <li>
          Monto exacto: <span class="payment-amount">S/ ${total}</span>
        </li>
        <li>
          <strong>Escanea el QR</strong> o ingresa el número <strong>901 440 221</strong>
        </li>
        <li>
          <strong>Envíanos tu comprobante</strong> por WhatsApp
        </li>
      </ol>

      <a href="https://wa.me/${this.whatsappNumber}?text=${whatsappMsg}" 
         class="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.963 11.963 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar Comprobante por WhatsApp
      </a>
    `;
  }

  getTransferInstructions(total) {
    const whatsappMsg = encodeURIComponent(
      `Hola! He realizado mi pedido en VALÚ Baby.\n` +
      `Adjunto voucher de transferencia bancaria.\n` +
      `Monto: S/ ${total}`
    );

    return `
      <h2>Transferencia Bancaria</h2>
      
      <div class="bank-details">
        <div class="bank-option">
          <h3>🏦 BBVA</h3>
          <p>Cuenta Soles:</p>
          <p><strong>0011-0253-0200-4420-47</strong></p>
        </div>
      </div>

      <ol class="payment-steps">
        <li>
          Titular: <strong>VALÚ BABY E.I.R.L.</strong>
        </li>
        <li>
          Monto exacto a depositar: <span class="payment-amount">S/ ${total}</span>
        </li>
        <li>
          <strong>Realiza la transferencia</strong> desde tu banco
        </li>
        <li>
          <strong>Envíanos tu voucher</strong> por WhatsApp
        </li>
      </ol>

      <a href="https://wa.me/${this.whatsappNumber}?text=${whatsappMsg}" 
         class="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.963 11.963 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar Voucher por WhatsApp
      </a>
    `;
  }

  getCODInstructions(total) {
    return `
      <h2>Pago Contraentrega 💵</h2>
      
      <div style="text-align: center; padding: 2rem; background: var(--blush-pale); border-radius: 8px; margin-bottom: 2rem;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">✅ Tu pedido fue registrado exitosamente</p>
        <p style="font-size: 1.5rem; font-weight: 600; color: var(--blush-deep); margin: 0;">
          Total a pagar: S/ ${total}
        </p>
      </div>

      <ol class="payment-steps">
        <li>
          Pagarás <strong>S/ ${total} en efectivo</strong> al recibir tu pedido
        </li>
        <li>
          Te contactaremos por <strong>WhatsApp</strong> para coordinar la entrega
        </li>
        <li>
          Recibirás tu pedido en <strong>24-48 horas</strong> (Lima Metropolitana)
        </li>
        <li>
          Verifica tu pedido antes de pagar al repartidor
        </li>
      </ol>

      <p style="text-align: center; color: var(--mid-gray); margin-top: 2rem;">
        📱 Nos comunicaremos contigo pronto
      </p>
    `;
  }

  renderOrderSummary(order) {
    const container = document.getElementById('orderSummaryDetails');

    container.innerHTML = `
      <div class="summary-section">
        <h3>Información de Contacto</h3>
        <p><strong>${order.customerName}</strong></p>
        <p>${order.customerEmail}</p>
        <p>${order.customerPhone}</p>
      </div>

      <div class="summary-section">
        <h3>Dirección de Envío</h3>
        <p>${order.shippingAddress.direccion}</p>
        <p>${order.shippingAddress.distrito}, ${order.shippingAddress.provincia}</p>
        <p>${order.shippingAddress.departamento}</p>
        ${order.shippingAddress.referencia ? `<p><em>Ref: ${order.shippingAddress.referencia}</em></p>` : ''}
      </div>

      <div class="summary-section">
        <h3>Productos (${order.items.length})</h3>
        ${order.items.map(item => `
          <p>${item.name} - Talla ${item.size} × ${item.quantity} = S/ ${(item.price * item.quantity).toFixed(2)}</p>
        `).join('')}
      </div>

      <div class="summary-section">
        <p>Subtotal: <strong>S/ ${order.subtotal.toFixed(2)}</strong></p>
        <p>Envío: <strong>S/ ${order.shipping.toFixed(2)}</strong></p>
        <p style="font-size: 1.1rem; margin-top: 0.5rem;">
          <strong>Total: S/ ${order.total.toFixed(2)}</strong>
        </p>
      </div>
    `;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new OrderConfirmation();
});
