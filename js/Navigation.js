document.addEventListener("DOMContentLoaded", () => {
  /* ------------ CONFIG ------------ */
  const navigationOptions = [
    { name: "Dashboard", steps: ["Click Dashboard", "View statistics", "Explore reports"] },
    { name: "Profile", steps: ["Click Profile", "Edit personal info", "Save changes"] },
    { name: "Settings", steps: ["Open Settings", "Adjust preferences", "Save settings"] },
    { name: "Help", steps: ["Click Help", "Browse FAQs", "Contact support"] }
  ];

  const frequentOptions = ["Dashboard", "Profile"];
  let bubbles = []; // keep references to bubbles

  /* ------------ CREATE BUTTON ------------ */
  const navContainer = document.createElement("div");
  navContainer.style.position = "fixed";
  navContainer.style.bottom = "30px";
  navContainer.style.right = "30px";
  navContainer.style.zIndex = "9999";

  const navButton = document.createElement("button");
  navButton.innerText = "☰ Navigation";
  navButton.style.padding = "10px 20px";
  navButton.style.borderRadius = "20px";
  navButton.style.border = "none";
  navButton.style.background = "#092365";
  navButton.style.color = "white";
  navButton.style.cursor = "pointer";
  navButton.style.fontSize = "16px";

  navContainer.appendChild(navButton);
  document.body.appendChild(navContainer);

  /* ------------ DROPDOWN MENU ------------ */
  const dropdown = document.createElement("div");
  dropdown.style.display = "none";
  dropdown.style.position = "absolute";
  dropdown.style.bottom = "50px";
  dropdown.style.right = "0";
  dropdown.style.background = "white";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  dropdown.style.minWidth = "180px";
  dropdown.style.overflow = "hidden";

  navigationOptions.forEach(opt => {
    const item = document.createElement("div");
    item.innerText = opt.name;
    item.style.padding = "10px";
    item.style.cursor = "pointer";
    item.addEventListener("mouseenter", () => item.style.background = "#f0f0f0");
    item.addEventListener("mouseleave", () => item.style.background = "white");

    item.addEventListener("click", () => {
      dropdown.style.display = "none";
      startAutomation(opt);
    });

    dropdown.appendChild(item);
  });

  navContainer.appendChild(dropdown);

  navButton.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    hideBubbles(); // hide bubbles when button clicked
  });

  /* ------------ FREQUENT OPTIONS AS SPEECH BUBBLES ------------ */
  frequentOptions.forEach((freq, i) => {
    const bubble = document.createElement("div");
    bubble.innerText = freq;
    bubble.style.position = "absolute";
    bubble.style.bottom = `${60 + (i * 40)}px`;
    bubble.style.right = "120px";
    bubble.style.background = "#ffeb3b";
    bubble.style.color = "black";
    bubble.style.padding = "5px 10px";
    bubble.style.borderRadius = "15px";
    bubble.style.fontSize = "14px";
    bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    bubble.style.cursor = "pointer";
    bubble.style.opacity = "0"; // hidden initially
    bubble.style.transition = "opacity 1s ease";

    bubble.addEventListener("click", () => {
      const opt = navigationOptions.find(o => o.name === freq);
      if (opt) startAutomation(opt);
    });

    navContainer.appendChild(bubble);
    bubbles.push(bubble);
  });

  // show and fade bubbles
  function showBubbles() {
    bubbles.forEach((b, i) => {
      setTimeout(() => {
        b.style.opacity = "1";
        // fade out after 10s
        setTimeout(() => {
          b.style.opacity = "0";
        }, 10000);
      }, i * 500); // staggered fade-in
    });
  }

  function hideBubbles() {
    bubbles.forEach(b => {
      b.style.opacity = "0";
    });
  }

  // automatically show bubbles after page load
  setTimeout(showBubbles, 1000);

  /* ------------ AUTOMATION HIGHLIGHT STEPS ------------ */
  function startAutomation(option) {
    let stepIndex = 0;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "20px";
    overlay.style.textAlign = "center";
    overlay.style.padding = "20px";

    const message = document.createElement("div");
    message.innerText = option.steps[stepIndex];
    message.style.marginBottom = "20px";

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next ➡️";
    nextBtn.style.padding = "10px 20px";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "8px";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.fontSize = "16px";
    nextBtn.style.background = "#4caf50";
    nextBtn.style.color = "white";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖ Close";
    closeBtn.style.padding = "10px 20px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "8px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.background = "#f44336";
    closeBtn.style.color = "white";
    closeBtn.style.marginTop = "10px";

    overlay.appendChild(message);
    overlay.appendChild(nextBtn);
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    nextBtn.addEventListener("click", () => {
      stepIndex++;
      if (stepIndex < option.steps.length) {
        message.innerText = option.steps[stepIndex];
      } else {
        document.body.removeChild(overlay);
      }
    });

    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
  }
});
