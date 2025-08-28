document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const AUTOMATION_STEP_DELAY = 100000; // 30 seconds between steps
  const BUBBLE_DISPLAY_TIME = 12000;

  const navigationOptions = [
    {
      name: "Customer Service",
      steps: [
        "Click Customer Service button to begin",
        "Enter customer PAN (at least 13 digits)",
        "Click Search button to find customer",
        "Click on customer row to expand details",
        "Double-click payment instruments to view customer details"
      ],
      automation: automateCustomerService
    },
    {
      name: "Customer Search",
      steps: [
        "Navigate to Customer Service section",
        "Fill in search criteria (PAN, First Name, or Client Host ID)",
        "Review search results in the table",
        "Expand customer details by clicking the row",
        "Access full customer view by double-clicking"
      ],
      automation: automateCustomerSearch
    },
    {
      name: "Customer Details",
      steps: [
        "View customer identification information",
        "Navigate through different tabs (PAN Summary, Account Summary, etc.)",
        "Use Memo button to add customer notes",
        "Access Account Transactions for transaction history",
        "Use info buttons (i) for additional details"
      ],
      automation: automateCustomerDetails
    },
    {
      name: "Payment Instruments",
      steps: [
        "Click info button (i) next to PAN field",
        "Review payment instrument details",
        "Check card status and conditions",
        "Verify expiry dates and limits",
        "Navigate back to customer view when done"
      ],
      automation: automatePaymentInstruments
    },
    {
      name: "Transaction History",
      steps: [
        "Navigate to Account Transactions tab",
        "Filter transactions by date range",
        "Search for specific transaction types",
        "View detailed transaction information",
        "Export transaction data if needed"
      ],
      automation: automateTransactionHistory
    },
    {
      name: "Account Management",
      steps: [
        "Access account details from customer view",
        "Review account status and limits",
        "Check loyalty program information",
        "View associated payment instruments",
        "Manage account preferences"
      ],
      automation: automateAccountManagement
    }
  ];

  const frequentOptions = ["Customer Service", "Customer Search", "Transaction History"];
  let bubbles = [];
  let currentAutomation = null;
  let currentAutomationInterval = null;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };


  const navContainer = document.createElement("div");
  navContainer.id = "nav-help-container";
  navContainer.style.position = "fixed";
  navContainer.style.bottom = "30px";
  navContainer.style.right = "30px";
  navContainer.style.zIndex = "9999";
  navContainer.style.cursor = "move";


  navContainer.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  function startDrag(e) {
    if (e.target === navContainer || e.target === navButton) {
      isDragging = true;
      const rect = navContainer.getBoundingClientRect();
      dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }

  function drag(e) {
    if (!isDragging) return;

    navContainer.style.left = (e.clientX - dragOffset.x) + 'px';
    navContainer.style.top = (e.clientY - dragOffset.y) + 'px';
    navContainer.style.right = 'auto';
    navContainer.style.bottom = 'auto';
  }

  function stopDrag() {
    isDragging = false;
  }

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
  dropdown.style.zIndex = "10000";

  // Add settings option to customize dropdown
  const settingsItem = document.createElement("div");
  settingsItem.innerText = "Customize Options...";
  settingsItem.style.padding = "12px 15px";
  settingsItem.style.cursor = "pointer";
  settingsItem.style.borderBottom = "1px solid #eee";
  settingsItem.style.background = "#f8f8f8";
  settingsItem.style.fontWeight = "bold";
  settingsItem.addEventListener("mouseenter", () => settingsItem.style.background = "#e0e0e0");
  settingsItem.addEventListener("mouseleave", () => settingsItem.style.background = "#f8f8f8");
  settingsItem.addEventListener("click", showCustomizationDialog);
  dropdown.appendChild(settingsItem);

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

  /* ------------ CUSTOMIZATION DIALOG ------------ */
  function showCustomizationDialog() {
    dropdown.style.display = "none";

    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.background = "white";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "10px";
    dialog.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    dialog.style.zIndex = "10001";
    dialog.style.minWidth = "300px";

    const title = document.createElement("h3");
    title.innerText = "Customize Navigation Options";
    title.style.marginTop = "0";
    dialog.appendChild(title);

    const instructions = document.createElement("p");
    instructions.innerText = "Select which options should appear in the dropdown:";
    instructions.style.marginBottom = "15px";
    dialog.appendChild(instructions);

    const optionsContainer = document.createElement("div");
    optionsContainer.style.maxHeight = "300px";
    optionsContainer.style.overflowY = "auto";

    navigationOptions.forEach(opt => {
      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.marginBottom = "10px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.style.marginRight = "10px";

      const text = document.createElement("span");
      text.innerText = opt.name;

      label.appendChild(checkbox);
      label.appendChild(text);
      optionsContainer.appendChild(label);
    });

    dialog.appendChild(optionsContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.gap = "10px";

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.addEventListener("click", () => document.body.removeChild(dialog));

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.style.background = "#092365";
    saveBtn.style.color = "white";
    saveBtn.addEventListener("click", () => {
      // In a real implementation, you would save these preferences
      document.body.removeChild(dialog);
    });

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(saveBtn);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
  }

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
    bubble.style.zIndex = "9998";

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
        }, BUBBLE_DISPLAY_TIME);
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

  /* ------------ NEW AUTOMATION FUNCTIONS ------------ */
  function automateTransactionHistory() {
    // Navigate to Account Transactions tab
    setTimeout(() => {
      const transactionsTab = document.querySelector('[data-tab="transactions"]');
      if (transactionsTab) {
        transactionsTab.click();

        // Wait for transactions to load
        setTimeout(() => {
          // Show date filter
          const dateFilter = document.querySelector('.date-filter');
          if (dateFilter) {
            highlightElement('.date-filter', 'Filter transactions by date range');

            // After delay, show transaction details
            setTimeout(() => {
              const firstTransaction = document.querySelector('.transaction-row');
              if (firstTransaction) {
                highlightElement('.transaction-row', 'Click on any transaction to view details');
              }
            }, 10000);
          }
        }, 2000);
      }
    }, 1000);
  }

  function automateAccountManagement() {
    // Navigate to Account Summary tab
    setTimeout(() => {
      const accountTab = document.querySelector('[data-tab="account-summary"]');
      if (accountTab) {
        accountTab.click();

        // Wait for account details to load
        setTimeout(() => {
          // Show account status
          const accountStatus = document.querySelector('.account-status');
          if (accountStatus) {
            highlightElement('.account-status', 'View account status and limits here');

            // After delay, show loyalty information
            setTimeout(() => {
              const loyaltyInfo = document.querySelector('.loyalty-info');
              if (loyaltyInfo) {
                highlightElement('.loyalty-info', 'Check loyalty program details');
              }
            }, 10000);
          }
        }, 2000);
      }
    }, 1000);
  }

  /* ------------ EXISTING AUTOMATION FUNCTIONS (UPDATED) ------------ */
  function automateCustomerService() {
    // Click Customer Service button
    const customerServiceBtn = document.getElementById('customer-service');
    if (customerServiceBtn) {
      customerServiceBtn.click();

      // Wait for the content to load
      setTimeout(() => {
        // Enter PAN
        const panInput = document.getElementById('pan');
        if (panInput) {
          panInput.value = '4644090987127908'; // Sample PAN

          // Click Search button
          setTimeout(() => {
            const searchBtn = document.querySelector('.search-btn');
            if (searchBtn) {
              searchBtn.click();

              // Wait for results and click on customer row
              setTimeout(() => {
                const customerRow = document.querySelector('.collapsible-row');
                if (customerRow) {
                  customerRow.click();

                  // Wait for details to expand and double-click payment instruments
                  setTimeout(() => {
                    const paymentTable = document.querySelector('.payment-table');
                    if (paymentTable) {
                      // Simulate double-click
                      const event = new MouseEvent('dblclick', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                      });
                      paymentTable.dispatchEvent(event);
                    }
                  }, 1000);
                }
              }, 1000);
            }
          }, 500);
        }
      }, 500);
    }
  }

  function automateCustomerSearch() {
    // Click Customer Service button
    const customerServiceBtn = document.getElementById('customer-service');
    if (customerServiceBtn) {
      customerServiceBtn.click();

      // Wait for the content to load
      setTimeout(() => {
        // Enter First Name
        const fnameInput = document.getElementById('fname');
        if (fnameInput) {
          fnameInput.value = 'Omphile'; // Sample first name

          // Click Search button
          setTimeout(() => {
            const searchBtn = document.querySelector('.search-btn');
            if (searchBtn) {
              searchBtn.click();

              // Wait for results and click on customer row
              setTimeout(() => {
                const customerRow = document.querySelector('.collapsible-row');
                if (customerRow) {
                  customerRow.click();

                  // Wait for details to expand and double-click payment instruments
                  setTimeout(() => {
                    const paymentTable = document.querySelector('.payment-table');
                    if (paymentTable) {
                      // Simulate double-click
                      const event = new MouseEvent('dblclick', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                      });
                      paymentTable.dispatchEvent(event);
                    }
                  }, 1000);
                }
              }, 1000);
            }
          }, 500);
        }
      }, 500);
    }
  }

  function automateCustomerDetails() {
    // This assumes we're already in the customer view
    // Navigate through tabs
    setTimeout(() => {
      const tabButtons = document.querySelectorAll('.tab-btn');
      if (tabButtons.length > 1) {
        // Click on Account Summary tab
        tabButtons[1].click();

        // Continue through other tabs
        setTimeout(() => {
          tabButtons[2].click();

          setTimeout(() => {
            // Click Memo button
            const memoBtn = document.getElementById('memo-btn');
            if (memoBtn) memoBtn.click();

            setTimeout(() => {
              // Close memo popup
              const cancelMemo = document.getElementById('cancel-memo');
              if (cancelMemo) cancelMemo.click();

              setTimeout(() => {
                // Click Transactions button
                const transactionsBtn = document.getElementById('transactions-btn');
                if (transactionsBtn) transactionsBtn.click();

                setTimeout(() => {
                  // Click on info button
                  const infoBtn = document.querySelector('.info-dot');
                  if (infoBtn) infoBtn.click();
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 1000);
      }
    }, 500);
  }

  function automatePaymentInstruments() {
    // Click on info button next to PAN
    setTimeout(() => {
      const infoBtn = document.querySelector('.info-dot');
      if (infoBtn) {
        infoBtn.click();

        // After viewing payment instruments, go back
        setTimeout(() => {
          const backBtn = document.getElementById('back-btn');
          if (backBtn) backBtn.click();
        }, 2000);
      }
    }, 500);
  }

  /* ------------ AUTOMATION SYSTEM (UPDATED) ------------ */
  function startAutomation(option) {
    if (currentAutomation) {
      document.body.removeChild(currentAutomation);
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
      }
    }

    let stepIndex = 0;
    removeHighlights();

    const guidePanel = document.createElement("div");
    guidePanel.id = "nav-guide-panel";
    guidePanel.style.position = "fixed";
    guidePanel.style.top = "20px";
    guidePanel.style.right = "20px";
    guidePanel.style.background = "white";
    guidePanel.style.borderRadius = "10px";
    guidePanel.style.padding = "15px";
    guidePanel.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    guidePanel.style.zIndex = "10000";
    guidePanel.style.minWidth = "300px";
    guidePanel.style.maxWidth = "400px";
    guidePanel.style.cursor = "move";

    // Make panel draggable
    guidePanel.addEventListener('mousedown', function(e) {
      if (e.target.tagName !== 'BUTTON') {
        startDragPanel(e, guidePanel);
      }
    });

    const title = document.createElement("h3");
    title.innerText = `${option.name} Guide`;
    title.style.margin = "0 0 10px 0";
    title.style.color = "#092365";
    title.style.fontSize = "16px";

    const message = document.createElement("div");
    message.style.fontSize = "14px";
    message.style.marginBottom = "15px";
    message.style.lineHeight = "1.4";

    const progressContainer = document.createElement("div");
    progressContainer.style.display = "flex";
    progressContainer.style.alignItems = "center";
    progressContainer.style.marginBottom = "15px";
    progressContainer.style.gap = "10px";

    const progressText = document.createElement("span");
    progressText.style.fontSize = "12px";
    progressText.style.color = "#666";

    const progressBar = document.createElement("div");
    progressBar.style.flexGrow = "1";
    progressBar.style.height = "6px";
    progressBar.style.background = "#eee";
    progressBar.style.borderRadius = "3px";
    progressBar.style.overflow = "hidden";

    const progress = document.createElement("div");
    progress.style.height = "100%";
    progress.style.background = "#092365";
    progress.style.borderRadius = "3px";
    progress.style.transition = "width 0.3s ease";

    progressBar.appendChild(progress);
    progressContainer.appendChild(progressText);
    progressContainer.appendChild(progressBar);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "8px";
    buttonContainer.style.justifyContent = "space-between";

    const prevBtn = document.createElement("button");
    prevBtn.innerText = "← Previous";
    prevBtn.style.padding = "8px 12px";
    prevBtn.style.border = "1px solid #ccc";
    prevBtn.style.borderRadius = "4px";
    prevBtn.style.cursor = "pointer";
    prevBtn.style.fontSize = "12px";
    prevBtn.style.background = "white";
    prevBtn.disabled = true;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.style.padding = "8px 12px";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "4px";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.fontSize = "12px";
    nextBtn.style.background = "#4caf50";
    nextBtn.style.color = "white";

    const autoBtn = document.createElement("button");
    autoBtn.innerText = "Auto Run";
    autoBtn.style.padding = "8px 12px";
    autoBtn.style.border = "none";
    autoBtn.style.borderRadius = "4px";
    autoBtn.style.cursor = "pointer";
    autoBtn.style.fontSize = "12px";
    autoBtn.style.background = "#2196f3";
    autoBtn.style.color = "white";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.padding = "8px 12px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "4px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "12px";
    closeBtn.style.background = "#f44336";
    closeBtn.style.color = "white";

    buttonContainer.appendChild(prevBtn);
    buttonContainer.appendChild(nextBtn);
    buttonContainer.appendChild(autoBtn);
    buttonContainer.appendChild(closeBtn);

    guidePanel.appendChild(title);
    guidePanel.appendChild(message);
    guidePanel.appendChild(progressContainer);
    guidePanel.appendChild(buttonContainer);

    currentAutomation = guidePanel;

    function updateStep() {
      const currentStep = option.steps[stepIndex];
      message.innerHTML = `<strong>Step ${stepIndex + 1} of ${option.steps.length}:</strong><br>${currentStep}`;

      const progressPercent = ((stepIndex + 1) / option.steps.length) * 100;
      progress.style.width = progressPercent + "%";
      progressText.innerText = `${stepIndex + 1}/${option.steps.length}`;

      // Enable/disable navigation buttons
      prevBtn.disabled = stepIndex === 0;
      nextBtn.innerText = stepIndex >= option.steps.length - 1 ? "Finish" : "Next →";
      nextBtn.style.background = stepIndex >= option.steps.length - 1 ? "#092365" : "#4caf50";

      // Highlight relevant elements based on the step
      highlightCurrentStep(option.name, stepIndex);
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
        case "Transaction History":
          switch(step) {
            case 0: highlightElement('[data-tab="transactions"]', "Click to view transactions"); break;
            case 1: highlightElement('.date-filter', "Filter by date range"); break;
            case 2: highlightElement('.transaction-search', "Search for specific transactions"); break;
            case 3: highlightElement('.transaction-details', "View detailed information"); break;
            case 4: highlightElement('.export-btn', "Export data if needed"); break;
          }
          break;
        case "Account Management":
          switch(step) {
            case 0: highlightElement('[data-tab="account-summary"]', "View account details"); break;
            case 1: highlightElement('.account-status', "Check account status and limits"); break;
            case 2: highlightElement('.loyalty-info', "Review loyalty program"); break;
            case 3: highlightElement('.payment-instruments', "Manage payment methods"); break;
            case 4: highlightElement('.preferences', "Adjust account preferences"); break;
          }
          break;
      }
    }

    updateStep();

    prevBtn.addEventListener("click", () => {
      if (stepIndex > 0) {
        stepIndex--;
        updateStep();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (stepIndex < option.steps.length - 1) {
        stepIndex++;
        updateStep();
      } else {
        removeHighlights();
        document.body.removeChild(guidePanel);
        currentAutomation = null;
      }
    });

    autoBtn.addEventListener("click", () => {
      // Start the automation
      if (option.automation) {
        option.automation();

        // Auto-advance through steps
        if (currentAutomationInterval) {
          clearInterval(currentAutomationInterval);
        }

        currentAutomationInterval = setInterval(() => {
          if (stepIndex < option.steps.length - 1) {
            stepIndex++;
            updateStep();
          } else {
            clearInterval(currentAutomationInterval);
            currentAutomationInterval = null;
          }
        }, AUTOMATION_STEP_DELAY);
      }
    });

    closeBtn.addEventListener("click", () => {
      removeHighlights();
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
      }
      document.body.removeChild(guidePanel);
      currentAutomation = null;
    });

    document.body.appendChild(guidePanel);

    // Panel dragging functions
    let isPanelDragging = false;
    let panelDragOffset = { x: 0, y: 0 };

    function startDragPanel(e, panel) {
      isPanelDragging = true;
      const rect = panel.getBoundingClientRect();
      panelDragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      panel.style.cursor = "grabbing";
    }

    function dragPanel(e) {
      if (!isPanelDragging) return;

      guidePanel.style.left = (e.clientX - panelDragOffset.x) + 'px';
      guidePanel.style.top = (e.clientY - panelDragOffset.y) + 'px';
      guidePanel.style.right = 'auto';
    }

    function stopDragPanel() {
      isPanelDragging = false;
      guidePanel.style.cursor = "move";
    }

    guidePanel.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        startDragPanel(e, guidePanel);
      }
    });

    document.addEventListener('mousemove', dragPanel);
    document.addEventListener('mouseup', stopDragPanel);
  }

  // Clean up highlights when page changes
  const observer = new MutationObserver(() => {
    if (currentAutomation) {
      // Re-highlight current step if DOM changes
      setTimeout(() => {
        const progressText = currentAutomation.querySelector("span");
        if (progressText) {
          const [current, total] = progressText.innerText.split('/').map(Number);
          if (current > 0) {
            const optionName = currentAutomation.querySelector("h3").innerText.replace(" Guide", "");
            highlightCurrentStep(optionName, current - 1);
          }
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
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
      }
      document.body.removeChild(currentAutomation);
      currentAutomation = null;
    }
  });

  // Helper function for panel dragging
  function highlightCurrentStep(optionName, stepIndex) {
    // This would be implemented based on your specific UI elements
    // The implementation would vary based on your actual HTML structure
    console.log(`Highlighting step ${stepIndex + 1} for ${optionName}`);
  }
});
