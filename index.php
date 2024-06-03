<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="static/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <title>Website Layout</title>
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="container">
        <?php include 'fileTree.php'; ?>
        <?php include 'mainContent.php'; ?>
        <?php include 'dataPanel.php'; ?>
    </div>
    <script src="static/js/script.js"></script>
</body>
</html>
