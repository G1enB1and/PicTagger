<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="static/css/styles.css">
    <link rel="stylesheet" href="static/css/pagination.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="icon" type="image/png" sizes="32x32" href="static/images/favicon.png">
    <title>PicTagger</title>
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="container">
        <div id="leftPanel" class="file-tree">
            <?php include 'fileTree.php'; ?>
            <div class="resizer" id="resizer-filetree"></div>
        </div>
        <div class="main-content">
            <?php include 'mainContent.php'; ?>
        </div>
        <div class="data-panel">
            <?php include 'dataPanel.php'; ?>
            <div class="resizer" id="resizer-datapanel"></div>
        </div>
    </div>
    <script src="static/js/script.js"></script>
    <script src="static/js/utils_pinterest.js" type="module"></script>
    <script src="static/js/dom_pinterest.js" type="module"></script>
    <script src="static/js/events_pinterest.js" type="module"></script>
    <script src="static/js/main_pinterest.js" type="module"></script>
</body>
</html>
