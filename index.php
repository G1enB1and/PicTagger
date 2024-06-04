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
        <?php
        $showLeftPanel = true; // Default state

        // Check if the leftPanelToggle parameter is set
        if (isset($_GET['leftPanelToggle']) && $_GET['leftPanelToggle'] === 'hide') {
            $showLeftPanel = false;
        }

        if ($showLeftPanel) {
            echo '<div id="leftPanel" class="file-tree">';
            include 'fileTree.php';
            echo '<div class="resizer" id="resizer-filetree"></div>';
            echo '</div>';
        }

        $showDataPanel = true; // Default state

        // Check if the dataPanelToggle parameter is set
        if (isset($_GET['dataPanelToggle']) && $_GET['dataPanelToggle'] === 'hide') {
            $showDataPanel = false;
        }

        echo '<div class="main-content">';
        include 'mainContent.php';
        echo '</div>';

        if ($showDataPanel) {
            echo '<div class="data-panel">';
            include 'dataPanel.php';
            echo '<div class="resizer" id="resizer-datapanel"></div>';
            echo '</div>';
        }
        ?>
    </div>
    <script src="static/js/script.js"></script>
    <script src="static/js/utils_pinterest.js" type="module"></script>
    <script src="static/js/dom_pinterest.js" type="module"></script>
    <script src="static/js/events_pinterest.js" type="module"></script>
    <script src="static/js/main_pinterest.js" type="module"></script>
</body>
</html>
