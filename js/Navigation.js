document.addEventListener("DOMContentLoaded", () => {
// Configuration - UPDATED TO 1 MINUTE DELAY
  const AUTOMATION_STEP_DELAY = 60000; // 60 seconds between steps (1 minute)
  const BUBBLE_DISPLAY_TIME = 12000;

// Load saved options or use defaults
  const savedOptions = JSON.parse(localStorage.getItem('navHelpOptions')) || {};
  const savedEnabledOptions = savedOptions.enabledOptions || {};
  const savedPosition = savedOptions.position || { bottom: '30px', right: '30px' };
  const savedNavigationOptions = savedOptions.navigationOptions || null;

// Use saved navigation options if available, otherwise use defaults
  let navigationOptions = savedNavigationOptions || [
    {
      name: "Customer Service",
      steps: [
        "Click Customer Service button to begin",
        "Enter customer PAN (at least 13 digits)",
        "Click Search button to find customer",
        "Click on customer row to expand details",
        "Double-click payment instruments to view customer details"
      ],
      automation: automateCustomerService,
      enabled: savedEnabledOptions["Customer Service"] !== undefined ?
        savedEnabledOptions["Customer Service"] : true
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
      automation: automateCustomerSearch,
      enabled: savedEnabledOptions["Customer Search"] !== undefined ?
        savedEnabledOptions["Customer Search"] : true
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
      automation: automateCustomerDetails,
      enabled: savedEnabledOptions["Customer Details"] !== undefined ?
        savedEnabledOptions["Customer Details"] : true
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
      automation: automatePaymentInstruments,
      enabled: savedEnabledOptions["Payment Instruments"] !== undefined ?
        savedEnabledOptions["Payment Instruments"] : true
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
      automation: automateTransactionHistory,
      enabled: savedEnabledOptions["Transaction History"] !== undefined ?
        savedEnabledOptions["Transaction History"] : true
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
      automation: automateAccountManagement,
      enabled: savedEnabledOptions["Account Management"] !== undefined ?
        savedEnabledOptions["Account Management"] : true
    }
  ];

  const frequentOptions = ["Customer Service", "Customer Search", "Transaction History"];
  let bubbles = [];
  let currentAutomation = null;
  let currentAutomationInterval = null;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  /* ------------ ELEMENT DISCOVERY AND INTERACTION FUNCTIONS ------------ */

// Function to find elements by various selectors
  function findElement(selectors) {
    for (const selector of selectors) {
      try {
        if (selector.includes(':contains(')) {
// Handle :contains pseudo-selector
          const [tag, text] = selector.split(':contains(');
          const cleanText = text.replace(')', '');
          const elements = document.querySelectorAll(tag);
          for (const el of elements) {
            if (el.textContent.includes(cleanText)) {
              return el;
            }
          }
        } else {
          const element = document.querySelector(selector);
          if (element) return element;
        }
      } catch (e) {
        console.warn('Invalid selector:', selector);
      }
    }
    return null;
  }

// Function to simulate a click on an element
  function clickElement(element) {
    if (!element) return false;

    try {
// Highlight the element before clicking
      highlightElementForClick(element);

// Create and dispatch a mouse event
      const mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(mouseEvent);

// Also trigger the native click method
      if (typeof element.click === 'function') {
        element.click();
      }

      return true;
    } catch (error) {
      console.error('Error clicking element:', error);
      return false;
    }
  }

// Function to highlight an element before clicking (visual feedback)
  function highlightElementForClick(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const highlight = document.createElement("div");
    highlight.className = "nav-click-highlight";
    highlight.style.position = "absolute";
    highlight.style.top = (rect.top + scrollTop - 5) + "px";
    highlight.style.left = (rect.left + scrollLeft - 5) + "px";
    highlight.style.width = (rect.width + 10) + "px";
    highlight.style.height = (rect.height + 10) + "px";
    highlight.style.background = "rgba(255, 215, 0, 0.3)";
    highlight.style.border = "2px solid gold";
    highlight.style.borderRadius = "4px";
    highlight.style.zIndex = "9997";
    highlight.style.pointerEvents = "none";
    highlight.style.animation = "pulseClick 0.8s ease-in-out";

    document.body.appendChild(highlight);

// Remove highlight after animation
    setTimeout(() => {
      if (document.body.contains(highlight)) {
        document.body.removeChild(highlight);
      }
    }, 800);

// Scroll element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

// Function to simulate typing into an input field
  function typeInInput(selectors, text) {
    const input = findElement(selectors);
    if (!input) return false;

    try {
// Highlight the input before typing
      highlightElementForClick(input);

      input.focus();
      input.value = text;

// Trigger input events
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);

      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);

      return true;
    } catch (error) {
      console.error('Error typing in input:', error);
      return false;
    }
  }

// Function to wait for an element to appear
  function waitForElement(selectors, timeout = 5000) {
    return new Promise((resolve) => {
      const startTime = Date.now();

      function check() {
        const element = findElement(selectors);
        if (element) {
          resolve(element);
          return;
        }

        if (Date.now() - startTime < timeout) {
          setTimeout(check, 100);
        } else {
          resolve(null);
        }
      }

      check();
    });
  }

  /* ------------ CREATE BUTTON ------------ */
  const navContainer = document.createElement("div");
  navContainer.id = "nav-help-container";
  navContainer.style.position = "fixed";
  navContainer.style.bottom = savedPosition.bottom;
  navContainer.style.right = savedPosition.right;
  navContainer.style.zIndex = "9999";
  navContainer.style.cursor = "move";

// Make container draggable
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
      navContainer.style.cursor = "grabbing";
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
    if (isDragging) {
      isDragging = false;
      navContainer.style.cursor = "move";

// Save position
      const rect = navContainer.getBoundingClientRect();
      const savedOptions = JSON.parse(localStorage.getItem('navHelpOptions')) || {};
      savedOptions.position = {
        top: rect.top + 'px',
        left: rect.left + 'px',
        bottom: 'auto',
        right: 'auto'
      };
      localStorage.setItem('navHelpOptions', JSON.stringify(savedOptions));
    }
  }

  const navButton = document.createElement("button");
  navButton.innerText = "☰ Navigation Help";
  navContainer.appendChild(navButton);
  document.body.appendChild(navContainer);

  /* ------------ DROPDOWN MENU ------------ */
  const dropdown = document.createElement("div");
  dropdown.style.display = "none";
  dropdown.style.position = "absolute";
  dropdown.style.bottom = "100%";
  dropdown.style.right = "0";
  dropdown.style.width = "250px";
  dropdown.style.background = "white";
  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 5px 15px rgba(0,0,0,0.15)";
  dropdown.style.overflow = "hidden";
  dropdown.style.marginBottom = "10px";

// Add settings option to customize dropdown
  const settingsItem = document.createElement("div");
  settingsItem.innerText = "Customize Options...";
  settingsItem.style.padding = "12px 15px";
  settingsItem.style.cursor = "pointer";
  settingsItem.style.transition = "background 0.2s";
  settingsItem.style.borderBottom = "1px solid #eee";
  settingsItem.addEventListener("mouseenter", () => settingsItem.style.background = "#e0e0e0");
  settingsItem.addEventListener("mouseleave", () => settingsItem.style.background = "#f8f8f8");
  settingsItem.addEventListener("click", showCustomizationDialog);
  dropdown.appendChild(settingsItem);

// Add admin option to edit use cases
  const adminItem = document.createElement("div");
  adminItem.innerText = "Admin: Edit Use Cases";
  adminItem.style.padding = "12px 15px";
  adminItem.style.cursor = "pointer";
  adminItem.style.transition = "background 0.2s";
  adminItem.style.color = "#d32f2f";
  adminItem.addEventListener("mouseenter", () => adminItem.style.background = "#ffcdd2");
  adminItem.addEventListener("mouseleave", () => adminItem.style.background = "#f8f8f8");
  adminItem.addEventListener("click", showAdminDialog);
  dropdown.appendChild(adminItem);

// Function to refresh dropdown options
  function refreshDropdownOptions() {
// Remove all options except the settings and admin items
    while (dropdown.children.length > 2) {
      dropdown.removeChild(dropdown.lastChild);
    }

// Add filtered options
    navigationOptions
      .filter(opt => opt.enabled)
      .forEach(opt => {
        const item = document.createElement("div");
        item.innerText = opt.name;
        item.style.padding = "12px 15px";
        item.style.cursor = "pointer";
        item.style.transition = "background 0.2s";
        item.style.borderBottom = "1px solid #eee";
        item.addEventListener("mouseenter", () => item.style.background = "#f0f0f0");
        item.addEventListener("mouseleave", () => item.style.background = "white");
        item.addEventListener("click", () => {
          dropdown.style.display = "none";
          startAutomation(opt);
        });

        dropdown.appendChild(item);
      });
  }

// Initial dropdown setup
  refreshDropdownOptions();

  navContainer.appendChild(dropdown);

  navButton.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    hideBubbles();
  });

  /* ------------ ADMIN DIALOG FOR EDITING USE CASES ------------ */
  function showAdminDialog() {
    dropdown.style.display = "none";

    const dialog = document.createElement("div");
    dialog.id = "nav-admin-dialog";
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.background = "white";
    dialog.style.padding = "25px";
    dialog.style.borderRadius = "10px";
    dialog.style.boxShadow = "0 5px 25px rgba(0,0,0,0.25)";
    dialog.style.zIndex = "10001";
    dialog.style.width = "450px";
    dialog.style.maxWidth = "90%";
    dialog.style.maxHeight = "80vh";
    dialog.style.overflowY = "auto";

    const title = document.createElement("h3");
    title.innerText = "Admin: Edit Navigation Use Cases";
    title.style.marginTop = "0";
    title.style.color = "#092365";
    title.style.borderBottom = "2px solid #f0f0f0";
    title.style.paddingBottom = "10px";
    dialog.appendChild(title);

    const instructions = document.createElement("p");
    instructions.innerText = "Add, edit, or remove navigation use cases. Each use case requires a name and step-by-step instructions.";
    dialog.appendChild(instructions);

    const useCasesContainer = document.createElement("div");
    useCasesContainer.id = "use-cases-container";

// Add existing use cases
    navigationOptions.forEach((option, index) => {
      const useCaseDiv = createUseCaseEditor(option, index);
      useCasesContainer.appendChild(useCaseDiv);
    });

    dialog.appendChild(useCasesContainer);

// Add new use case button
    const addButton = document.createElement("button");
    addButton.innerText = "+ Add New Use Case";
    addButton.style.marginTop = "15px";
    addButton.addEventListener("click", () => {
      const newUseCase = {
        name: "New Use Case",
        steps: ["Step 1"],
        automation: function() { console.log("Automation for new use case"); },
        enabled: true
      };
      const newIndex = navigationOptions.push(newUseCase) - 1;
      const useCaseDiv = createUseCaseEditor(newUseCase, newIndex);
      useCasesContainer.appendChild(useCaseDiv);
// Scroll to the new use case
      useCaseDiv.scrollIntoView({ behavior: 'smooth' });
    });

    dialog.appendChild(addButton);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.gap = "10px";

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.addEventListener("click", () => document.body.removeChild(dialog));

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save All Changes";
    saveBtn.style.background = "#4caf50";
    saveBtn.style.color = "white";
    saveBtn.addEventListener("click", () => {
// Collect all use case data
      const useCaseEditors = dialog.querySelectorAll('.use-case-editor');
      const updatedOptions = [];

      useCaseEditors.forEach(editor => {
        const index = parseInt(editor.dataset.index);
        const nameInput = editor.querySelector('.use-case-name');
        const stepsTextarea = editor.querySelector('.use-case-steps');
        const enabledCheckbox = editor.querySelector('.use-case-enabled');

// Parse steps from textarea (one per line)
        const steps = stepsTextarea.value.split('\n')
          .map(step => step.trim())
          .filter(step => step.length > 0);

        updatedOptions.push({
          name: nameInput.value,
          steps: steps,
          automation: navigationOptions[index]?.automation || function() { console.log("Automation not defined"); },
          enabled: enabledCheckbox.checked
        });
      });

// Update navigation options
      navigationOptions = updatedOptions;

// Save to localStorage
      const savedOptions = JSON.parse(localStorage.getItem('navHelpOptions')) || {};
      savedOptions.navigationOptions = navigationOptions;
      localStorage.setItem('navHelpOptions', JSON.stringify(savedOptions));

// Refresh dropdown
      refreshDropdownOptions();

      document.body.removeChild(dialog);

// Show confirmation
      alert("Use cases updated successfully!");
    });

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(saveBtn);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
  }

  function createUseCaseEditor(option, index) {
    const useCaseDiv = document.createElement("div");
    useCaseDiv.className = "use-case-editor";
    useCaseDiv.dataset.index = index;
    useCaseDiv.style.border = "1px solid #e0e0e0";
    useCaseDiv.style.borderRadius = "8px";
    useCaseDiv.style.padding = "15px";
    useCaseDiv.style.marginBottom = "15px";
    useCaseDiv.style.background = "#fafafa";

// Use case name
    const nameLabel = document.createElement("label");
    nameLabel.innerText = "Use Case Name:";
    nameLabel.style.display = "block";
    nameLabel.style.marginBottom = "5px";
    nameLabel.style.fontWeight = "bold";
    nameLabel.style.color = "#333";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = option.name;
    nameInput.className = "use-case-name";
    nameInput.style.width = "100%";
    nameInput.style.padding = "8px";
    nameInput.style.border = "1px solid #ccc";
    nameInput.style.borderRadius = "4px";
    nameInput.style.marginBottom = "10px";
    nameInput.style.boxSizing = "border-box";

// Use case steps
    const stepsLabel = document.createElement("label");
    stepsLabel.innerText = "Steps (one per line):";
    stepsLabel.style.display = "block";
    stepsLabel.style.marginBottom = "5px";
    stepsLabel.style.fontWeight = "bold";
    stepsLabel.style.color = "#333";

    const stepsTextarea = document.createElement("textarea");
    stepsTextarea.value = option.steps.join('\n');
    stepsTextarea.className = "use-case-steps";
    stepsTextarea.style.width = "100%";
    stepsTextarea.style.height = "100px";
    stepsTextarea.style.padding = "8px";
    stepsTextarea.style.border = "1px solid #ccc";
    stepsTextarea.style.borderRadius = "4px";
    stepsTextarea.style.marginBottom = "10px";
    stepsTextarea.style.resize = "vertical";
    stepsTextarea.style.boxSizing = "border-box";

// Enabled checkbox
    const enabledContainer = document.createElement("div");
    enabledContainer.style.display = "flex";
    enabledContainer.style.alignItems = "center";
    enabledContainer.style.marginBottom = "10px";

    const enabledCheckbox = document.createElement("input");
    enabledCheckbox.type = "checkbox";
    enabledCheckbox.checked = option.enabled;
    enabledCheckbox.className = "use-case-enabled";
    enabledCheckbox.style.marginRight = "8px";

    const enabledLabel = document.createElement("label");
    enabledLabel.innerText = "Enabled";
    enabledLabel.style.margin = "0";

    enabledContainer.appendChild(enabledCheckbox);
    enabledContainer.appendChild(enabledLabel);

// Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.background = "#f44336";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "8px 15px";
    deleteButton.style.borderRadius = "4px";
    deleteButton.style.cursor = "pointer";
    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this use case?")) {
        navigationOptions.splice(index, 1);
        useCaseDiv.remove();
      }
    });

    useCaseDiv.appendChild(nameLabel);
    useCaseDiv.appendChild(nameInput);
    useCaseDiv.appendChild(stepsLabel);
    useCaseDiv.appendChild(stepsTextarea);
    useCaseDiv.appendChild(enabledContainer);
    useCaseDiv.appendChild(deleteButton);

    return useCaseDiv;
  }

  /* ------------ CUSTOMIZATION DIALOG ------------ */
  function showCustomizationDialog() {
    dropdown.style.display = "none";

    const dialog = document.createElement("div");
    dialog.id = "nav-custom-dialog";
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.background = "white";
    dialog.style.padding = "25px";
    dialog.style.borderRadius = "10px";
    dialog.style.boxShadow = "0 5px 25px rgba(0,0,0,0.25)";
    dialog.style.zIndex = "10001";
    dialog.style.width = "450px";
    dialog.style.maxWidth = "90%";
    dialog.style.maxHeight = "80vh";
    dialog.style.overflowY = "auto";

    const title = document.createElement("h3");
    title.innerText = "Customize Navigation Options";
    title.style.marginTop = "0";
    title.style.color = "#092365";
    dialog.appendChild(title);

    const instructions = document.createElement("p");
    instructions.innerText = "Select which options should appear in the dropdown:";
    dialog.appendChild(instructions);

    const optionsContainer = document.createElement("div");
    optionsContainer.style.maxHeight = "300px";
    optionsContainer.style.overflowY = "auto";

// Create checkboxes for each option
    navigationOptions.forEach(opt => {
      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.marginBottom = "10px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = opt.enabled;
      checkbox.dataset.option = opt.name;
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
// Update enabled status for each option
      const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        const optionName = checkbox.dataset.option;
        const option = navigationOptions.find(opt => opt.name === optionName);
        if (option) {
          option.enabled = checkbox.checked;
        }
      });

// Save to localStorage
      const savedOptions = JSON.parse(localStorage.getItem('navHelpOptions')) || {};
      const enabledOptions = {};
      navigationOptions.forEach(opt => {
        enabledOptions[opt.name] = opt.enabled;
      });
      savedOptions.enabledOptions = enabledOptions;
      localStorage.setItem('navHelpOptions', JSON.stringify(savedOptions));

// Refresh dropdown
      refreshDropdownOptions();

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
    bubble.className = "speech-bubble";
    bubble.style.background = "white";
    bubble.style.padding = "10px 15px";
    bubble.style.borderRadius = "18px";
    bubble.style.boxShadow = "0 3px 10px rgba(0,0,0,0.15)";
    bubble.style.cursor = "pointer";
    bubble.style.transition = "all 0.3s ease";
    bubble.style.opacity = "0";
    bubble.style.fontSize = "14px";
    bubble.style.border = "1px solid #e0e0e0";

    bubble.addEventListener("click", () => {
      const opt = navigationOptions.find(o => o.name === freq && o.enabled);
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

    const element = findElement([selector]);
    if (!element) return false;

    const highlight = document.createElement("div");
    highlight.className = "nav-highlight";
    highlight.style.position = "absolute";
    highlight.style.background = "rgba(33, 150, 243, 0.2)";
    highlight.style.border = "2px solid #2196f3";
    highlight.style.borderRadius = "4px";
    highlight.style.pointerEvents = "none";
    highlight.style.zIndex = "9998";
    highlight.style.boxSizing = "border-box";
    highlight.style.animation = "pulse 1.5s infinite";

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    highlight.style.top = (rect.top + scrollTop - 5) + "px";
    highlight.style.left = (rect.left + scrollLeft - 5) + "px";
    highlight.style.width = (rect.width + 10) + "px";
    highlight.style.height = (rect.height + 10) + "px";

    document.body.appendChild(highlight);

// Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return true;
  }

  function removeHighlights() {
    document.querySelectorAll(".nav-highlight").forEach(el => el.remove());
    document.querySelectorAll(".nav-click-highlight").forEach(el => el.remove());
  }

  /* ------------ UPDATED AUTOMATION FUNCTIONS WITH ELEMENT INTERACTION ------------ */
  function automateCustomerService() {
    console.log("Automating Customer Service workflow");

// Step 1: Find and click Customer Service button
    const customerServiceBtn = findElement([
      '#customer-service-btn',
      'button:contains("Customer Service")',
      '[data-testid="customer-service-button"]',
      '.customer-service-button'
    ]);

    if (customerServiceBtn) {
      clickElement(customerServiceBtn);
      console.log("Clicked Customer Service button");
    }

// Step 2: Find PAN input and enter test data
    setTimeout(() => {
      const panInput = findElement([
        '#pan-input',
        'input[placeholder*="PAN"]',
        'input[name*="pan"]',
        '[data-testid="pan-input"]'
      ]);

      if (panInput) {
        typeInInput([
          '#pan-input',
          'input[placeholder*="PAN"]',
          'input[name*="pan"]',
          '[data-testid="pan-input"]'
        ], "1234567890123");
        console.log("Entered PAN number");
      }
    }, 2000);

// Step 3: Find and click Search button
    setTimeout(() => {
      const searchBtn = findElement([
        '#search-btn',
        'button:contains("Search")',
        '[data-testid="search-button"]',
        '.search-button'
      ]);

      if (searchBtn) {
        clickElement(searchBtn);
        console.log("Clicked Search button");
      }
    }, 4000);
  }

  function automateCustomerSearch() {
    console.log("Automating Customer Search workflow");

// Step 1: Find and click Customer Service button
    const customerServiceBtn = findElement([
      '#customer-service-btn',
      'button:contains("Customer Service")',
      '[data-testid="customer-service-button"]',
      '.customer-service-button'
    ]);

    if (customerServiceBtn) {
      clickElement(customerServiceBtn);
      console.log("Clicked Customer Service button");
    }

// Step 2: Find search input and enter test data
    setTimeout(() => {
      const searchInput = findElement([
        '.search-box',
        'input[placeholder*="Search"]',
        'input[name*="search"]',
        '[data-testid="search-input"]'
      ]);

      if (searchInput) {
        typeInInput([
          '.search-box',
          'input[placeholder*="Search"]',
          'input[name*="search"]',
          '[data-testid="search-input"]'
        ], "Test Customer");
        console.log("Entered search criteria");
      }
    }, 2000);
  }

  function automateCustomerDetails() {
    console.log("Automating Customer Details workflow");

// Step 1: Find and click on customer details tab
    const detailsTab = findElement([
      '[data-tab="details"]',
      '.tab:contains("Details")',
      '[data-testid="details-tab"]'
    ]);

    if (detailsTab) {
      clickElement(detailsTab);
      console.log("Clicked Customer Details tab");
    }
  }

  function automatePaymentInstruments() {
    console.log("Automating Payment Instruments workflow");

// Step 1: Find and click on payment instruments tab
    const instrumentsTab = findElement([
      '[data-tab="instruments"]',
      '.tab:contains("Instruments")',
      '.tab:contains("Payment")',
      '[data-testid="instruments-tab"]'
    ]);

    if (instrumentsTab) {
      clickElement(instrumentsTab);
      console.log("Clicked Payment Instruments tab");
    }

// Step 2: Find and click view details button
    setTimeout(() => {
      const viewDetailsBtn = findElement([
        '#view-details-btn',
        'button:contains("View Details")',
        '[data-testid="view-details-button"]'
      ]);

      if (viewDetailsBtn) {
        clickElement(viewDetailsBtn);
        console.log("Clicked View Details button");
      }
    }, 2000);
  }

  function automateTransactionHistory() {
    console.log("Automating Transaction History workflow");

// Step 1: Find and click on transactions tab
    const transactionsTab = findElement([
      '[data-tab="transactions"]',
      '.tab:contains("Transactions")',
      '[data-testid="transactions-tab"]'
    ]);

    if (transactionsTab) {
      clickElement(transactionsTab);
      console.log("Clicked Transactions tab");
    }

// Step 2: Find and click filter button
    setTimeout(() => {
      const filterBtn = findElement([
        '#filter-btn',
        'button:contains("Filter")',
        '[data-testid="filter-button"]'
      ]);

      if (filterBtn) {
        clickElement(filterBtn);
        console.log("Clicked Filter button");
      }
    }, 2000);
  }

  function automateAccountManagement() {
    console.log("Automating Account Management workflow");

// Step 1: Find and click account management button
    const accountBtn = findElement([
      '#account-btn',
      'button:contains("Account")',
      '[data-testid="account-button"]',
      '.account-button'
    ]);

    if (accountBtn) {
      clickElement(accountBtn);
      console.log("Clicked Account Management button");
    }
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
    guidePanel.style.top = "50px";
    guidePanel.style.right = "30px";
    guidePanel.style.width = "350px";
    guidePanel.style.background = "white";
    guidePanel.style.borderRadius = "10px";
    guidePanel.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";
    guidePanel.style.padding = "20px";
    guidePanel.style.zIndex = "10000";

    const title = document.createElement("h3");
    title.innerText = `${option.name} Guide`;
    title.style.marginTop = "0";
    title.style.color = "#092365";
    title.style.borderBottom = "2px solid #f0f0f0";
    title.style.paddingBottom = "10px";
    guidePanel.appendChild(title);

    const message = document.createElement("div");
    message.style.fontSize = "14px";
    message.style.marginBottom = "15px";
    message.style.lineHeight = "1.4";
    guidePanel.appendChild(message);

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
    guidePanel.appendChild(progressContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "8px";
    buttonContainer.style.justifyContent = "space-between";

    const prevBtn = document.createElement("button");
    prevBtn.innerText = "← Previous";
    prevBtn.style.padding = "8px 15px";
    prevBtn.style.border = "none";
    prevBtn.style.borderRadius = "5px";
    prevBtn.style.cursor = "pointer";
    prevBtn.style.fontWeight = "bold";
    prevBtn.style.background = "white";
    prevBtn.disabled = true;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.style.padding = "8px 15px";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "5px";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.fontWeight = "bold";
    nextBtn.style.background = "#4caf50";
    nextBtn.style.color = "white";

    const autoBtn = document.createElement("button");
    autoBtn.innerText = "Auto Run";
    autoBtn.style.padding = "8px 15px";
    autoBtn.style.border = "none";
    autoBtn.style.borderRadius = "5px";
    autoBtn.style.cursor = "pointer";
    autoBtn.style.fontWeight = "bold";
    autoBtn.style.background = "#2196f3";
    autoBtn.style.color = "white";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.padding = "8px 15px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "5px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.background = "#f44336";
    closeBtn.style.color = "white";

    buttonContainer.appendChild(prevBtn);
    buttonContainer.appendChild(nextBtn);
    buttonContainer.appendChild(autoBtn);
    buttonContainer.appendChild(closeBtn);
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
// Custom highlighting based on the option and step
      let selectors = [];

      switch(optionName) {
        case "Customer Service":
          if (step === 0) selectors = ['#customer-service-btn', 'button:contains("Customer Service")'];
          else if (step === 1) selectors = ['#pan-input', 'input[placeholder*="PAN"]'];
          else if (step === 2) selectors = ['#search-btn', 'button:contains("Search")'];
          break;

        case "Customer Search":
          if (step === 0) selectors = ['#customer-service-btn', 'button:contains("Customer Service")'];
          else if (step === 1) selectors = ['.search-box', 'input[placeholder*="Search"]'];
          break;

        case "Customer Details":
          if (step === 0) selectors = ['[data-tab="details"]', '.tab:contains("Details")'];
          break;

        case "Payment Instruments":
          if (step === 0) selectors = ['[data-tab="instruments"]', '.tab:contains("Instruments")'];
          else if (step === 4) selectors = ['#view-details-btn', 'button:contains("View Details")'];
          break;

        case "Transaction History":
          if (step === 0) selectors = ['[data-tab="transactions"]', '.tab:contains("Transactions")'];
          else if (step === 1) selectors = ['#filter-btn', 'button:contains("Filter")'];
          break;

        case "Account Management":
          if (step === 0) selectors = ['#account-btn', 'button:contains("Account")'];
          break;
      }

      if (selectors.length > 0) {
        highlightElement(selectors[0], option.steps[step]);
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

// Auto-advance through steps with 1 MINUTE DELAY
        if (currentAutomationInterval) {
          clearInterval(currentAutomationInterval);
        }

        currentAutomationInterval = setInterval(() => {
          if (stepIndex < option.steps.length - 1) {
            stepIndex++;
            updateStep();
// Execute the action for this step
            executeAutomationStep(option.name, stepIndex);
          } else {
            clearInterval(currentAutomationInterval);
            currentAutomationInterval = null;
          }
        }, AUTOMATION_STEP_DELAY); // 60,000ms = 1 minute
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

    function startDragPanel(e) {
      isPanelDragging = true;
      const rect = guidePanel.getBoundingClientRect();
      panelDragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      guidePanel.style.cursor = "grabbing";
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
        startDragPanel(e);
      }
    });

    document.addEventListener('mousemove', dragPanel);
    document.addEventListener('mouseup', stopDragPanel);
  }

// Function to execute automation steps
  function executeAutomationStep(optionName, stepIndex) {
    switch(optionName) {
      case "Customer Service":
        if (stepIndex === 0) {
          const customerServiceBtn = findElement([
            '#customer-service-btn',
            'button:contains("Customer Service")',
            '[data-testid="customer-service-button"]',
            '.customer-service-button'
          ]);
          if (customerServiceBtn) clickElement(customerServiceBtn);
        } else if (stepIndex === 1) {
          typeInInput([
            '#pan-input',
            'input[placeholder*="PAN"]',
            'input[name*="pan"]',
            '[data-testid="pan-input"]'
          ], "1234567890123");
        } else if (stepIndex === 2) {
          const searchBtn = findElement([
            '#search-btn',
            'button:contains("Search")',
            '[data-testid="search-button"]',
            '.search-button'
          ]);
          if (searchBtn) clickElement(searchBtn);
        }
        break;

      case "Customer Search":
        if (stepIndex === 0) {
          const customerServiceBtn = findElement([
            '#customer-service-btn',
            'button:contains("Customer Service")',
            '[data-testid="customer-service-button"]',
            '.customer-service-button'
          ]);
          if (customerServiceBtn) clickElement(customerServiceBtn);
        } else if (stepIndex === 1) {
          typeInInput([
            '.search-box',
            'input[placeholder*="Search"]',
            'input[name*="search"]',
            '[data-testid="search-input"]'
          ], "Test Customer");
        }
        break;

      case "Customer Details":
        if (stepIndex === 0) {
          const detailsTab = findElement([
            '[data-tab="details"]',
            '.tab:contains("Details")',
            '[data-testid="details-tab"]'
          ]);
          if (detailsTab) clickElement(detailsTab);
        }
        break;

      case "Payment Instruments":
        if (stepIndex === 0) {
          const instrumentsTab = findElement([
            '[data-tab="instruments"]',
            '.tab:contains("Instruments")',
            '.tab:contains("Payment")',
            '[data-testid="instruments-tab"]'
          ]);
          if (instrumentsTab) clickElement(instrumentsTab);
        } else if (stepIndex === 4) {
          const viewDetailsBtn = findElement([
            '#view-details-btn',
            'button:contains("View Details")',
            '[data-testid="view-details-button"]'
          ]);
          if (viewDetailsBtn) clickElement(viewDetailsBtn);
        }
        break;

      case "Transaction History":
        if (stepIndex === 0) {
          const transactionsTab = findElement([
            '[data-tab="transactions"]',
            '.tab:contains("Transactions")',
            '[data-testid="transactions-tab"]'
          ]);
          if (transactionsTab) clickElement(transactionsTab);
        } else if (stepIndex === 1) {
          const filterBtn = findElement([
            '#filter-btn',
            'button:contains("Filter")',
            '[data-testid="filter-button"]'
          ]);
          if (filterBtn) clickElement(filterBtn);
        }
        break;

      case "Account Management":
        if (stepIndex === 0) {
          const accountBtn = findElement([
            '#account-btn',
            'button:contains("Account")',
            '[data-testid="account-button"]',
            '.account-button'
          ]);
          if (accountBtn) clickElement(accountBtn);
        }
        break;
    }
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

// Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
@keyframes pulse {
0% { border-color: #2196f3; }
50% { border-color: #64b5f6; }
100% { border-color: #2196f3; }
}

@keyframes pulseClick {
0% { transform: scale(1); opacity: 0.7; }
50% { transform: scale(1.05); opacity: 1; }
100% { transform: scale(1); opacity: 0; }
}
`;
  document.head.appendChild(style);
});
