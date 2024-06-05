<?php
header('Content-Type: application/json');

function get_file_tree($path) {
    $directory = new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS);
    $iterator = new RecursiveIteratorIterator($directory, RecursiveIteratorIterator::SELF_FIRST);
    $tree = [];

    foreach ($iterator as $file) {
        $path = $file->getPathname();
        $relativePath = str_replace('\\', '/', str_replace(realpath($path) . DIRECTORY_SEPARATOR, '', $path));
        if ($file->isDir()) {
            $tree[] = ['name' => $file->getFilename(), 'path' => $relativePath, 'type' => 'directory'];
        } else {
            $tree[] = ['name' => $file->getFilename(), 'path' => $relativePath, 'type' => 'file'];
        }
    }

    return $tree;
}

function initialize_images($directory) {
    if (!file_exists('images.json')) {
        exec("php backend/fetch_images.php " . escapeshellarg($directory));
    }
}

$action = $_GET['action'] ?? null;

switch ($action) {
    case 'get_images':
        initialize_images('Pictures'); // Initialize images if not already initialized
        $images_path = realpath('images.json');
        if (file_exists($images_path)) {
            $images = file_get_contents($images_path);
            echo $images;
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'File not found']);
        }
        break;
    case 'get_file_tree':
        $directory = realpath('Pictures'); // Adjust the path as necessary
        $file_tree = get_file_tree($directory);
        echo json_encode($file_tree);
        break;
    case 'update_images':
        $directory = $_POST['directory'] ?? null;
        if ($directory) {
            exec("php backend/fetch_images.php " . escapeshellarg($directory));
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing directory parameter']);
        }
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>
