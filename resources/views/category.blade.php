<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $category->name }} - BioEkleel</title>
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])
</head>
<body>
    <div id="app">
        <!-- This will be populated by React -->
    </div>
    
    <script>
        // Pass data to React
        window.pageData = {
            page: 'category',
            title: '{{ $category->name }}',
            category: @json($category),
            products: @json($products)
        };
    </script>
</body>
</html>
