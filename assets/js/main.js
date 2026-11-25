/*
	Paradigm Shift by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    default: ["1681px", null],
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Hack: Enable IE workarounds.
  if (browser.name == "ie") $body.addClass("is-ie");

  // Mobile?
  if (browser.mobile) $body.addClass("is-mobile");

  // Scrolly.
  $(".scrolly").scrolly({
    offset: 100,
  });

  // Polyfill: Object fit.
  if (!browser.canUse("object-fit")) {
    $(".image[data-position]").each(function () {
      var $this = $(this),
        $img = $this.children("img");

      // Apply img as background.
      $this
        .css("background-image", 'url("' + $img.attr("src") + '")')
        .css("background-position", $this.data("position"))
        .css("background-size", "cover")
        .css("background-repeat", "no-repeat");

      // Hide img.
      $img.css("opacity", "0");
    });

    $(".gallery > a").each(function () {
      var $this = $(this),
        $img = $this.children("img");

      // Apply img as background.
      $this
        .css("background-image", 'url("' + $img.attr("src") + '")')
        .css("background-position", "center")
        .css("background-size", "cover")
        .css("background-repeat", "no-repeat");

      // Hide img.
      $img.css("opacity", "0");
    });
  }

  // Gallery.
  $(".gallery")
    .on("click", "a", function (event) {
      var $a = $(this),
        $gallery = $a.parents(".gallery"),
        $modal = $gallery.children(".modal"),
        $modalImg = $modal.find("img"),
        href = $a.attr("href");

      // Not an image? Bail.
      if (!href.match(/\.(jpg|gif|png|mp4)$/)) return;

      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Locked? Bail.
      if ($modal[0]._locked) return;

      // Lock.
      $modal[0]._locked = true;

      // Set src.
      $modalImg.attr("src", href);

      // Set visible.
      $modal.addClass("visible");

      // Focus.
      $modal.focus();

      // Delay.
      setTimeout(function () {
        // Unlock.
        $modal[0]._locked = false;
      }, 600);
    })
    .on("click", ".modal", function (event) {
      var $modal = $(this),
        $modalImg = $modal.find("img");

      // Locked? Bail.
      if ($modal[0]._locked) return;

      // Already hidden? Bail.
      if (!$modal.hasClass("visible")) return;

      // Stop propagation.
      event.stopPropagation();

      // Lock.
      $modal[0]._locked = true;

      // Clear visible, loaded.
      $modal.removeClass("loaded");

      // Delay.
      setTimeout(function () {
        $modal.removeClass("visible");

        setTimeout(function () {
          // Clear src.
          $modalImg.attr("src", "");

          // Unlock.
          $modal[0]._locked = false;

          // Focus.
          $body.focus();
        }, 475);
      }, 125);
    })
    .on("keypress", ".modal", function (event) {
      var $modal = $(this);

      // Escape? Hide modal.
      if (event.keyCode == 27) $modal.trigger("click");
    })
    .on("mouseup mousedown mousemove", ".modal", function (event) {
      // Stop propagation.
      event.stopPropagation();
    })
    .prepend(
      '<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>',
    )
    .find("img")
    .on("load", function (event) {
      var $modalImg = $(this),
        $modal = $modalImg.parents(".modal");

      setTimeout(function () {
        // No longer visible? Bail.
        if (!$modal.hasClass("visible")) return;

        // Set loaded.
        $modal.addClass("loaded");
      }, 275);
    });
})(jQuery);

const form = document.getElementById("form");
const statusText = document.getElementById("formStatus");
const commentList = document.getElementById("ListComments");
const KEY = "saved";

function deleteComment(id, card) {
  card.remove();

  const comments = JSON.parse(localStorage.getItem(KEY)) || [];
  const updated = comments.filter((comment) => comment.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

function renderComment({ id, name, message, time }) {
  const card = document.createElement("div");
  card.style.padding = "1rem";
  card.style.marginBottom = "1rem";
  card.style.border = "1px solid #ddd";
  card.style.borderRadius = "6px";
  card.style.position = "relative";

  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.alignItems = "center";

  const infoGroup = document.createElement("div");

  const author = document.createElement("strong");
  author.textContent = name;

  const timeEl = document.createElement("small");
  timeEl.style.color = "#888";
  timeEl.style.marginLeft = "10px";
  timeEl.textContent =
    time ||
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  infoGroup.append(author, timeEl);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.style.background = "transparent";
  deleteBtn.style.border = "1px solid #ff4d4d";
  deleteBtn.style.color = "#ff4d4d";
  deleteBtn.style.borderRadius = "4px";
  deleteBtn.style.padding = "2px 8px";
  deleteBtn.style.fontSize = "0.75rem";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.lineHeight = "1.4";
  deleteBtn.style.height = "auto";

  deleteBtn.addEventListener("click", () => {
    deleteComment(id, card);
  });

  headerRow.append(infoGroup, deleteBtn);

  const messageEl = document.createElement("p");
  messageEl.style.margin = "0.5rem 0 0 0";
  messageEl.textContent = message;

  card.append(headerRow, messageEl);
  commentList.prepend(card);
}

function loadSavedComments() {
  const comments = JSON.parse(localStorage.getItem(KEY)) || [];
  comments.forEach(renderComment);
}

loadSavedComments();

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !message) return;

    statusText.textContent = "Sending...";

    const formData = new FormData(form);
    formData.append("access_key", "e41ee175-a68b-4eb4-aa63-12bff5c73c8b");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        statusText.textContent = "Message sent successfully!";

        const newComment = {
          id: Date.now(),
          name,
          message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        const existingComments = JSON.parse(localStorage.getItem(KEY)) || [];
        existingComments.push(newComment);
        localStorage.setItem(KEY, JSON.stringify(existingComments));

        renderComment(newComment);
        form.reset();
      } else {
        statusText.textContent =
          "Error: " + (result.message || "Failed to send.");
      }
    } catch (error) {
      statusText.textContent = "Network error. Please check your connection.";
    }
  });
}
