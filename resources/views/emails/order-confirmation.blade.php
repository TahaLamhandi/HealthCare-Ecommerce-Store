<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de Commande - BioEkleel</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .header > * {
            position: relative;
            z-index: 1;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2d3748;
        }
        .order-info {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #22c55e;
            box-shadow: 0 2px 4px rgba(34, 197, 94, 0.1);
        }
        .order-info h3 {
            margin: 0 0 15px 0;
            color: #2d3748;
            font-size: 18px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        .info-label {
            font-weight: 600;
            color: #4a5568;
        }
        .info-value {
            color: #2d3748;
        }
        .products-section {
            margin: 25px 0;
        }
        .products-section h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .product-item {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid #e2e8f0;
        }
        .product-name {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 5px;
        }
        .product-details {
            color: #4a5568;
            font-size: 14px;
        }
        .total-section {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            position: relative;
            overflow: hidden;
        }
        .total-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain3" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain3)"/></svg>');
            opacity: 0.2;
        }
        .total-section > * {
            position: relative;
            z-index: 1;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .total-label {
            font-weight: 600;
        }
        .total-value {
            font-weight: bold;
        }
        .final-total {
            border-top: 2px solid rgba(255, 255, 255, 0.3);
            padding-top: 10px;
            margin-top: 10px;
            font-size: 18px;
        }
        .next-steps {
            background-color: #e6fffa;
            border: 1px solid #81e6d9;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .next-steps h3 {
            color: #234e52;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .next-steps p {
            margin: 0;
            color: #234e52;
        }
        .contact-info {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .contact-info h3 {
            color: #1e40af;
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .contact-item:last-child {
            margin-bottom: 0;
        }
        .contact-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            color: #1e40af;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer a {
            color: #22c55e;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 20px;
            }
            .info-row {
                flex-direction: column;
            }
            .info-value {
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div style="margin-bottom: 20px;">
                <img src="{{ url('images/logo.png') }}" alt="BioEkleel Logo" style="max-width: 120px; height: auto; filter: brightness(0) invert(1);">
            </div>
            <h1>✅ Commande Confirmée!</h1>
            <p>Merci pour votre confiance en BioEkleel</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Bonjour {{ $orderData['nom'] }},
            </div>

            <p>Nous avons bien reçu votre commande et nous vous remercions pour votre confiance en nos produits naturels de qualité.</p>

            <!-- Order Information -->
            <div class="order-info">
                <h3>📋 Détails de votre commande</h3>
                <div class="info-row">
                    <span class="info-label">Numéro de commande:</span>
                    <span class="info-value">#{{ date('YmdHis') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date de commande:</span>
                    <span class="info-value">{{ $orderData['date'] }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $orderData['email'] }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Téléphone:</span>
                    <span class="info-value">{{ $orderData['telephone'] }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Adresse de livraison:</span>
                    <span class="info-value">{{ $orderData['adresse'] }}</span>
                </div>
            </div>

            <!-- Products -->
            <div class="products-section">
                <h3>🛍️ Produits commandés</h3>
                @foreach($orderData['produits'] as $produit)
                <div class="product-item">
                    <div class="product-name">{{ $produit['nom'] }}</div>
                    <div class="product-details">
                        Prix: {{ number_format($produit['prix'], 2) }} DH | 
                        Quantité: {{ $produit['quantite'] }} | 
                        Total: {{ number_format($produit['total'], 2) }} DH
                    </div>
                </div>
                @endforeach
            </div>

            <!-- Total -->
            <div class="total-section">
                <div class="total-row">
                    <span class="total-label">Sous-total:</span>
                    <span class="total-value">{{ number_format($orderData['sousTotal'], 2) }} DH</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Frais de livraison:</span>
                    <span class="total-value">{{ number_format($orderData['livraison'], 2) }} DH</span>
                </div>
                <div class="total-row final-total">
                    <span class="total-label">Total à payer:</span>
                    <span class="total-value">{{ number_format($orderData['total'], 2) }} DH</span>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>📞 Prochaines étapes</h3>
                <p>Un de nos commerciaux vous contactera dans les plus brefs délais pour confirmer votre commande et organiser la livraison. Vous recevrez un appel au numéro {{ $orderData['telephone'] }}.</p>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>📞 Besoin d'aide?</h3>
                <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <span>Téléphone: 0653561000</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">✉️</span>
                    <span>Email: contact.bioekleel@gmail.com</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span>Adresse: Casablanca, Maroc</span>
                </div>
            </div>

            <p>Merci encore pour votre commande et votre confiance en BioEkleel!</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© {{ date('Y') }} BioEkleel - Produits naturels pour votre bien-être</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>

