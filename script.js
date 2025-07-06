// Get elements
var manualBtn = document.getElementById('manual-btn');
var apiBtn = document.getElementById('api-btn');
var manualForm = document.getElementById('manual-form');
var apiForm = document.getElementById('api-form');
var blogCardSection = document.getElementById('blog-card-section');
var savedBlogsList = document.getElementById('saved-blogs-list');
var mainInterface = document.getElementById('main-interface');
var animating = false;

// Clear the blog card section
function clearBlogCardSection() {
    blogCardSection.innerHTML = "";
}

// Simple sideways animation for interface
function animateTransition(direction, callback) {
    if (animating) return;
    animating = true;
    mainInterface.style.transition = "transform 0.7s, opacity 0.7s";
    if (direction === 'right') {
        mainInterface.style.transform = "rotateY(-90deg) scale(0.9)";
        mainInterface.style.opacity = "0";
    } else {
        mainInterface.style.transform = "rotateY(90deg) scale(0.9)";
        mainInterface.style.opacity = "0";
    }
    setTimeout(function() {
        if (callback) callback();
        mainInterface.style.transform = "rotateY(0deg) scale(1)";
        mainInterface.style.opacity = "1";
        setTimeout(function() {
            animating = false;
        }, 700);
    }, 700);
}

// Button click events with animation
manualBtn.onclick = function() {
    animateTransition('right', function() {
        manualForm.style.display = "block";
        apiForm.style.display = "none";
        clearBlogCardSection();
    });
};
apiBtn.onclick = function() {
    animateTransition('left', function() {
        manualForm.style.display = "none";
        apiForm.style.display = "block";
        clearBlogCardSection();
    });
};

// Manual form submit
manualForm.onsubmit = function(e) {
    e.preventDefault();
    var title = document.getElementById('manual-title').value;
    var desc = document.getElementById('manual-desc').value;
    showBlogCard(title, desc);
    manualForm.reset();
};

// API form submit
apiForm.onsubmit = function(e) {
    e.preventDefault();
    var searchTitle = document.getElementById('api-title').value;
    clearBlogCardSection();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var found = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].title.toLowerCase() === searchTitle.toLowerCase()) {
                    found = data[i];
                    break;
                }
            }
            if (found) {
                showBlogCard(found.title, found.body);
            } else {
                alert("Blog not found!");
            }
        } else {
            alert("Error fetching data!");
        }
    };
    xhr.onerror = function() {
        alert("Network error!");
    };
    xhr.send();
    apiForm.reset();
};

// Show a blog card with Save button
function showBlogCard(title, desc) {
    clearBlogCardSection();
    var card = document.createElement('div');
    card.className = "blog-card";
    var h3 = document.createElement('h3');
    h3.innerText = title;
    var p = document.createElement('p');
    p.innerText = desc;
    var actions = document.createElement('div');
    actions.className = "card-actions";
    var saveBtn = document.createElement('button');
    saveBtn.innerText = "Save";
    saveBtn.onclick = function() {
        saveBlog(title, desc);
        clearBlogCardSection();
    };
    actions.appendChild(saveBtn);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(actions);
    blogCardSection.appendChild(card);
}

// Save blog to localStorage and show in Saved Blogs
function saveBlog(title, desc) {
    var blogs = [];
    if (localStorage.getItem('blogs')) {
        blogs = JSON.parse(localStorage.getItem('blogs'));
    }
    var blog = {
        id: new Date().getTime(),
        title: title,
        description: desc
    };
    blogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(blogs));
    showSavedBlogs();
}

// Show all saved blogs
function showSavedBlogs() {
    savedBlogsList.innerHTML = "";
    var blogs = [];
    if (localStorage.getItem('blogs')) {
        blogs = JSON.parse(localStorage.getItem('blogs'));
    }
    for (var i = 0; i < blogs.length; i++) {
        var card = document.createElement('div');
        card.className = "blog-card";
        var h3 = document.createElement('h3');
        h3.innerText = blogs[i].title;
        var p = document.createElement('p');
        p.innerText = blogs[i].description;
        var actions = document.createElement('div');
        actions.className = "card-actions";
        // Edit button
        var editBtn = document.createElement('button');
        editBtn.innerText = "Edit";
        editBtn.onclick = (function(index) {
            return function() {
                editBlog(index);
            };
        })(i);
        // Delete button
        var delBtn = document.createElement('button');
        delBtn.innerText = "Delete";
        delBtn.onclick = (function(index) {
            return function() {
                deleteBlog(index);
            };
        })(i);
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(actions);
        savedBlogsList.appendChild(card);
    }
}

// Edit a saved blog
function editBlog(index) {
    var blogs = JSON.parse(localStorage.getItem('blogs'));
    var newTitle = prompt("Edit Title:", blogs[index].title);
    if (newTitle === null) return;
    var newDesc = prompt("Edit Description:", blogs[index].description);
    if (newDesc === null) return;
    blogs[index].title = newTitle;
    blogs[index].description = newDesc;
    localStorage.setItem('blogs', JSON.stringify(blogs));
    showSavedBlogs();
}

// Delete a saved blog
function deleteBlog(index) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    var blogs = JSON.parse(localStorage.getItem('blogs'));
    blogs.splice(index, 1);
    localStorage.setItem('blogs', JSON.stringify(blogs));
    showSavedBlogs();
}

// On page load
window.onload = function() {
    showSavedBlogs();
    manualForm.style.display = "none";
    apiForm.style.display = "none";
    mainInterface.style.transform = "rotateY(0deg) scale(1)";
    mainInterface.style.opacity = "1";
};
