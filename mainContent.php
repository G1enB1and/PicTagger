<!-- Content for Main Section -->
<!-- dynamically changes based on $view parameter -->
<?php
$view = $_GET['view'] ?? 'gallery'; // Default to gallery if no view parameter is provided

if ($view === 'slideshow') {
    include 'slideshow.php';
} else {
    include 'gallery.php';
}
?>


