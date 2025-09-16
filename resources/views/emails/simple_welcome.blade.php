<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue chez BioEcleel</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header { 
            background: #2c5530; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
        }
        .content { 
            padding: 30px; 
            background: #f9f9f9; 
            border-radius: 0 0 10px 10px;
        }
        .footer { 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            margin-top: 20px;
        }
        .button { 
            display: inline-block; 
            background: #2c5530; 
            color: white; 
            padding: 12px 25px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
        }
        .button:hover {
            background: #1e3a21;
        }
        h1 {
            margin: 0;
            font-size: 28px;
        }
        p {
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue chez BioEcleel!</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{ $user->name }}</strong>,</p>
            
            <p>Nous sommes ravis de vous accueillir dans notre communauté BioEcleel!</p>
            
            <p>Votre compte a été créé avec succès. Vous pouvez maintenant profiter de tous nos produits naturels et biologiques de qualité.</p>
            
            <p>Chez BioEcleel, nous nous engageons à vous offrir :</p>
            <ul>
                <li>Des produits 100% naturels et biologiques</li>
                <li>Une qualité exceptionnelle</li>
                <li>Un service client dédié</li>
                <li>Des conseils personnalisés pour votre bien-être</li>
            </ul>
            
            <p>Merci de nous faire confiance pour votre bien-être et celui de votre famille.</p>
            
            <p style="text-align: center;">
                <a href="http://localhost:8000" class="button">Découvrir nos produits</a>
            </p>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br>
            L'équipe BioEcleel</p>
        </div>
        <div class="footer">
            <p><strong>BioEcleel</strong> - Votre partenaire naturel pour une vie saine</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>





