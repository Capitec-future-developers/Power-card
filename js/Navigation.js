document.addEventListener("DOMContentLoaded", () => {
  let navigationOptions = [
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
    }
  ];

  const frequentOptions = ["Customer Service", "Customer Search"];
  let bubbles = [];
  let currentAutomation = null;
  let currentAutomationInterval = null;
  const PASSWORD = "Genesis@2025!!";

// Create the main navigation button
  const navContainer = document.createElement("div");
  navContainer.id = "nav-help-container";
  navContainer.style.position = "fixed";
  navContainer.style.bottom = "30px";
  navContainer.style.right = "30px";
  navContainer.style.zIndex = "9999";

  const navButton = document.createElement("button");
  navButton.id = "nav-help-button";
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

// Create dropdown menu
  const dropdown = document.createElement("div");
  dropdown.id = "nav-help-dropdown";
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

  function renderDropdown() {
    dropdown.innerHTML = "";
    navigationOptions.forEach(opt => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
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

    const editItem = document.createElement("div");
    editItem.className = "dropdown-item";
    editItem.innerText = "Edit Use Cases";
    editItem.style.padding = "12px 15px";
    editItem.style.cursor = "pointer";
    editItem.style.borderBottom = "1px solid #eee";
    editItem.style.background = "#e0f7fa";
    editItem.addEventListener("mouseenter", () => editItem.style.background = "#b2ebf2");
    editItem.addEventListener("mouseleave", () => editItem.style.background = "#e0f7fa");
    editItem.addEventListener("click", () => {
      dropdown.style.display = "none";
      showEditUseCasesModal();
    });
    dropdown.appendChild(editItem);
  }

  renderDropdown();
  navContainer.appendChild(dropdown);

  navButton.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    hideBubbles();
  });

// Create frequent options as speech bubbles
  frequentOptions.forEach((freq, i) => {
    const bubble = document.createElement("div");
    bubble.className = "help-bubble";
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
    bubble.style.zIndex = "10000";

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
    bubbles.forEach(b => b.style.opacity = "0");
  }

  setTimeout(showBubbles, 1500);

// Element highlighting
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
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Create a tooltip with the message
    const tooltip = document.createElement("div");
    tooltip.className = "nav-tooltip";
    tooltip.innerText = message;
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0,0,0,0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.zIndex = "10001";
    tooltip.style.maxWidth = "200px";
    tooltip.style.top = (rect.top + scrollTop - 40) + "px";
    tooltip.style.left = (rect.left + scrollLeft) + "px";

    document.body.appendChild(tooltip);
    setTimeout(() => {
      if (document.body.contains(tooltip)) {
        document.body.removeChild(tooltip);
      }
    }, 3000);

    return true;
  }

  function removeHighlights() {
    document.querySelectorAll(".nav-highlight").forEach(el => el.remove());
    document.querySelectorAll(".nav-tooltip").forEach(el => el.remove());
  }

// Edit use cases modal
  function showEditUseCasesModal() {
    const overlay = document.createElement("div");
    overlay.id = "edit-use-cases-overlay";
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
    overlay.style.background = "rgba(0,0,0,0.5)";

    const modal = document.createElement("div");
    modal.id = "edit-use-cases-modal";
    modal.style.background = "white";
    modal.style.borderRadius = "15px";
    modal.style.padding = "25px";
    modal.style.maxWidth = "600px";
    modal.style.width = "90%";
    modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";

    const title = document.createElement("h3");
    title.innerText = "Edit Use Cases";
    title.style.margin = "0 0 15px 0";
    title.style.color = "#092365";
    title.style.textAlign = "center";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Enter password";
    passwordInput.style.width = "100%";
    passwordInput.style.padding = "10px";
    passwordInput.style.marginBottom = "15px";
    passwordInput.style.border = "1px solid #ccc";
    passwordInput.style.borderRadius = "5px";

    const errorMessage = document.createElement("div");
    errorMessage.style.color = "red";
    errorMessage.style.marginBottom = "10px";
    errorMessage.style.display = "none";

    const verifyButton = document.createElement("button");
    verifyButton.innerText = "Verify Password";
    verifyButton.style.padding = "10px 20px";
    verifyButton.style.border = "none";
    verifyButton.style.borderRadius = "6px";
    verifyButton.style.cursor = "pointer";
    verifyButton.style.background = "#4caf50";
    verifyButton.style.color = "white";

    modal.appendChild(title);
    modal.appendChild(passwordInput);
    modal.appendChild(errorMessage);
    modal.appendChild(verifyButton);

    verifyButton.addEventListener("click", () => {
      if (passwordInput.value === PASSWORD) {
        modal.innerHTML = "";
        modal.appendChild(title);
        showUseCaseEditor(modal, overlay);
      } else {
        errorMessage.innerText = "Incorrect password";
        errorMessage.style.display = "block";
      }
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function showUseCaseEditor(modal, overlay) {
    const useCaseList = document.createElement("div");
    useCaseList.style.maxHeight = "200px";
    useCaseList.style.overflowY = "auto";
    useCaseList.style.marginBottom = "20px";

    function renderUseCaseList() {
      useCaseList.innerHTML = "";
      navigationOptions.forEach((opt, index) => {
        const useCaseItem = document.createElement("div");
        useCaseItem.style.display = "flex";
        useCaseItem.style.alignItems = "center";
        useCaseItem.style.padding = "10px";
        useCaseItem.style.borderBottom = "1px solid #eee";

        const nameSpan = document.createElement("span");
        nameSpan.innerText = opt.name;
        nameSpan.style.flex = "1";

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.style.padding = "5px 10px";
        editBtn.style.marginRight = "5px";
        editBtn.style.border = "none";
        editBtn.style.borderRadius = "5px";
        editBtn.style.background = "#2196f3";
        editBtn.style.color = "white";
        editBtn.style.cursor = "pointer";
        editBtn.addEventListener("click", () => {
          showEditStepsModal(opt, index);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.border = "none";
        deleteBtn.style.borderRadius = "5px";
        deleteBtn.style.background = "#f44336";
        deleteBtn.style.color = "white";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => {
          navigationOptions.splice(index, 1);
          renderUseCaseList();
          renderDropdown();
        });

        useCaseItem.appendChild(nameSpan);
        useCaseItem.appendChild(editBtn);
        useCaseItem.appendChild(deleteBtn);
        useCaseList.appendChild(useCaseItem);
      });
    }

    renderUseCaseList();

    const newUseCaseInput = document.createElement("input");
    newUseCaseInput.type = "text";
    newUseCaseInput.placeholder = "New use case name";
    newUseCaseInput.style.width = "100%";
    newUseCaseInput.style.padding = "10px";
    newUseCaseInput.style.marginBottom = "15px";
    newUseCaseInput.style.border = "1px solid #ccc";
    newUseCaseInput.style.borderRadius = "5px";

    const addButton = document.createElement("button");
    addButton.innerText = "Add Use Case";
    addButton.style.padding = "10px 20px";
    addButton.style.border = "none";
    addButton.style.borderRadius = "6px";
    addButton.style.cursor = "pointer";
    addButton.style.background = "#4caf50";
    addButton.style.color = "white";
    addButton.addEventListener("click", () => {
      if (newUseCaseInput.value.trim()) {
        navigationOptions.push({
          name: newUseCaseInput.value.trim(),
          steps: ["Step 1: To be defined"],
          automation: () => console.log(`Automation for ${newUseCaseInput.value.trim()} not yet implemented`)
        });
        newUseCaseInput.value = "";
        renderUseCaseList();
        renderDropdown();
      }
    });

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.padding = "10px 20px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "6px";
    closeButton.style.cursor = "pointer";
    closeButton.style.background = "#f44336";
    closeButton.style.color = "white";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    modal.appendChild(useCaseList);
    modal.appendChild(newUseCaseInput);
    modal.appendChild(addButton);
    modal.appendChild(closeButton);
  }

  function showEditStepsModal(option, index) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "10001";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.background = "rgba(0,0,0,0.5)";

    const modal = document.createElement("div");
    modal.style.background = "white";
    modal.style.borderRadius = "15px";
    modal.style.padding = "25px";
    modal.style.maxWidth = "600px";
    modal.style.width = "90%";
    modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";

    const title = document.createElement("h3");
    title.innerText = `Edit Steps for ${option.name}`;
    title.style.margin = "0 0 15px 0";
    title.style.color = "#092365";
    title.style.textAlign = "center";

    const stepsContainer = document.createElement("div");
    stepsContainer.style.maxHeight = "300px";
    stepsContainer.style.overflowY = "auto";
    stepsContainer.style.marginBottom = "20px";

    function renderSteps() {
      stepsContainer.innerHTML = "";
      option.steps.forEach((step, stepIndex) => {
        const stepItem = document.createElement("div");
        stepItem.style.display = "flex";
        stepItem.style.alignItems = "center";
        stepItem.style.marginBottom = "10px";

        const stepInput = document.createElement("input");
        stepInput.type = "text";
        stepInput.value = step;
        stepInput.style.flex = "1";
        stepInput.style.padding = "8px";
        stepInput.style.border = "1px solid #ccc";
        stepInput.style.borderRadius = "4px";
        stepInput.addEventListener("change", () => {
          option.steps[stepIndex] = stepInput.value;
        });

        const deleteStepBtn = document.createElement("button");
        deleteStepBtn.innerText = "Delete";
        deleteStepBtn.style.padding = "5px 10px";
        deleteStepBtn.style.marginLeft = "5px";
        deleteStepBtn.style.border = "none";
        deleteStepBtn.style.borderRadius = "4px";
        deleteStepBtn.style.background = "#f44336";
        deleteStepBtn.style.color = "white";
        deleteStepBtn.style.cursor = "pointer";
        deleteStepBtn.addEventListener("click", () => {
          option.steps.splice(stepIndex, 1);
          renderSteps();
        });

        stepItem.appendChild(stepInput);
        stepItem.appendChild(deleteStepBtn);
        stepsContainer.appendChild(stepItem);
      });
    }

    renderSteps();

    const addStepButton = document.createElement("button");
    addStepButton.innerText = "Add Step";
    addStepButton.style.padding = "8px 15px";
    addStepButton.style.marginBottom = "15px";
    addStepButton.style.border = "none";
    addStepButton.style.borderRadius = "4px";
    addStepButton.style.background = "#4caf50";
    addStepButton.style.color = "white";
    addStepButton.style.cursor = "pointer";
    addStepButton.addEventListener("click", () => {
      option.steps.push("New step");
      renderSteps();
    });

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save Changes";
    saveButton.style.padding = "10px 20px";
    saveButton.style.marginRight = "10px";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "6px";
    saveButton.style.background = "#4caf50";
    saveButton.style.color = "white";
    saveButton.style.cursor = "pointer";
    saveButton.addEventListener("click", () => {
      navigationOptions[index] = option;
      renderDropdown();
      document.body.removeChild(overlay);
    });

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "6px";
    cancelButton.style.background = "#f44336";
    cancelButton.style.color = "white";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    modal.appendChild(title);
    modal.appendChild(stepsContainer);
    modal.appendChild(addStepButton);
    modal.appendChild(saveButton);
    modal.appendChild(cancelButton);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

// Automation functions
  function automateCustomerService(stepIndex = 0) {
    const steps = [
      () => {
        const btn = document.getElementById('customer-service');
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      },
      () => {
        const panInput = document.getElementById('pan');
        if (panInput) {
          panInput.value = '4644090987127908';
          panInput.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
        return false;
      },
      () => {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
          searchBtn.click();
          return true;
        }
        return false;
      },
      () => {
        const customerRow = document.querySelector('.collapsible-row');
        if (customerRow) {
          customerRow.click();
          return true;
        }
        return false;
      },
      () => {
        const paymentTable = document.querySelector('.payment-table');
        if (paymentTable) {
          const event = new MouseEvent('dblclick', { view: window, bubbles: true, cancelable: true });
          paymentTable.dispatchEvent(event);
          return true;
        }
        return false;
      }
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex]();
    }
    return false;
  }

  function automateCustomerSearch(stepIndex = 0) {
    const steps = [
      () => {
        const btn = document.getElementById('customer-service');
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      },
      () => {
        const fnameInput = document.getElementById('fname');
        if (fnameInput) {
          fnameInput.value = 'Omphile';
          fnameInput.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
        return false;
      },
      () => {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
          searchBtn.click();
          return true;
        }
        return false;
      },
      () => {
        const customerRow = document.querySelector('.collapsible-row');
        if (customerRow) {
          customerRow.click();
          return true;
        }
        return false;
      },
      () => {
        const paymentTable = document.querySelector('.payment-table');
        if (paymentTable) {
          const event = new MouseEvent('dblclick', { view: window, bubbles: true, cancelable: true });
          paymentTable.dispatchEvent(event);
          return true;
        }
        return false;
      }
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex]();
    }
    return false;
  }

  function automateCustomerDetails(stepIndex = 0) {
    const steps = [
      () => true, // View customer identification
      () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length > 1) {
          tabButtons[1].click();
          return true;
        }
        return false;
      },
      () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length > 2) {
          tabButtons[2].click();
          return true;
        }
        return false;
      },
      () => {
        const memoBtn = document.getElementById('memo-btn');
        if (memoBtn) {
          memoBtn.click();
          return true;
        }
        return false;
      },
      () => {
        const cancelMemo = document.getElementById('cancel-memo');
        if (cancelMemo) {
          cancelMemo.click();
          return true;
        }
        return false;
      },
      () => {
        const transactionsBtn = document.getElementById('transactions-btn');
        if (transactionsBtn) {
          transactionsBtn.click();
          return true;
        }
        return false;
      },
      () => {
        const infoBtn = document.querySelector('.info-dot');
        if (infoBtn) {
          infoBtn.click();
          return true;
        }
        return false;
      }
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex]();
    }
    return false;
  }

  function automatePaymentInstruments(stepIndex = 0) {
    const steps = [
      () => {
        const infoBtn = document.querySelector('.info-dot');
        if (infoBtn) {
          infoBtn.click();
          return true;
        }
        return false;
      },
      () => true, // Review payment instrument details
      () => true, // Check card status
      () => true, // Verify expiry dates
      () => {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
          backBtn.click();
          return true;
        }
        return false;
      }
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex]();
    }
    return false;
  }

// Automation system
  function startAutomation(option) {
    if (currentAutomation) {
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
      }
      removeHighlights();
    }

    let stepIndex = 0;
    removeHighlights();

// Create step indicator
    const stepIndicator = document.createElement("div");
    stepIndicator.className = "step-indicator";
    stepIndicator.style.position = "fixed";
    stepIndicator.style.top = "20px";
    stepIndicator.style.right = "20px";
    stepIndicator.style.background = "white";
    stepIndicator.style.border = "1px solid #ccc";
    stepIndicator.style.borderRadius = "8px";
    stepIndicator.style.padding = "15px";
    stepIndicator.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    stepIndicator.style.zIndex = "9999";
    stepIndicator.style.maxWidth = "300px";

    const title = document.createElement("h4");
    title.innerText = `${option.name} Guide`;
    title.style.margin = "0 0 10px 0";
    title.style.color = "#092365";

    const message = document.createElement("div");
    message.style.fontSize = "14px";
    message.style.marginBottom = "15px";
    message.style.lineHeight = "1.4";

    const progressBar = document.createElement("div");
    progressBar.style.width = "100%";
    progressBar.style.height = "6px";
    progressBar.style.background = "#eee";
    progressBar.style.borderRadius = "3px";
    progressBar.style.marginBottom = "15px";
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
    buttonContainer.style.justifyContent = "space-between";

    const prevBtn = document.createElement("button");
    prevBtn.innerText = "← Previous";
    prevBtn.style.padding = "8px 15px";
    prevBtn.style.border = "none";
    prevBtn.style.borderRadius = "4px";
    prevBtn.style.cursor = "pointer";
    prevBtn.style.fontSize = "12px";
    prevBtn.style.background = "#9e9e9e";
    prevBtn.style.color = "white";
    prevBtn.disabled = true;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next Step →";
    nextBtn.style.padding = "8px 15px";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "4px";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.fontSize = "12px";
    nextBtn.style.background = "#4caf50";
    nextBtn.style.color = "white";

    const autoBtn = document.createElement("button");
    autoBtn.innerText = "Auto Run";
    autoBtn.style.padding = "8px 15px";
    autoBtn.style.border = "none";
    autoBtn.style.borderRadius = "4px";
    autoBtn.style.cursor = "pointer";
    autoBtn.style.fontSize = "12px";
    autoBtn.style.background = "#2196f3";
    autoBtn.style.color = "white";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.padding = "8px 15px";
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

    stepIndicator.appendChild(title);
    stepIndicator.appendChild(message);
    stepIndicator.appendChild(progressBar);
    stepIndicator.appendChild(buttonContainer);

    document.body.appendChild(stepIndicator);
    currentAutomation = stepIndicator;

    function updateStep() {
      const currentStep = option.steps[stepIndex];
      message.innerHTML = `<strong>Step ${stepIndex + 1} of ${option.steps.length}:</strong><br>${currentStep}`;
      const progressPercent = ((stepIndex + 1) / option.steps.length) * 100;
      progress.style.width = progressPercent + "%";
      highlightCurrentStep(option.name, stepIndex);

      prevBtn.disabled = stepIndex === 0;

      if (stepIndex >= option.steps.length - 1) {
        nextBtn.innerText = "Complete ✓";
        nextBtn.style.background = "#092365";
      } else {
        nextBtn.innerText = "Next Step →";
        nextBtn.style.background = "#4caf50";
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
        option.automation(stepIndex);
        updateStep();
      } else {
        removeHighlights();
        document.body.removeChild(stepIndicator);
        currentAutomation = null;
        if (currentAutomationInterval) {
          clearInterval(currentAutomationInterval);
          currentAutomationInterval = null;
        }
      }
    });

    prevBtn.addEventListener("click", () => {
      if (stepIndex > 0) {
        stepIndex--;
        updateStep();
      }
    });

    autoBtn.addEventListener("click", () => {
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
        autoBtn.innerText = "Auto Run";
        autoBtn.style.background = "#2196f3";
      } else {
        autoBtn.innerText = "Stop Auto";
        autoBtn.style.background = "#ff9800";
        let autoStepIndex = stepIndex;
        currentAutomationInterval = setInterval(() => {
          if (autoStepIndex < option.steps.length) {
            if (option.automation(autoStepIndex)) {
              stepIndex = autoStepIndex;
              updateStep();
              autoStepIndex++;
            } else {
              clearInterval(currentAutomationInterval);
              currentAutomationInterval = null;
              autoBtn.innerText = "Auto Run";
              autoBtn.style.background = "#2196f3";
            }
          } else {
            clearInterval(currentAutomationInterval);
            currentAutomationInterval = null;
            autoBtn.innerText = "Auto Run";
            autoBtn.style.background = "#2196f3";
          }
        }, 3000);
      }
    });

    closeBtn.addEventListener("click", () => {
      removeHighlights();
      if (currentAutomationInterval) {
        clearInterval(currentAutomationInterval);
        currentAutomationInterval = null;
      }
      document.body.removeChild(stepIndicator);
      currentAutomation = null;
    });


    option.automation(stepIndex);
  }


  const style = document.createElement('style');
  style.textContent = `
@keyframes pulse {
0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
}

.nav-highlight {
animation: pulse 2s infinite;
}
`;
  document.head.appendChild(style);

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
});
