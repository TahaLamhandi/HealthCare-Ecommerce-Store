<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez BioEkleel</title>
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
            padding: 40px 30px;
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
            font-size: 32px;
            font-weight: bold;
        }
        .header p {
            margin: 15px 0 0 0;
            font-size: 18px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            margin-bottom: 25px;
            color: #2d3748;
            font-weight: 600;
        }
        .welcome-message {
            font-size: 16px;
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 30px;
        }
        .features-section {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #22c55e;
            box-shadow: 0 2px 4px rgba(34, 197, 94, 0.1);
        }
        .features-section h3 {
            color: #2d3748;
            margin: 0 0 20px 0;
            font-size: 20px;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px 0;
        }
        .feature-item:last-child {
            margin-bottom: 0;
        }
        .feature-icon {
            width: 24px;
            height: 24px;
            margin-right: 15px;
            color: #22c55e;
            font-size: 20px;
        }
        .feature-text {
            color: #4a5568;
            font-size: 16px;
        }
        .cta-section {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }
        .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain2" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain2)"/></svg>');
            opacity: 0.2;
        }
        .cta-section > * {
            position: relative;
            z-index: 1;
        }
        .cta-section h3 {
            margin: 0 0 15px 0;
            font-size: 22px;
        }
        .cta-section p {
            margin: 0 0 20px 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .cta-button {
            display: inline-block;
            background-color: white;
            color: #22c55e;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .contact-info {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .contact-info h3 {
            color: #1e40af;
            margin: 0 0 20px 0;
            font-size: 18px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            color: #4a5568;
        }
        .contact-item:last-child {
            margin-bottom: 0;
        }
        .contact-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            color: #1e40af;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px;
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
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #22c55e;
            text-decoration: none;
            font-weight: 600;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 25px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 28px;
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
            <h1>🎉 Bienvenue chez BioEkleel!</h1>
            <p>Votre compte a été créé avec succès</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Bonjour {{ $user->name }},
            </div>

            <div class="welcome-message">
                <p>Nous sommes ravis de vous accueillir dans la famille BioEkleel! Votre compte a été créé avec succès et vous pouvez maintenant profiter de tous nos services.</p>
                
                <p>Chez BioEkleel, nous nous engageons à vous offrir les meilleurs produits naturels pour votre bien-être, avec une qualité exceptionnelle et un service client de premier plan.</p>
            </div>

            <!-- Features Section -->
            <div class="features-section">
                <h3>🌟 Ce que vous pouvez faire maintenant:</h3>
                <div class="feature-item">
                    <span class="feature-icon">🛍️</span>
                    <span class="feature-text">Parcourir notre catalogue de produits naturels de qualité</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">❤️</span>
                    <span class="feature-text">Ajouter vos produits préférés à vos favoris</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🛒</span>
                    <span class="feature-text">Passer des commandes facilement et rapidement</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span class="feature-text">Suivre vos commandes et gérer votre compte</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎁</span>
                    <span class="feature-text">Bénéficier de nos offres spéciales et promotions</span>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
                <h3>🚀 Commencez votre voyage avec nous!</h3>
                <p>Découvrez notre sélection de produits naturels soigneusement choisis pour votre bien-être</p>
                <a href="{{ url('/') }}" class="cta-button">Explorer nos produits</a>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>📞 Besoin d'aide?</h3>
                <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <span>Téléphone: 0653561000 (Service client 24/7)</span>
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

            <div class="welcome-message">
                <p>Merci de nous faire confiance pour votre bien-être naturel. Nous sommes là pour vous accompagner à chaque étape!</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>BioEkleel</strong> - Votre partenaire bien-être naturel</p>
            <div class="social-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
            </div>
            <p>© {{ date('Y') }} BioEkleel. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>

