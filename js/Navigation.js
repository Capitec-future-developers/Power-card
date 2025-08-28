document.addEventListener("DOMContentLoaded", () => {
  /* ------------ CONFIG ------------ */
  const navigationOptions = [
    { name: "Customer Service", steps: [
        "Click Customer Service button to begin",
        "Enter customer PAN (at least 13 digits)",
        "Click Search button to find customer",
        "Click on customer row to expand details",
        "Double-click payment instruments to view customer details"
      ]},
    { name: "Customer Search", steps: [
        "Navigate to Customer Service section",
        "Fill in search criteria (PAN, First Name, or Client Host ID)",
        "Review search results in the table",
        "Expand customer details by clicking the row",
        "Access full customer view by double-clicking"
      ]},
    { name: "Customer Details", steps: [
        "View customer identification information",
        "Navigate through different tabs (PAN Summary, Account Summary, etc.)",
        "Use Memo button to add customer notes",
        "Access Account Transactions for transaction history",
        "Use info buttons (i) for additional details"
      ]},
    { name: "Payment Instruments", steps: [
        "Click info button (i) next to PAN field",
        "Review payment instrument details",
        "Check card status and conditions",
        "Verify expiry dates and limits",
        "Navigate back to customer view when done"
      ]}
  ];

  const frequentOptions = ["Customer Service", "Customer Search"];
  let bubbles = [];
  let currentAutomation = null;

  /* ------------ CREATE BUTTON ------------ */
  const navContainer = document.createElement("div");
  navContainer.style.position = "fixed";
  navContainer.style.bottom = "30px";
  navContainer.style.right = "30px";
  navContainer.style.zIndex = "9999";

  const navButton = document.createElement("button");
  navButton.innerText = "☰ Navigation Help";
  navButton.style.padding = "10px 20px";
  navButton.style.borderRadius = "20px";
  navButton.style.border = "none";
  navButton.style.background = "#092365";
  navButton.style.color = "white";
  navButton.style.cursor = "pointer";
  navButton.style.fontSize = "16px";
  navButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";

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
  dropdown.style.minWidth = "200px";
  dropdown.style.overflow = "hidden";

  navigationOptions.forEach(opt => {
    const item = document.createElement("div");
    item.innerText = opt.name;
    item.style.padding = "12px 15px";
    item.style.cursor = "pointer";
    item.style.borderBottom = "1px solid #eee";
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
    hideBubbles();
  });

  /* ------------ FREQUENT OPTIONS AS SPEECH BUBBLES ------------ */
  frequentOptions.forEach((freq, i) => {
    const bubble = document.createElement("div");
    bubble.innerText = freq;
    bubble.style.position = "absolute";
    bubble.style.bottom = `${60 + (i * 45)}px`;
    bubble.style.right = "150px";
    bubble.style.background = "#ffeb3b";
    bubble.style.color = "black";
    bubble.style.padding = "8px 12px";
    bubble.style.borderRadius = "20px";
    bubble.style.fontSize = "13px";
    bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    bubble.style.cursor = "pointer";
    bubble.style.opacity = "0";
    bubble.style.transition = "opacity 1s ease";
    bubble.style.whiteSpace = "nowrap";

    bubble.addEventListener("click", () => {
      const opt = navigationOptions.find(o => o.name === freq);
      if (opt) startAutomation(opt);
    });

    navContainer.appendChild(bubble);
    bubbles.push(bubble);
  });

  function showBubbles() {
    bubbles.forEach((b, i) => {
      setTimeout(() => {
        b.style.opacity = "1";
        setTimeout(() => {
          b.style.opacity = "0";
        }, 12000);
      }, i * 600);
    });
  }

  function hideBubbles() {
    bubbles.forEach(b => {
      b.style.opacity = "0";
    });
  }

  setTimeout(showBubbles, 1500);

  /* ------------ ELEMENT HIGHLIGHTING ------------ */
  function highlightElement(selector, message) {
    removeHighlights();

    const element = document.querySelector(selector);
    if (!element) return false;

    const highlight = document.createElement("div");
    highlight.className = "nav-highlight";
    highlight.style.position = "absolute";
    highlight.style.border = "3px solid #ff6b6b";
    highlight.style.borderRadius = "8px";
    highlight.style.pointerEvents = "none";
    highlight.style.zIndex = "9998";
    highlight.style.boxShadow = "0 0 20px rgba(255, 107, 107, 0.5)";
    highlight.style.animation = "pulse 2s infinite";

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    highlight.style.top = (rect.top + scrollTop - 5) + "px";
    highlight.style.left = (rect.left + scrollLeft - 5) + "px";
    highlight.style.width = (rect.width + 10) + "px";
    highlight.style.height = (rect.height + 10) + "px";

    document.body.appendChild(highlight);

    // Add pulse animation
    if (!document.getElementById("nav-pulse-style")) {
      const style = document.createElement("style");
      style.id = "nav-pulse-style";
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return true;
  }

  function removeHighlights() {
    document.querySelectorAll(".nav-highlight").forEach(el => el.remove());
  }

  /* ------------ AUTOMATION SYSTEM ------------ */
  function startAutomation(option) {
    if (currentAutomation) {
      document.body.removeChild(currentAutomation);
    }

    let stepIndex = 0;
    removeHighlights();

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    const modal = document.createElement("div");
    modal.style.background = "white";
    modal.style.borderRadius = "15px";
    modal.style.padding = "25px";
    modal.style.maxWidth = "500px";
    modal.style.width = "90%";
    modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";

    const title = document.createElement("h3");
    title.innerText = `${option.name} Guide`;
    title.style.margin = "0 0 15px 0";
    title.style.color = "#092365";
    title.style.textAlign = "center";

    const message = document.createElement("div");
    message.style.fontSize = "16px";
    message.style.marginBottom = "20px";
    message.style.lineHeight = "1.5";
    message.style.textAlign = "center";

    const progressBar = document.createElement("div");
    progressBar.style.width = "100%";
    progressBar.style.height = "6px";
    progressBar.style.background = "#eee";
    progressBar.style.borderRadius = "3px";
    progressBar.style.marginBottom = "20px";
    progressBar.style.overflow = "hidden";

    const progress = document.createElement("div");
    progress.style.height = "100%";
    progress.style.background = "#092365";
    progress.style.borderRadius = "3px";
    progress.style.transition = "width 0.3s ease";

    progressBar.appendChild(progress);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.justifyContent = "center";

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next Step →";
    nextBtn.style.padding = "12px 20px";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "6px";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.fontSize = "14px";
    nextBtn.style.background = "#4caf50";
    nextBtn.style.color = "white";

    const skipBtn = document.createElement("button");
    skipBtn.innerText = "Skip";
    skipBtn.style.padding = "12px 20px";
    skipBtn.style.border = "1px solid #ccc";
    skipBtn.style.borderRadius = "6px";
    skipBtn.style.cursor = "pointer";
    skipBtn.style.fontSize = "14px";
    skipBtn.style.background = "white";
    skipBtn.style.color = "#666";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖ Close";
    closeBtn.style.padding = "12px 20px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "6px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.background = "#f44336";
    closeBtn.style.color = "white";

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(progressBar);
    modal.appendChild(buttonContainer);
    buttonContainer.appendChild(nextBtn);
    buttonContainer.appendChild(skipBtn);
    buttonContainer.appendChild(closeBtn);
    overlay.appendChild(modal);

    currentAutomation = overlay;

    function updateStep() {
      const currentStep = option.steps[stepIndex];
      message.innerHTML = `<strong>Step ${stepIndex + 1} of ${option.steps.length}:</strong><br>${currentStep}`;

      const progressPercent = ((stepIndex + 1) / option.steps.length) * 100;
      progress.style.width = progressPercent + "%";

      // Highlight relevant elements based on the step
      highlightCurrentStep(option.name, stepIndex);

      if (stepIndex >= option.steps.length - 1) {
        nextBtn.innerText = "Complete ✓";
        nextBtn.style.background = "#092365";
      }
    }

    function highlightCurrentStep(optionName, step) {
      switch(optionName) {
        case "Customer Service":
          switch(step) {
            case 0: highlightElement("#customer-service", "Click here to start"); break;
            case 1: highlightElement("#pan", "Enter customer PAN here"); break;
            case 2: highlightElement(".search-btn", "Click to search"); break;
            case 3: highlightElement(".collapsible-row", "Click customer row to expand"); break;
            case 4: highlightElement(".payment-table", "Double-click for customer view"); break;
          }
          break;
        case "Customer Search":
          switch(step) {
            case 0: highlightElement("#customer-service", "Navigate here first"); break;
            case 1: highlightElement(".customer-details", "Fill in search criteria"); break;
            case 2: highlightElement("#client-table", "Review results here"); break;
            case 3: highlightElement(".collapsible-row", "Click to expand details"); break;
            case 4: highlightElement(".payment-table", "Double-click for full view"); break;
          }
          break;
        case "Customer Details":
          switch(step) {
            case 0: highlightElement(".customer-card", "Customer identification info"); break;
            case 1: highlightElement(".tabs", "Navigate through these tabs"); break;
            case 2: highlightElement("#memo-btn", "Add customer notes"); break;
            case 3: highlightElement("#transactions-btn", "View transaction history"); break;
            case 4: highlightElement(".info-dot", "Click for additional details"); break;
          }
          break;
        case "Payment Instruments":
          switch(step) {
            case 0: highlightElement(".info-dot", "Click this info button"); break;
            case 1: highlightElement(".payment-section", "Review instrument details"); break;
            case 2: highlightElement("[data-label*='status']", "Check status information"); break;
            case 3: highlightElement("[data-label*='expiry']", "Verify expiry dates"); break;
            case 4: highlightElement("#back-btn", "Return to customer view"); break;
          }
          break;
      }
    }

    updateStep();

    nextBtn.addEventListener("click", () => {
      if (stepIndex < option.steps.length - 1) {
        stepIndex++;
        updateStep();
      } else {
        removeHighlights();
        document.body.removeChild(overlay);
        currentAutomation = null;
      }
    });

    skipBtn.addEventListener("click", () => {
      if (stepIndex < option.steps.length - 1) {
        stepIndex = option.steps.length - 1;
        updateStep();
      }
    });

    closeBtn.addEventListener("click", () => {
      removeHighlights();
      document.body.removeChild(overlay);
      currentAutomation = null;
    });

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        removeHighlights();
        document.body.removeChild(overlay);
        currentAutomation = null;
      }
    });

    document.body.appendChild(overlay);
  }

  // Clean up highlights when page changes
  const observer = new MutationObserver(() => {
    if (currentAutomation) {
      // Re-highlight current step if DOM changes
      setTimeout(() => {
        const currentStepIndex = parseInt(currentAutomation.querySelector(".progress").style.width) / (100 / navigationOptions[0].steps.length) - 1;
        if (currentStepIndex >= 0) {
          highlightCurrentStep("Customer Service", Math.floor(currentStepIndex));
        }
      }, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentAutomation) {
      removeHighlights();
      document.body.removeChild(currentAutomation);
      currentAutomation = null;
    }
  });
});
