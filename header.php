<div class="header">
    <img src="static/images/logoIcon.png" alt="Logo" class="logo">
    <span class="pic-tagger">PicTagger</span>
    <a href="index.php?leftPanelToggle=toggle" id="file-tree-icon"> 
        <i class="fa-solid fa-folder-tree" alt="Close file tree"></i>
    </a>
    <div class="search-container">
        <input type="text" class="search-bar" placeholder="Search...">
        <button class="filter-button">Filter</button>
    </div>
    <a href="index.php?view=gallery"> <!-- Updated to load gallery.php into mainContent.php using $view parameter -->
        <img src="static/images/galleryLightMode.png" alt="Gallery" class="gallery-button">
    </a>
    <a href="index.php?dataPanelToggle=toggle" id="hamburger-icon">
        <i class="fas fa-bars hamburger-icon"></i>
    </a>
    <i class="fas fa-cog settings-icon"></i>
</div>
