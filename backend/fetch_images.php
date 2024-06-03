<?php
function fetch_and_randomize_images($directory) {
    $images = [];
    $base_directory = realpath($directory);

    $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base_directory));

    foreach ($rii as $file) {
        if ($file->isDir()){ 
            continue;
        }
        if (in_array($file->getExtension(), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4'])) {
            $relative_path = str_replace($base_directory . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $images[] = $relative_path;
        }
    }

    // Randomize the list of image paths
    shuffle($images);

    // Write the randomized list of image paths to the images.json file
    file_put_contents('images.json', json_encode($images));
}

if (isset($argv[1])) {
    fetch_and_randomize_images($argv[1]);
} else {
    echo "Usage: php fetch_images.php <directory>";
}
?>
