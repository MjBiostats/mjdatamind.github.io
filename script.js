function openTab(tabId) {
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    tabbuttons = document.getElementsByClassName("tab-button");

    // Hide all tab contents
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove 'active' class from all tab buttons
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // Show the clicked tab content and add 'active' class to the clicked button
    document.getElementById(tabId).style.display = "block";
    document.querySelector(`.tab-button[onclick="openTab('${tabId}')"]`).classList.add("active");
}

// Set default active tab
document.addEventListener("DOMContentLoaded", function() {
    openTab('home');
});
