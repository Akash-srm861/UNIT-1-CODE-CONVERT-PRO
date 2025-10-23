// 2's Complement Subtraction Tutorial
// Interactive educational tool for learning binary arithmetic

class TwosComplementCalculator {
  constructor() {
    this.currentStep = 0
    this.totalSteps = 4
    this.isCalculated = false
    this.autoPlayInterval = null
    this.animationSpeed = "normal"
    this.speedMultipliers = { slow: 2, normal: 1, fast: 0.5 }

    // Calculation results
    this.minuend = ""
    this.subtrahend = ""
    this.onesComplement = ""
    this.twosComplement = ""
    this.result = ""
    this.carry = ""

    this.initializeEventListeners()
    this.resetDisplay()
  }

  initializeEventListeners() {
    // Input validation with enhanced feedback
    document.getElementById("minuend").addEventListener("input", (e) => this.validateBinaryInput(e, "minuend"))
    document.getElementById("subtrahend").addEventListener("input", (e) => this.validateBinaryInput(e, "subtrahend"))

    // Main buttons
    document.getElementById("calculate-btn").addEventListener("click", () => this.calculate())
    document.getElementById("reset-btn").addEventListener("click", () => this.reset())
    document.getElementById("example-btn").addEventListener("click", () => this.loadExample())

    // Navigation buttons
    document.getElementById("prev-step").addEventListener("click", () => this.previousStep())
    document.getElementById("next-step").addEventListener("click", () => this.nextStep())
    document.getElementById("auto-play").addEventListener("click", () => this.toggleAutoPlay())

    document.getElementById("animation-speed").addEventListener("change", (e) => {
      this.animationSpeed = e.target.value
    })

    document.querySelectorAll(".progress-dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const step = Number.parseInt(e.target.dataset.step)
        if (this.isCalculated && step <= this.totalSteps) {
          this.showStep(step)
        }
      })
    })

    document.getElementById("verify-btn").addEventListener("click", () => this.showVerification())

    // Enter key support
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        if (!this.isCalculated) {
          this.calculate()
        } else {
          this.nextStep()
        }
      }
    })
  }

  validateBinaryInput(event, fieldName) {
    const input = event.target
    const value = input.value
    const feedbackElement = document.getElementById(`${fieldName}-feedback`)

    // Remove non-binary characters
    const cleanValue = value.replace(/[^01]/g, "")
    const limitedValue = cleanValue.slice(0, 8)

    if (input.value !== limitedValue) {
      input.value = limitedValue
    }

    // Enhanced visual feedback
    if (limitedValue.length > 0 && /^[01]+$/.test(limitedValue)) {
      input.style.borderColor = "#48bb78"
      input.style.backgroundColor = "#f0fff4"
      feedbackElement.className = "input-feedback success"
      feedbackElement.querySelector(".feedback-icon").textContent = "✅"
      feedbackElement.querySelector(".feedback-text").textContent = `Valid binary (${limitedValue.length} bits)`
    } else if (limitedValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      input.style.backgroundColor = "white"
      feedbackElement.className = "input-feedback"
      feedbackElement.querySelector(".feedback-icon").textContent = "💡"
      feedbackElement.querySelector(".feedback-text").textContent = "Enter binary number"
    } else {
      input.style.borderColor = "#e53e3e"
      input.style.backgroundColor = "#fef5e7"
      feedbackElement.className = "input-feedback error"
      feedbackElement.querySelector(".feedback-icon").textContent = "❌"
      feedbackElement.querySelector(".feedback-text").textContent = "Only 0s and 1s allowed"
    }
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")

    setTimeout(() => {
      errorDiv.classList.remove("show")
    }, 5000)
  }

  calculate() {
    const minuendInput = document.getElementById("minuend").value.trim()
    const subtrahendInput = document.getElementById("subtrahend").value.trim()

    // Validation
    if (!minuendInput || !subtrahendInput) {
      this.showError("Please enter both binary numbers! 🔢")
      return
    }

    if (!/^[01]+$/.test(minuendInput) || !/^[01]+$/.test(subtrahendInput)) {
      this.showError("Please enter valid binary numbers (only 0s and 1s)! ❌")
      return
    }

    if (minuendInput.length > 8 || subtrahendInput.length > 8) {
      this.showError("Please limit inputs to 8 bits maximum! 📏")
      return
    }

    // Pad to same length (minimum 4 bits for clarity)
    const maxLength = Math.max(4, minuendInput.length, subtrahendInput.length)
    this.minuend = minuendInput.padStart(maxLength, "0")
    this.subtrahend = subtrahendInput.padStart(maxLength, "0")

    // Calculate 2's complement
    this.calculateTwosComplement()

    // Perform addition
    this.performAddition()

    // Update display with animations
    this.updateAllDisplays()

    // Enable navigation
    this.isCalculated = true
    this.currentStep = 0
    this.updateNavigation()
    this.showStep(1)

    const calculateBtn = document.getElementById("calculate-btn")
    calculateBtn.textContent = "✅ Calculated!"
    calculateBtn.classList.add("animate-bounce")

    setTimeout(() => {
      calculateBtn.textContent = "🚀 Calculate"
      calculateBtn.classList.remove("animate-bounce")
    }, 2000)
  }

  calculateTwosComplement() {
    // Step 1: Find 1's complement (flip all bits)
    this.onesComplement = this.subtrahend
      .split("")
      .map((bit) => (bit === "0" ? "1" : "0"))
      .join("")

    // Step 2: Add 1 to get 2's complement
    let carry = 1
    let result = ""

    for (let i = this.onesComplement.length - 1; i >= 0; i--) {
      const sum = Number.parseInt(this.onesComplement[i]) + carry
      result = (sum % 2) + result
      carry = Math.floor(sum / 2)
    }

    this.twosComplement = result
  }

  performAddition() {
    let carry = 0
    let result = ""
    let carryString = ""
    const maxLength = this.minuend.length

    // Perform binary addition from right to left
    for (let i = maxLength - 1; i >= 0; i--) {
      const bit1 = Number.parseInt(this.minuend[i])
      const bit2 = Number.parseInt(this.twosComplement[i])
      const sum = bit1 + bit2 + carry

      result = (sum % 2) + result
      carry = Math.floor(sum / 2)
      carryString = carry + carryString
    }

    this.result = result
    this.carry = carryString

    // Handle final carry (overflow)
    if (carry > 0) {
      this.finalCarry = carry
    }
  }

  updateAllDisplays() {
    // Step 1: Original problem with decimal conversion
    document.getElementById("display-minuend").textContent = this.minuend
    document.getElementById("display-subtrahend").textContent = this.subtrahend
    document.getElementById("original-problem").textContent = `${this.minuend} - ${this.subtrahend}`

    // Add decimal displays
    document.getElementById("minuend-decimal").textContent = `(${Number.parseInt(this.minuend, 2)}₁₀)`
    document.getElementById("subtrahend-decimal").textContent = `(${Number.parseInt(this.subtrahend, 2)}₁₀)`

    // Step 2: 2's complement calculation with interactive bit flipping
    document.getElementById("step2-original").textContent = this.subtrahend
    document.getElementById("step2-ones-comp").textContent = this.onesComplement
    document.getElementById("step2-twos-comp").textContent = this.twosComplement

    // Create interactive bit flipping
    this.createBitFlipAnimation()

    // Step 3: Addition with step-by-step visualization
    document.getElementById("step3-minuend").textContent = this.minuend
    document.getElementById("step3-twos-comp").textContent = this.twosComplement
    document.getElementById("step3-carry").textContent = this.carry
    document.getElementById("step3-result").textContent = this.result

    // Create addition steps visualization
    this.createAdditionStepsVisualization()

    // Step 4: Final result
    document.getElementById("final-answer").textContent = this.result

    // Result explanation
    const explanation = this.generateExplanation()
    document.getElementById("result-explanation").innerHTML = explanation
  }

  generateExplanation() {
    const minuendDecimal = Number.parseInt(this.minuend, 2)
    const subtrahendDecimal = Number.parseInt(this.subtrahend, 2)
    const resultDecimal = Number.parseInt(this.result, 2)
    const expectedResult = minuendDecimal - subtrahendDecimal

    let explanation = `<p><strong>Decimal Check:</strong> ${minuendDecimal} - ${subtrahendDecimal} = ${expectedResult}</p>`

    if (this.finalCarry) {
      explanation += `<p><strong>Overflow:</strong> Final carry bit (${this.finalCarry}) is discarded in ${this.minuend.length}-bit arithmetic.</p>`
    }

    if (expectedResult >= 0) {
      explanation += `<p><strong>Result:</strong> ${this.result} in binary = ${resultDecimal} in decimal ✅</p>`
    } else {
      explanation += `<p><strong>Negative Result:</strong> The result represents ${expectedResult} in 2's complement form.</p>`
    }

    return explanation
  }

  showStep(stepNumber) {
    // Remove active class from all steps
    document.querySelectorAll(".step-card").forEach((card) => {
      card.classList.remove("active")
    })

    // Update progress dots
    document.querySelectorAll(".progress-dot").forEach((dot, index) => {
      dot.classList.remove("active", "completed")
      if (index + 1 < stepNumber) {
        dot.classList.add("completed")
      } else if (index + 1 === stepNumber) {
        dot.classList.add("active")
      }
    })

    // Add active class to current step with enhanced animations
    const currentCard = document.getElementById(`step-${stepNumber}`)
    if (currentCard) {
      currentCard.classList.add("active")

      // Different animation based on step
      if (stepNumber === 1) {
        currentCard.classList.add("animate-slide-left")
      } else if (stepNumber === 2) {
        currentCard.classList.add("animate-slide-right")
        this.animateBitFlipping()
      } else if (stepNumber === 3) {
        currentCard.classList.add("animate-bounce")
        this.animateAddition()
      } else if (stepNumber === 4) {
        currentCard.classList.add("animate-glow")
        this.showCelebration()
      }

      // Update step status
      const statusSpan = currentCard.querySelector(".step-status")
      if (stepNumber <= this.currentStep + 1) {
        statusSpan.textContent = "✅"
        currentCard.classList.add("completed")
      } else {
        statusSpan.textContent = "⏳"
      }

      // Scroll to step
      currentCard.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    // Update progress bar
    const progress = (stepNumber / this.totalSteps) * 100
    document.getElementById("progress").style.width = `${progress}%`

    this.currentStep = stepNumber - 1
    this.updateNavigation()
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.showStep(this.currentStep + 2)
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep)
    }
  }

  updateNavigation() {
    const prevBtn = document.getElementById("prev-step")
    const nextBtn = document.getElementById("next-step")

    prevBtn.disabled = !this.isCalculated || this.currentStep === 0
    nextBtn.disabled = !this.isCalculated || this.currentStep === this.totalSteps - 1
  }

  toggleAutoPlay() {
    const autoPlayBtn = document.getElementById("auto-play")

    if (this.autoPlayInterval) {
      // Stop auto play
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
      autoPlayBtn.textContent = "▶️ Auto Play"
      autoPlayBtn.style.background = "#f7fafc"
    } else {
      // Start auto play
      if (!this.isCalculated) {
        this.showError("Please calculate first before using auto play! 🎬")
        return
      }

      autoPlayBtn.textContent = "⏸️ Stop"
      autoPlayBtn.style.background = "#fed7d7"

      this.autoPlayInterval = setInterval(() => {
        if (this.currentStep < this.totalSteps - 1) {
          this.nextStep()
        } else {
          // Auto play finished
          this.toggleAutoPlay()
        }
      }, 3000)
    }
  }

  reset() {
    // Clear inputs with animation
    const inputs = document.querySelectorAll('input[type="text"]')
    inputs.forEach((input) => {
      input.style.transform = "scale(0.95)"
      setTimeout(() => {
        input.value = ""
        input.style.transform = "scale(1)"
        input.style.borderColor = "#e2e8f0"
        input.style.backgroundColor = "white"
      }, 100)
    })

    // Reset feedback displays
    document.querySelectorAll(".input-feedback").forEach((feedback) => {
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter binary number"
    })

    // Reset calculation state
    this.isCalculated = false
    this.currentStep = 0

    // Stop auto play
    if (this.autoPlayInterval) {
      this.toggleAutoPlay()
    }

    // Reset displays
    this.resetDisplay()

    // Reset navigation
    this.updateNavigation()

    // Hide error message and verification
    document.getElementById("error-message").classList.remove("show")
    document.getElementById("verification-details").classList.remove("show")

    // Reset button text with animation
    const resetBtn = document.getElementById("reset-btn")
    resetBtn.textContent = "✅ Reset!"
    resetBtn.classList.add("animate-bounce")

    setTimeout(() => {
      resetBtn.textContent = "🔄 Reset"
      resetBtn.classList.remove("animate-bounce")
    }, 1000)
  }

  resetDisplay() {
    // Reset all step displays
    document.querySelectorAll(".step-card").forEach((card) => {
      card.classList.remove("active", "completed", "animate")
      const statusSpan = card.querySelector(".step-status")
      statusSpan.textContent = "⏳"
    })

    // Reset binary displays
    document.querySelectorAll(".binary-number").forEach((span) => {
      if (!span.textContent.includes("0001")) {
        span.textContent = "----"
      }
    })

    // Reset specific displays
    document.getElementById("original-problem").textContent = "A - B"
    document.getElementById("final-answer").textContent = "----"
    document.getElementById("result-explanation").textContent = "Click calculate to see the result!"
    document.getElementById("step3-carry").textContent = "----"

    // Reset progress bar
    document.getElementById("progress").style.width = "0%"
  }

  loadExample() {
    const examples = [
      { minuend: "1101", subtrahend: "0011" },
      { minuend: "1010", subtrahend: "0110" },
      { minuend: "1111", subtrahend: "0001" },
      { minuend: "1000", subtrahend: "0101" },
    ]

    const example = examples[Math.floor(Math.random() * examples.length)]

    // Animate input filling
    this.animateInputFill("minuend", example.minuend)
    setTimeout(() => {
      this.animateInputFill("subtrahend", example.subtrahend)
    }, 500 * this.speedMultipliers[this.animationSpeed])
  }

  animateInputFill(inputId, value) {
    const input = document.getElementById(inputId)
    input.value = ""

    let index = 0
    const fillInterval = setInterval(() => {
      if (index < value.length) {
        input.value += value[index]
        input.dispatchEvent(new Event("input"))
        index++
      } else {
        clearInterval(fillInterval)
      }
    }, 200 * this.speedMultipliers[this.animationSpeed])
  }

  createBitFlipAnimation() {
    const container = document.getElementById("bit-flip-animation")
    container.innerHTML = ""

    this.subtrahend.split("").forEach((bit, index) => {
      const bitElement = document.createElement("span")
      bitElement.className = "bit-flip"
      bitElement.textContent = bit
      bitElement.addEventListener("click", () => {
        bitElement.classList.add("flipping")
        setTimeout(() => {
          bitElement.textContent = bit === "0" ? "1" : "0"
          bitElement.classList.remove("flipping")
          bitElement.classList.add("flipped")
        }, 300 * this.speedMultipliers[this.animationSpeed])
      })
      container.appendChild(bitElement)
    })
  }

  createAdditionStepsVisualization() {
    const container = document.getElementById("addition-columns")
    container.innerHTML = ""

    for (let i = 0; i < this.minuend.length; i++) {
      const column = document.createElement("div")
      column.className = "addition-column"

      const bit1 = this.minuend[i]
      const bit2 = this.twosComplement[i]
      const carryIn = i > 0 ? Number.parseInt(this.carry[i - 1]) : 0
      const sum = Number.parseInt(bit1) + Number.parseInt(bit2) + carryIn
      const result = sum % 2
      const carryOut = Math.floor(sum / 2)

      column.innerHTML = `
        <div class="column-header">Bit ${this.minuend.length - i - 1}</div>
        <div class="column-values">
          ${bit1}<br>
          +${bit2}<br>
          ${carryIn > 0 ? `+${carryIn}` : ""}
        </div>
        <div class="column-result">
          = ${result}<br>
          ${carryOut > 0 ? `carry ${carryOut}` : ""}
        </div>
      `

      // Add click animation
      column.addEventListener("click", () => {
        column.classList.add("active")
        setTimeout(() => {
          column.classList.remove("active")
        }, 1000 * this.speedMultipliers[this.animationSpeed])
      })

      container.appendChild(column)
    }
  }

  animateBitFlipping() {
    const additionAnimation = document.getElementById("addition-animation")
    if (additionAnimation) {
      additionAnimation.classList.add("show")
    }
  }

  animateAddition() {
    const carryDisplay = document.getElementById("step3-carry")
    if (carryDisplay && this.carry) {
      carryDisplay.innerHTML = ""
      this.carry.split("").forEach((bit, index) => {
        const span = document.createElement("span")
        span.className = "carry-bit"
        span.textContent = bit
        span.style.animationDelay = `${index * 0.2 * this.speedMultipliers[this.animationSpeed]}s`
        carryDisplay.appendChild(span)
      })
    }
  }

  showCelebration() {
    const container = document.getElementById("celebration-container")
    const particles = ["🎉", "✨", "🎊", "⭐", "💫", "🌟"]

    for (let i = 0; i < 10; i++) {
      setTimeout(
        () => {
          const particle = document.createElement("div")
          particle.className = "celebration-particle"
          particle.textContent = particles[Math.floor(Math.random() * particles.length)]
          particle.style.left = Math.random() * 100 + "%"
          particle.style.animationDelay = Math.random() * 0.5 + "s"
          container.appendChild(particle)

          setTimeout(() => {
            particle.remove()
          }, 2000)
        },
        i * 100 * this.speedMultipliers[this.animationSpeed],
      )
    }
  }

  showVerification() {
    const details = document.getElementById("verification-details")
    const minuendDecimal = Number.parseInt(this.minuend, 2)
    const subtrahendDecimal = Number.parseInt(this.subtrahend, 2)
    const resultDecimal = Number.parseInt(this.result, 2)
    const expectedResult = minuendDecimal - subtrahendDecimal

    details.innerHTML = `
      <h4>🔍 Verification Steps:</h4>
      <p><strong>Original:</strong> ${minuendDecimal} - ${subtrahendDecimal} = ${expectedResult}</p>
      <p><strong>Binary Result:</strong> ${this.result} = ${resultDecimal} in decimal</p>
      <p><strong>2's Complement Process:</strong></p>
      <ul>
        <li>1's Complement of ${this.subtrahend}: ${this.onesComplement}</li>
        <li>Add 1: ${this.onesComplement} + 1 = ${this.twosComplement}</li>
        <li>Final Addition: ${this.minuend} + ${this.twosComplement} = ${this.result}</li>
      </ul>
      <p class="${expectedResult === resultDecimal ? "text-green-600" : "text-red-600"}">
        <strong>${expectedResult === resultDecimal ? "✅ Correct!" : "❌ Check calculation"}</strong>
      </p>
    `

    details.classList.add("show")
  }
}

class DigitalElectronicsHub {
  constructor() {
    this.currentModule = null
    this.modules = new Map()
    this.quizSystem = new QuizSystem()
    this.authSystem = new AuthSystem()
    this.initializeModules()
    this.initializeNavigation()
    this.showWelcomeScreen()
  }

  initializeModules() {
    // Register all learning modules
    this.modules.set("twos-complement", new TwosComplementModule())
    this.modules.set("binary-conversions", new BinaryConversionsModule())
    this.modules.set("decimal-conversions", new DecimalConversionsModule())
    this.modules.set("octal-conversions", new OctalConversionsModule())
    this.modules.set("hex-conversions", new HexConversionsModule())
    this.modules.set("bcd-conversion", new BCDConversionModule())
    this.modules.set("gray-code", new GrayCodeModule())
    this.modules.set("ascii-code", new ASCIICodeModule())
    this.modules.set("parity-bits", new ParityBitsModule())
    this.modules.set("binary-arithmetic", new BinaryArithmeticModule())
    this.modules.set("bcd-arithmetic", new BCDArithmeticModule())
    this.modules.set("ones-complement", new OnesComplementModule())
    
    // Add quiz modules
    this.modules.set("quiz-center", new QuizCenterModule())
    this.modules.set("quiz-take", new QuizTakeModule())
    this.modules.set("user-dashboard", new UserDashboardModule())
    this.modules.set("leaderboard", new LeaderboardModule())
  }

  initializeNavigation() {
    // Mobile menu toggle
    const menuToggle = document.getElementById("menu-toggle")
    const navMenu = document.getElementById("nav-menu")

    menuToggle?.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Navigation items
    document.querySelectorAll(".nav-item, .feature-btn").forEach((item) => {
      item.addEventListener("click", (e) => {
        const moduleId = e.target.dataset.module
        if (moduleId) {
          this.loadModule(moduleId)
          navMenu?.classList.remove("active")
        }
      })
    })

    // Back button
    document.getElementById("back-btn")?.addEventListener("click", () => {
      this.showWelcomeScreen()
    })
  }

  showWelcomeScreen() {
    document.getElementById("welcome-screen").style.display = "block"
    document.getElementById("module-container").style.display = "none"

    // Reset active nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    this.currentModule = null
  }

  loadModule(moduleId) {
    const module = this.modules.get(moduleId)
    if (!module) {
      console.error(`Module ${moduleId} not found`)
      return
    }

    // Hide welcome screen and show module container
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("module-container").style.display = "block"

    // Update module header
    document.getElementById("module-title").textContent = module.getTitle()

    // Load module content
    const moduleContent = document.getElementById("module-content")
    moduleContent.innerHTML = module.getHTML()

    // Initialize module
    module.initialize()

    // Update active nav item
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
      if (item.dataset.module === moduleId) {
        item.classList.add("active")
      }
    })

    this.currentModule = module
  }
}

class TwosComplementModule {
  constructor() {
    this.calculator = null
  }

  getTitle() {
    return "2's Complement Subtraction Tutorial"
  }

  getHTML() {
    const template = document.getElementById("twos-complement-template")
    return template ? template.innerHTML : "<p>Template not found</p>"
  }

  initialize() {
    // Initialize the existing 2's complement calculator
    this.calculator = new TwosComplementCalculator()
  }
}

class LearningModule {
  constructor(title) {
    this.title = title
    this.currentStep = 0
    this.totalSteps = 0
  }

  getTitle() {
    return this.title
  }

  getHTML() {
    return "<div>Module content not implemented</div>"
  }

  initialize() {
    // Override in subclasses
  }

  createInputSection(title, inputs) {
    return `
      <section class="input-section card">
        <h2>${title}</h2>
        <div class="input-group">
          ${inputs
            .map(
              (input) => `
            <div class="input-field">
              <label for="${input.id}">${input.label}:</label>
              <input type="text" id="${input.id}" placeholder="${input.placeholder}" maxlength="${input.maxLength || 16}">
              <span class="binary-hint">${input.hint}</span>
              <div class="input-feedback" id="${input.id}-feedback">
                <span class="feedback-icon">💡</span>
                <span class="feedback-text">Enter ${input.type}</span>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="button-group">
          <button id="convert-btn" class="primary-btn">🔄 Convert</button>
          <button id="reset-btn" class="secondary-btn">🔄 Reset</button>
          <button id="example-btn" class="example-btn">🎯 Try Example</button>
        </div>
        <div id="error-message" class="error-message"></div>
      </section>
    `
  }

  createResultSection(title, results) {
    return `
      <section class="steps-section">
        <h2>${title}</h2>
        <div class="step-card active">
          <div class="step-header">
            <span class="step-number">📊</span>
            <h3>Conversion Results</h3>
            <span class="step-status">✅</span>
          </div>
          <div class="step-content">
            <div class="binary-display">
              ${results
                .map(
                  (result) => `
                <div class="binary-row">
                  <span class="label">${result.label}:</span>
                  <span id="${result.id}" class="binary-number highlight-result">----</span>
                  <span class="decimal-display" id="${result.id}-info"></span>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="result-explanation">
              <p id="conversion-explanation">Enter a number to see the conversion!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }
}

class BinaryConversionsModule extends LearningModule {
  constructor() {
    super("Binary Number Conversions")
  }

  getHTML() {
    return `
      ${this.createInputSection("🔢 Binary to Other Number Systems", [
        {
          id: "binary-input",
          label: "Binary Number",
          placeholder: "e.g., 1101",
          hint: "Binary digits only (0s and 1s)",
          type: "binary number",
        },
      ])}
      
      ${this.createResultSection("📊 Conversion Results", [
        { label: "Decimal", id: "decimal-result" },
        { label: "Octal", id: "octal-result" },
        { label: "Hexadecimal", id: "hex-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 Conversion Steps</h2>
        <div class="step-card" id="conversion-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="step-by-step-explanation">
              <p>Enter a binary number to see detailed conversion steps!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById("binary-input")?.addEventListener("input", (e) => {
      this.validateBinaryInput(e)
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performConversion()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })
  }

  validateBinaryInput(event) {
    const input = event.target
    const value = input.value
    const cleanValue = value.replace(/[^01]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById("binary-input-feedback")
    if (cleanValue.length > 0 && /^[01]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid binary (${cleanValue.length} bits)`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter binary number"
    }
  }

  performConversion() {
    const binaryInput = document.getElementById("binary-input").value.trim()

    if (!binaryInput || !/^[01]+$/.test(binaryInput)) {
      this.showError("Please enter a valid binary number!")
      return
    }

    const decimal = Number.parseInt(binaryInput, 2)
    const octal = decimal.toString(8)
    const hex = decimal.toString(16).toUpperCase()

    // Update results
    document.getElementById("decimal-result").textContent = decimal
    document.getElementById("octal-result").textContent = octal
    document.getElementById("hex-result").textContent = hex

    // Update info displays
    document.getElementById("decimal-result-info").textContent = `(Base 10)`
    document.getElementById("octal-result-info").textContent = `(Base 8)`
    document.getElementById("hex-result-info").textContent = `(Base 16)`

    // Show detailed steps
    this.showConversionSteps(binaryInput, decimal, octal, hex)

    // Animate results
    document.querySelectorAll(".binary-number").forEach((el) => {
      el.classList.add("animate-bounce")
      setTimeout(() => el.classList.remove("animate-bounce"), 800)
    })
  }

  showConversionSteps(binary, decimal, octal, hex) {
    const stepsContainer = document.getElementById("step-by-step-explanation")

    let steps = `
      <h4>🔢 Binary to Decimal Conversion:</h4>
      <div class="conversion-table">
        <p><strong>Binary:</strong> ${binary}</p>
        <p><strong>Process:</strong></p>
        <div class="binary-breakdown">
    `

    // Show positional values
    for (let i = 0; i < binary.length; i++) {
      const position = binary.length - 1 - i
      const bit = binary[i]
      const value = bit === "1" ? Math.pow(2, position) : 0
      steps += `<div class="bit-position">
        <span class="bit">${bit}</span> × 2<sup>${position}</sup> = ${value}
      </div>`
    }

    steps += `
        </div>
        <p><strong>Sum:</strong> ${decimal}</p>
      </div>
      
      <h4>🔢 Other Conversions:</h4>
      <p><strong>To Octal:</strong> ${decimal} ÷ 8 = ${octal} (base 8)</p>
      <p><strong>To Hexadecimal:</strong> ${decimal} ÷ 16 = ${hex} (base 16)</p>
    `

    stepsContainer.innerHTML = steps
    document.getElementById("conversion-steps").classList.add("active")
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  reset() {
    document.getElementById("binary-input").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.querySelectorAll(".decimal-display").forEach((el) => (el.textContent = ""))
    document.getElementById("step-by-step-explanation").innerHTML =
      "<p>Enter a binary number to see detailed conversion steps!</p>"
    document.getElementById("conversion-steps").classList.remove("active")
  }

  loadExample() {
    const examples = ["1101", "10110", "11111", "1010101"]
    const example = examples[Math.floor(Math.random() * examples.length)]
    document.getElementById("binary-input").value = example
    document.getElementById("binary-input").dispatchEvent(new Event("input"))
  }
}

class OctalConversionsModule extends LearningModule {
  constructor() {
    super("Octal Number Conversions")
  }
  getHTML() {
    return `
      ${this.createInputSection("🔢 Octal to Other Number Systems", [
        {
          id: "octal-input",
          label: "Octal Number",
          placeholder: "e.g., 15",
          hint: "Octal digits only (0-7)",
          type: "octal number",
        },
      ])}
      
      ${this.createResultSection("📊 Conversion Results", [
        { label: "Binary", id: "binary-result" },
        { label: "Decimal", id: "decimal-result" },
        { label: "Hexadecimal", id: "hex-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 Conversion Steps</h2>
        <div class="step-card" id="conversion-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="step-by-step-explanation">
              <p>Enter an octal number to see detailed conversion steps!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById("octal-input")?.addEventListener("input", (e) => {
      this.validateOctalInput(e)
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performConversion()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })
  }

  validateOctalInput(event) {
    const input = event.target
    const value = input.value
    const cleanValue = value.replace(/[^0-7]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById("octal-input-feedback")
    if (cleanValue.length > 0 && /^[0-7]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid octal`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter octal number"
    }
  }

  performConversion() {
    const octalInput = document.getElementById("octal-input").value.trim()

    if (!octalInput || !/^[0-7]+$/.test(octalInput)) {
      this.showError("Please enter a valid octal number!")
      return
    }

    const decimal = Number.parseInt(octalInput, 8)
    const binary = decimal.toString(2)
    const hex = decimal.toString(16).toUpperCase()

    // Update results
    document.getElementById("binary-result").textContent = binary
    document.getElementById("decimal-result").textContent = decimal
    document.getElementById("hex-result").textContent = hex

    // Update info displays
    document.getElementById("binary-result-info").textContent = `(Base 2)`
    document.getElementById("decimal-result-info").textContent = `(Base 10)`
    document.getElementById("hex-result-info").textContent = `(Base 16)`

    // Show detailed steps
    this.showConversionSteps(octalInput, decimal, binary, hex)

    // Animate results
    document.querySelectorAll(".binary-number").forEach((el) => {
      el.classList.add("animate-bounce")
      setTimeout(() => el.classList.remove("animate-bounce"), 800)
    })
  }

  showConversionSteps(octal, decimal, binary, hex) {
    const stepsContainer = document.getElementById("step-by-step-explanation")

    let steps = `
      <h4>🔢 Octal to Decimal Conversion:</h4>
      <div class="conversion-table">
        <p><strong>Octal:</strong> ${octal}</p>
        <p><strong>Process:</strong></p>
        <div class="binary-breakdown">
    `

    // Show positional values
    for (let i = 0; i < octal.length; i++) {
      const position = octal.length - 1 - i
      const digit = octal[i]
      const value = Number.parseInt(digit) * Math.pow(8, position)
      steps += `<div class="bit-position">
        <span class="bit">${digit}</span> × 8<sup>${position}</sup> = ${value}
      </div>`
    }

    steps += `
        </div>
        <p><strong>Sum:</strong> ${decimal}</p>
      </div>
      
      <h4>🔢 Other Conversions:</h4>
      <p><strong>To Binary:</strong> ${decimal} → ${binary}</p>
      <p><strong>To Hexadecimal:</strong> ${decimal} → ${hex}</p>
    `

    stepsContainer.innerHTML = steps
    document.getElementById("conversion-steps").classList.add("active")
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  reset() {
    document.getElementById("octal-input").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.querySelectorAll(".decimal-display").forEach((el) => (el.textContent = ""))
    document.getElementById("step-by-step-explanation").innerHTML =
      "<p>Enter an octal number to see detailed conversion steps!</p>"
    document.getElementById("conversion-steps").classList.remove("active")
  }

  loadExample() {
    const examples = ["15", "27", "64", "177"]
    const example = examples[Math.floor(Math.random() * examples.length)]
    document.getElementById("octal-input").value = example
    document.getElementById("octal-input").dispatchEvent(new Event("input"))
  }
}

class HexConversionsModule extends LearningModule {
  constructor() {
    super("Hexadecimal Number Conversions")
  }

  getHTML() {
    return `
      ${this.createInputSection("🔢 Hexadecimal to Other Number Systems", [
        {
          id: "hex-input",
          label: "Hexadecimal Number",
          placeholder: "e.g., A3F",
          hint: "Hex digits only (0-9, A-F)",
          type: "hexadecimal number",
        },
      ])}
      
      ${this.createResultSection("📊 Conversion Results", [
        { label: "Binary", id: "binary-result" },
        { label: "Decimal", id: "decimal-result" },
        { label: "Octal", id: "octal-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 Conversion Steps</h2>
        <div class="step-card" id="conversion-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="step-by-step-explanation">
              <p>Enter a hexadecimal number to see detailed conversion steps!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById("hex-input")?.addEventListener("input", (e) => {
      this.validateHexInput(e)
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performConversion()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })
  }

  validateHexInput(event) {
    const input = event.target
    const value = input.value.toUpperCase()
    const cleanValue = value.replace(/[^0-9A-F]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById("hex-input-feedback")
    if (cleanValue.length > 0 && /^[0-9A-F]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid hexadecimal`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter hexadecimal number"
    }
  }

  performConversion() {
    const hexInput = document.getElementById("hex-input").value.trim()

    if (!hexInput || !/^[0-9A-F]+$/.test(hexInput)) {
      this.showError("Please enter a valid hexadecimal number!")
      return
    }

    const decimal = Number.parseInt(hexInput, 16)
    const binary = decimal.toString(2)
    const octal = decimal.toString(8)

    // Update results
    document.getElementById("binary-result").textContent = binary
    document.getElementById("decimal-result").textContent = decimal
    document.getElementById("octal-result").textContent = octal

    // Update info displays
    document.getElementById("binary-result-info").textContent = `(Base 2)`
    document.getElementById("decimal-result-info").textContent = `(Base 10)`
    document.getElementById("octal-result-info").textContent = `(Base 8)`

    // Show detailed steps
    this.showConversionSteps(hexInput, decimal, binary, octal)

    // Animate results
    document.querySelectorAll(".binary-number").forEach((el) => {
      el.classList.add("animate-bounce")
      setTimeout(() => el.classList.remove("animate-bounce"), 800)
    })
  }

  showConversionSteps(hex, decimal, binary, octal) {
    const stepsContainer = document.getElementById("step-by-step-explanation")

    let steps = `
      <h4>🔢 Hexadecimal to Decimal Conversion:</h4>
      <div class="conversion-table">
        <p><strong>Hexadecimal:</strong> ${hex}</p>
        <p><strong>Process:</strong></p>
        <div class="binary-breakdown">
    `

    // Show positional values
    for (let i = 0; i < hex.length; i++) {
      const position = hex.length - 1 - i
      const digit = hex[i]
      const digitValue = Number.parseInt(digit, 16)
      const value = digitValue * Math.pow(16, position)
      steps += `<div class="bit-position">
        <span class="bit">${digit}</span> (${digitValue}) × 16<sup>${position}</sup> = ${value}
      </div>`
    }

    steps += `
        </div>
        <p><strong>Sum:</strong> ${decimal}</p>
      </div>
      
      <h4>🔢 Other Conversions:</h4>
      <p><strong>To Binary:</strong> ${decimal} → ${binary}</p>
      <p><strong>To Octal:</strong> ${decimal} → ${octal}</p>
    `

    stepsContainer.innerHTML = steps
    document.getElementById("conversion-steps").classList.add("active")
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  reset() {
    document.getElementById("hex-input").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.querySelectorAll(".decimal-display").forEach((el) => (el.textContent = ""))
    document.getElementById("step-by-step-explanation").innerHTML =
      "<p>Enter a hexadecimal number to see detailed conversion steps!</p>"
    document.getElementById("conversion-steps").classList.remove("active")
  }

  loadExample() {
    const examples = ["A3F", "1B2", "FF", "C0DE"]
    const example = examples[Math.floor(Math.random() * examples.length)]
    document.getElementById("hex-input").value = example
    document.getElementById("hex-input").dispatchEvent(new Event("input"))
  }
}

class BCDConversionModule extends LearningModule {
  constructor() {
    super("BCD (Binary Coded Decimal) Conversion")
    this.animationSpeed = 1000
  }

  getHTML() {
    return `
      ${this.createInputSection("💻 BCD Conversion", [
        {
          id: "decimal-input",
          label: "Decimal Number",
          placeholder: "e.g., 1234",
          hint: "Decimal digits only (0-9)",
          type: "decimal number",
        },
      ])}
      
      ${this.createResultSection("📊 BCD Results", [
        { label: "BCD Code", id: "bcd-result" },
        { label: "Binary", id: "binary-result" },
        { label: "Verification", id: "verify-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 BCD Conversion Steps</h2>
        <div class="step-card" id="conversion-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step BCD Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="step-by-step-explanation">
              <p>Enter a decimal number to see BCD conversion steps!</p>
            </div>
            <div class="interactive-conversion" id="interactive-conversion" style="display: none;">
              <h4>🎯 Interactive BCD Conversion:</h4>
              <div class="digit-conversion-container" id="digit-conversion-container"></div>
              <div class="conversion-controls">
                <button class="nav-btn" id="animate-conversion">▶️ Animate Conversion</button>
                <button class="nav-btn" id="step-conversion">👆 Step Through</button>
                <button class="nav-btn" id="reset-animation">🔄 Reset Animation</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
    this.currentStep = 0
    this.totalDigits = 0
  }

  setupEventListeners() {
    document.getElementById("decimal-input")?.addEventListener("input", (e) => {
      this.validateDecimalInput(e)
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performConversion()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })

    document.getElementById("animate-conversion")?.addEventListener("click", () => {
      this.animateConversion()
    })

    document.getElementById("step-conversion")?.addEventListener("click", () => {
      this.stepThroughConversion()
    })

    document.getElementById("reset-animation")?.addEventListener("click", () => {
      this.resetAnimation()
    })
  }

  validateDecimalInput(event) {
    const input = event.target
    const value = input.value
    const cleanValue = value.replace(/[^0-9]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById("decimal-input-feedback")
    if (cleanValue.length > 0 && /^[0-9]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      input.style.backgroundColor = "#f0fff4"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid decimal (${cleanValue.length} digits)`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      input.style.backgroundColor = "white"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter decimal number"
    }
  }

  performConversion() {
    const decimalInput = document.getElementById("decimal-input").value.trim()

    if (!decimalInput || !/^[0-9]+$/.test(decimalInput)) {
      this.showError("Please enter a valid decimal number!")
      return
    }

    const decimal = Number.parseInt(decimalInput)
    const bcd = this.decimalToBCD(decimalInput)
    const binary = decimal.toString(2)

    // Update results with animation
    this.animateResult("bcd-result", bcd)
    this.animateResult("binary-result", binary)
    this.animateResult("verify-result", `${decimalInput} → BCD`)

    // Update info displays
    document.getElementById("bcd-result-info").textContent = `(4-bit per digit)`
    document.getElementById("binary-result-info").textContent = `(Pure binary: ${binary.length} bits)`
    document.getElementById("verify-result-info").textContent = `(Verified conversion)`

    // Show detailed steps with interactive elements
    this.showConversionSteps(decimalInput, bcd, binary)
    this.createInteractiveConversion(decimalInput)

    // Success feedback
    this.showSuccessMessage("BCD conversion completed! 🎉")
  }

  animateResult(elementId, text) {
    const element = document.getElementById(elementId)
    element.style.opacity = "0"
    element.style.transform = "scale(0.8)"

    setTimeout(() => {
      element.textContent = text
      element.style.opacity = "1"
      element.style.transform = "scale(1)"
      element.classList.add("animate-bounce")
      setTimeout(() => element.classList.remove("animate-bounce"), 800)
    }, 200)
  }

  decimalToBCD(decimal) {
    return decimal
      .split("")
      .map((digit) => {
        return Number.parseInt(digit).toString(2).padStart(4, "0")
      })
      .join(" ")
  }

  showConversionSteps(decimal, bcd, binary) {
    const stepsContainer = document.getElementById("step-by-step-explanation")

    let steps = `
      <h4>💻 BCD (Binary Coded Decimal) Conversion:</h4>
      <div class="conversion-table">
        <p><strong>Input Decimal:</strong> <span class="highlight-result">${decimal}</span></p>
        <p><strong>BCD Process:</strong> Each decimal digit → 4-bit binary code</p>
        <div class="binary-breakdown">
    `

    // Show each digit conversion with enhanced styling
    decimal.split("").forEach((digit, i) => {
      const bcdDigit = Number.parseInt(digit).toString(2).padStart(4, "0")
      steps += `<div class="bit-position animate-slide-left" style="animation-delay: ${i * 0.1}s">
        <span class="digit-display">${digit}</span> 
        <span class="arrow">→</span>
        <span class="bcd-display">${bcdDigit}</span>
        <span class="explanation">(${digit} in 4-bit binary)</span>
      </div>`
    })

    steps += `
        </div>
        <div class="result-comparison">
          <p><strong>🎯 BCD Result:</strong> <span class="highlight-result">${bcd}</span></p>
          <p><strong>🔢 Pure Binary:</strong> <span class="highlight-binary">${binary}</span></p>
          <p><strong>📊 Efficiency:</strong> BCD uses ${bcd.replace(/ /g, "").length} bits vs Binary ${binary.length} bits</p>
        </div>
      </div>
      
      <div class="bcd-info">
        <h4>🔍 BCD vs Pure Binary Comparison:</h4>
        <div class="comparison-grid">
          <div class="comparison-item">
            <h5>📱 BCD Advantages:</h5>
            <ul>
              <li>Easy decimal-to-display conversion</li>
              <li>No rounding errors in decimal arithmetic</li>
              <li>Used in calculators, digital clocks</li>
              <li>Human-readable digit mapping</li>
            </ul>
          </div>
          <div class="comparison-item">
            <h5>⚡ Binary Advantages:</h5>
            <ul>
              <li>More memory efficient</li>
              <li>Faster arithmetic operations</li>
              <li>Standard in computer processors</li>
              <li>Optimal for mathematical calculations</li>
            </ul>
          </div>
        </div>
      </div>
    `

    stepsContainer.innerHTML = steps
    document.getElementById("conversion-steps").classList.add("active")
  }

  createInteractiveConversion(decimal) {
    const container = document.getElementById("digit-conversion-container")
    const interactiveSection = document.getElementById("interactive-conversion")

    container.innerHTML = ""
    this.totalDigits = decimal.length
    this.currentStep = 0

    decimal.split("").forEach((digit, index) => {
      const digitDiv = document.createElement("div")
      digitDiv.className = "interactive-digit"
      digitDiv.innerHTML = `
        <div class="digit-card" data-index="${index}">
          <div class="decimal-digit">${digit}</div>
          <div class="conversion-arrow">↓</div>
          <div class="bcd-result" id="bcd-${index}">????</div>
          <div class="bit-breakdown" id="bits-${index}">
            <span class="bit">?</span>
            <span class="bit">?</span>
            <span class="bit">?</span>
            <span class="bit">?</span>
          </div>
        </div>
      `
      container.appendChild(digitDiv)
    })

    interactiveSection.style.display = "block"
  }

  animateConversion() {
    this.currentStep = 0
    const decimal = document.getElementById("decimal-input").value

    const animateDigit = (index) => {
      if (index >= decimal.length) return

      const digit = decimal[index]
      const bcdValue = Number.parseInt(digit).toString(2).padStart(4, "0")
      const card = document.querySelector(`[data-index="${index}"]`)

      // Highlight current card
      card.classList.add("converting")

      // Animate BCD result
      setTimeout(() => {
        document.getElementById(`bcd-${index}`).textContent = bcdValue
        document.getElementById(`bcd-${index}`).classList.add("animate-bounce")
      }, 500)

      // Animate individual bits
      setTimeout(() => {
        const bits = document.querySelectorAll(`#bits-${index} .bit`)
        bcdValue.split("").forEach((bit, bitIndex) => {
          setTimeout(() => {
            bits[bitIndex].textContent = bit
            bits[bitIndex].classList.add("bit-reveal")
          }, bitIndex * 200)
        })
      }, 800)

      // Move to next digit
      setTimeout(() => {
        card.classList.remove("converting")
        card.classList.add("completed")
        animateDigit(index + 1)
      }, 1500)
    }

    // Reset all animations
    document.querySelectorAll(".digit-card").forEach((card) => {
      card.classList.remove("converting", "completed")
    })
    document.querySelectorAll(".bit").forEach((bit) => {
      bit.classList.remove("bit-reveal")
    })

    animateDigit(0)
  }

  stepThroughConversion() {
    const decimal = document.getElementById("decimal-input").value
    if (this.currentStep >= decimal.length) {
      this.currentStep = 0
      this.resetAnimation()
      return
    }

    const digit = decimal[this.currentStep]
    const bcdValue = Number.parseInt(digit).toString(2).padStart(4, "0")
    const card = document.querySelector(`[data-index="${this.currentStep}"]`)

    card.classList.add("converting")
    document.getElementById(`bcd-${this.currentStep}`).textContent = bcdValue

    const bits = document.querySelectorAll(`#bits-${this.currentStep} .bit`)
    bcdValue.split("").forEach((bit, bitIndex) => {
      bits[bitIndex].textContent = bit
      bits[bitIndex].classList.add("bit-reveal")
    })

    setTimeout(() => {
      card.classList.remove("converting")
      card.classList.add("completed")
    }, 500)

    this.currentStep++
  }

  resetAnimation() {
    document.querySelectorAll(".digit-card").forEach((card) => {
      card.classList.remove("converting", "completed")
    })
    document.querySelectorAll(".bcd-result").forEach((result) => {
      result.textContent = "????"
    })
    document.querySelectorAll(".bit").forEach((bit) => {
      bit.textContent = "?"
      bit.classList.remove("bit-reveal")
    })
    this.currentStep = 0
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  showSuccessMessage(message) {
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    document.querySelector(".module-content").appendChild(successDiv)

    setTimeout(() => {
      successDiv.classList.add("show")
    }, 100)

    setTimeout(() => {
      successDiv.remove()
    }, 3000)
  }

  reset() {
    document.getElementById("decimal-input").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.querySelectorAll(".decimal-display").forEach((el) => (el.textContent = ""))
    document.getElementById("step-by-step-explanation").innerHTML =
      "<p>Enter a decimal number to see BCD conversion steps!</p>"
    document.getElementById("conversion-steps").classList.remove("active")
    document.getElementById("interactive-conversion").style.display = "none"
  }

  loadExample() {
    const examples = ["1234", "567", "89", "2024", "9876"]
    const example = examples[Math.floor(Math.random() * examples.length)]
    document.getElementById("decimal-input").value = example

    // Auto-trigger conversion for better UX
    setTimeout(() => this.performConversion(), 500)
  }
}

class BCDArithmeticModule extends LearningModule {
  constructor() {
    super("BCD Arithmetic Operations")
  }

  getHTML() {
    return `
      ${this.createInputSection("➕ BCD Arithmetic", [
        {
          id: "bcd-num1",
          label: "First BCD Number",
          placeholder: "e.g., 0001 0010 0011 0100",
          hint: "BCD format: 4-bit groups separated by spaces",
          type: "BCD number",
        },
        {
          id: "bcd-num2",
          label: "Second BCD Number",
          placeholder: "e.g., 0000 0101 0110 0111",
          hint: "BCD format: 4-bit groups separated by spaces",
          type: "BCD number",
        },
      ])}

      <div class="operation-selector">
        <h3>🔧 Select Operation:</h3>
        <div class="operation-buttons">
          <button class="operation-btn active" data-op="add">➕ Addition</button>
          <button class="operation-btn" data-op="subtract">➖ Subtraction</button>
        </div>
      </div>
      
      ${this.createResultSection("📊 BCD Arithmetic Results", [
        { label: "BCD Result", id: "bcd-arithmetic-result" },
        { label: "Decimal Check", id: "decimal-check-result" },
        { label: "Correction Applied", id: "correction-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 BCD Arithmetic Steps</h2>
        <div class="step-card" id="arithmetic-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step BCD Arithmetic</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="arithmetic-explanation">
              <p>Enter BCD numbers to see arithmetic steps!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
    this.currentOperation = "add"
  }

  setupEventListeners() {
    document.getElementById("bcd-num1")?.addEventListener("input", (e) => {
      this.validateBCDInput(e, "bcd-num1")
    })

    document.getElementById("bcd-num2")?.addEventListener("input", (e) => {
      this.validateBCDInput(e, "bcd-num2")
    })

    document.querySelectorAll(".operation-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".operation-btn").forEach((b) => b.classList.remove("active"))
        e.target.classList.add("active")
        this.currentOperation = e.target.dataset.op
      })
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performArithmetic()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })
  }

  validateBCDInput(event, fieldName) {
    const input = event.target
    const value = input.value
    // Allow only 0, 1, and spaces
    const cleanValue = value.replace(/[^01 ]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById(`${fieldName}-feedback`)
    const bcdGroups = cleanValue
      .trim()
      .split(/\s+/)
      .filter((g) => g.length > 0)
    const isValid = bcdGroups.every((group) => group.length === 4 && /^[01]{4}$/.test(group))

    if (cleanValue.length > 0 && isValid) {
      input.style.borderColor = "#48bb78"
      input.style.backgroundColor = "#f0fff4"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid BCD (${bcdGroups.length} digits)`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      input.style.backgroundColor = "white"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter BCD number"
    } else {
      input.style.borderColor = "#e53e3e"
      input.style.backgroundColor = "#fef5e7"
      feedback.className = "input-feedback error"
      feedback.querySelector(".feedback-icon").textContent = "❌"
      feedback.querySelector(".feedback-text").textContent = "Invalid BCD format"
    }
  }

  performArithmetic() {
    const bcd1 = document.getElementById("bcd-num1").value.trim()
    const bcd2 = document.getElementById("bcd-num2").value.trim()

    if (!this.isValidBCD(bcd1) || !this.isValidBCD(bcd2)) {
      this.showError("Please enter valid BCD numbers!")
      return
    }

    const decimal1 = this.bcdToDecimal(bcd1)
    const decimal2 = this.bcdToDecimal(bcd2)

    let result, decimalResult
    if (this.currentOperation === "add") {
      result = this.bcdAddition(bcd1, bcd2)
      decimalResult = decimal1 + decimal2
    } else {
      result = this.bcdSubtraction(bcd1, bcd2)
      decimalResult = decimal1 - decimal2
    }

    // Update results
    this.animateResult("bcd-arithmetic-result", result.bcd)
    this.animateResult("decimal-check-result", `${decimalResult}`)
    this.animateResult("correction-result", result.correctionApplied ? "Yes" : "No")

    // Show detailed steps
    this.showArithmeticSteps(bcd1, bcd2, result, decimal1, decimal2, decimalResult)

    this.showSuccessMessage(`BCD ${this.currentOperation} completed! 🎉`)
  }

  isValidBCD(bcd) {
    const groups = bcd
      .trim()
      .split(/\s+/)
      .filter((g) => g.length > 0)
    return groups.every((group) => group.length === 4 && /^[01]{4}$/.test(group) && Number.parseInt(group, 2) <= 9)
  }

  bcdToDecimal(bcd) {
    return bcd
      .trim()
      .split(/\s+/)
      .map((group) => Number.parseInt(group, 2))
      .join("")
  }

  bcdAddition(bcd1, bcd2) {
    const groups1 = bcd1.trim().split(/\s+/)
    const groups2 = bcd2.trim().split(/\s+/)

    // Pad to same length
    const maxLen = Math.max(groups1.length, groups2.length)
    while (groups1.length < maxLen) groups1.unshift("0000")
    while (groups2.length < maxLen) groups2.unshift("0000")

    const result = []
    let carry = 0
    let correctionApplied = false
    const steps = []

    for (let i = maxLen - 1; i >= 0; i--) {
      const digit1 = Number.parseInt(groups1[i], 2)
      const digit2 = Number.parseInt(groups2[i], 2)
      let sum = digit1 + digit2 + carry

      steps.push({
        position: maxLen - 1 - i,
        digit1,
        digit2,
        carry: carry,
        sum: sum,
        needsCorrection: sum > 9,
        correctedSum: sum > 9 ? sum + 6 : sum,
      })

      if (sum > 9) {
        sum += 6 // BCD correction
        correctionApplied = true
      }

      carry = Math.floor(sum / 16)
      result.unshift((sum % 16).toString(2).padStart(4, "0"))
    }

    if (carry > 0) {
      result.unshift(carry.toString(2).padStart(4, "0"))
    }

    return {
      bcd: result.join(" "),
      correctionApplied,
      steps,
    }
  }

  bcdSubtraction(bcd1, bcd2) {
    // For simplicity, convert to decimal, subtract, then convert back
    const decimal1 = Number.parseInt(this.bcdToDecimal(bcd1))
    const decimal2 = Number.parseInt(this.bcdToDecimal(bcd2))
    const result = decimal1 - decimal2

    if (result < 0) {
      return {
        bcd: "Negative result",
        correctionApplied: false,
        steps: [],
      }
    }

    const resultBCD = result
      .toString()
      .split("")
      .map((digit) => Number.parseInt(digit).toString(2).padStart(4, "0"))
      .join(" ")

    return {
      bcd: resultBCD,
      correctionApplied: false,
      steps: [],
    }
  }

  showArithmeticSteps(bcd1, bcd2, result, decimal1, decimal2, decimalResult) {
    const container = document.getElementById("arithmetic-explanation")
    const operation = this.currentOperation === "add" ? "Addition" : "Subtraction"
    const symbol = this.currentOperation === "add" ? "+" : "-"

    let steps = `
      <h4>🧮 BCD ${operation} Process:</h4>
      <div class="arithmetic-display">
        <div class="operands">
          <div class="operand">
            <span class="label">BCD 1:</span>
            <span class="bcd-value">${bcd1}</span>
            <span class="decimal-equiv">(${decimal1})</span>
          </div>
          <div class="operator">${symbol}</div>
          <div class="operand">
            <span class="label">BCD 2:</span>
            <span class="bcd-value">${bcd2}</span>
            <span class="decimal-equiv">(${decimal2})</span>
          </div>
          <div class="equals">=</div>
          <div class="result">
            <span class="label">Result:</span>
            <span class="bcd-value highlight-result">${result.bcd}</span>
            <span class="decimal-equiv">(${decimalResult})</span>
          </div>
        </div>
      </div>
    `

    if (this.currentOperation === "add" && result.steps) {
      steps += `
        <div class="detailed-steps">
          <h5>🔍 Detailed Addition Steps:</h5>
          <div class="steps-grid">
      `

      result.steps.forEach((step, index) => {
        steps += `
          <div class="step-item ${step.needsCorrection ? "needs-correction" : ""}">
            <div class="step-header">Position ${step.position}</div>
            <div class="step-calc">
              ${step.digit1} + ${step.digit2} + ${step.carry} = ${step.sum}
              ${step.needsCorrection ? ` → ${step.correctedSum} (corrected)` : ""}
            </div>
          </div>
        `
      })

      steps += `
          </div>
          <div class="correction-note">
            ${
              result.correctionApplied
                ? "⚠️ <strong>BCD Correction Applied:</strong> When sum > 9, add 6 to get valid BCD"
                : "✅ <strong>No Correction Needed:</strong> All sums ≤ 9"
            }
          </div>
        </div>
      `
    }

    steps += `
      <div class="bcd-arithmetic-info">
        <h5>📚 BCD Arithmetic Rules:</h5>
        <ul>
          <li><strong>Addition:</strong> Add normally, then add 6 if result > 9</li>
          <li><strong>Subtraction:</strong> Use 9's or 10's complement method</li>
          <li><strong>Range:</strong> Each 4-bit group represents 0-9 only</li>
          <li><strong>Usage:</strong> Calculators, financial systems, displays</li>
        </ul>
      </div>
    `

    container.innerHTML = steps
    document.getElementById("arithmetic-steps").classList.add("active")
  }

  animateResult(elementId, text) {
    const element = document.getElementById(elementId)
    element.style.opacity = "0"
    element.style.transform = "scale(0.8)"

    setTimeout(() => {
      element.textContent = text
      element.style.opacity = "1"
      element.style.transform = "scale(1)"
      element.classList.add("animate-bounce")
      setTimeout(() => element.classList.remove("animate-bounce"), 800)
    }, 200)
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  showSuccessMessage(message) {
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    document.querySelector(".module-content").appendChild(successDiv)

    setTimeout(() => successDiv.classList.add("show"), 100)
    setTimeout(() => successDiv.remove(), 3000)
  }

  reset() {
    document.getElementById("bcd-num1").value = ""
    document.getElementById("bcd-num2").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.getElementById("arithmetic-explanation").innerHTML = "<p>Enter BCD numbers to see arithmetic steps!</p>"
    document.getElementById("arithmetic-steps").classList.remove("active")
  }

  loadExample() {
    const examples = [
      { num1: "0001 0010 0011 0100", num2: "0000 0101 0110 0111" },
      { num1: "0001 0000 0010 0101", num2: "0000 0011 0111 0101" },
      { num1: "0010 0100 0110 0000", num2: "0001 0010 0011 0000" },
    ]
    const example = examples[Math.floor(Math.random() * examples.length)]

    document.getElementById("bcd-num1").value = example.num1
    document.getElementById("bcd-num2").value = example.num2

    setTimeout(() => this.performArithmetic(), 500)
  }
}

class OnesComplementModule extends LearningModule {
  constructor() {
    super("1's Complement Arithmetic")
  }

  getHTML() {
    return `
      ${this.createInputSection("🔄 1's Complement Operations", [
        {
          id: "ones-num1",
          label: "First Binary Number",
          placeholder: "e.g., 1101",
          hint: "Binary digits only (0-8 bits)",
          type: "binary number",
        },
        {
          id: "ones-num2",
          label: "Second Binary Number",
          placeholder: "e.g., 0011",
          hint: "Binary digits only (0-8 bits)",
          type: "binary number",
        },
      ])}

      <div class="operation-selector">
        <h3>🔧 Select Operation:</h3>
        <div class="operation-buttons">
          <button class="operation-btn active" data-op="add">➕ Addition</button>
          <button class="operation-btn" data-op="subtract">➖ Subtraction</button>
          <button class="operation-btn" data-op="complement">🔄 Find 1's Complement</button>
        </div>
      </div>
      
      ${this.createResultSection("📊 1's Complement Results", [
        { label: "Result", id: "ones-result" },
        { label: "End-Around Carry", id: "carry-result" },
        { label: "Final Answer", id: "final-ones-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 1's Complement Steps</h2>
        <div class="step-card" id="ones-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step 1's Complement Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="ones-explanation">
              <p>Enter binary numbers to see 1's complement arithmetic!</p>
            </div>
            <div class="interactive-ones" id="interactive-ones" style="display: none;">
              <h4>🎯 Interactive 1's Complement:</h4>
              <div class="bit-flip-demo" id="bit-flip-demo"></div>
              <div class="ones-controls">
                <button class="nav-btn" id="animate-flip">▶️ Animate Bit Flip</button>
                <button class="nav-btn" id="step-flip">👆 Step Through Bits</button>
                <button class="nav-btn" id="reset-flip">🔄 Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
    this.currentOperation = "add"
    this.currentBitStep = 0
  }

  setupEventListeners() {
    document.getElementById("ones-num1")?.addEventListener("input", (e) => {
      this.validateBinaryInput(e, "ones-num1")
    })

    document.getElementById("ones-num2")?.addEventListener("input", (e) => {
      this.validateBinaryInput(e, "ones-num2")
    })

    document.querySelectorAll(".operation-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".operation-btn").forEach((b) => b.classList.remove("active"))
        e.target.classList.add("active")
        this.currentOperation = e.target.dataset.op

        // Show/hide second input based on operation
        const num2Container = document.getElementById("ones-num2").closest(".input-field")
        if (this.currentOperation === "complement") {
          num2Container.style.display = "none"
        } else {
          num2Container.style.display = "block"
        }
      })
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performOperation()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })

    document.getElementById("animate-flip")?.addEventListener("click", () => {
      this.animateBitFlip()
    })

    document.getElementById("step-flip")?.addEventListener("click", () => {
      this.stepThroughBits()
    })

    document.getElementById("reset-flip")?.addEventListener("click", () => {
      this.resetBitFlip()
    })
  }

  validateBinaryInput(event, fieldName) {
    const input = event.target
    const value = input.value
    const cleanValue = value.replace(/[^01]/g, "").slice(0, 8)

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById(`${fieldName}-feedback`)
    if (cleanValue.length > 0 && /^[01]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      input.style.backgroundColor = "#f0fff4"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid binary (${cleanValue.length} bits)`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      input.style.backgroundColor = "white"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter binary number"
    } else {
      input.style.borderColor = "#e53e3e"
      input.style.backgroundColor = "#fef5e7"
      feedback.className = "input-feedback error"
      feedback.querySelector(".feedback-icon").textContent = "❌"
      feedback.querySelector(".feedback-text").textContent = "Invalid BCD format"
    }
  }

  performOperation() {
    const num1 = document.getElementById("ones-num1").value.trim()
    const num2 = this.currentOperation !== "complement" ? document.getElementById("ones-num2").value.trim() : ""

    if (!num1 || (this.currentOperation !== "complement" && !num2)) {
      this.showError("Please enter required binary numbers!")
      return
    }

    if (!/^[01]+$/.test(num1) || (num2 && !/^[01]+$/.test(num2))) {
      this.showError("Please enter valid binary numbers!")
      return
    }

    let result
    switch (this.currentOperation) {
      case "add":
        result = this.onesComplementAddition(num1, num2)
        break
      case "subtract":
        result = this.onesComplementSubtraction(num1, num2)
        break
      case "complement":
        result = this.findOnesComplement(num1)
        break
    }

    this.displayResults(result)
    this.showOperationSteps(num1, num2, result)

    if (this.currentOperation === "complement") {
      this.createBitFlipDemo(num1, result.complement)
    }

    this.showSuccessMessage(`1's complement ${this.currentOperation} completed! 🎉`)
  }

  onesComplementAddition(num1, num2) {
    // Pad to same length
    const maxLen = Math.max(num1.length, num2.length)
    const a = num1.padStart(maxLen, "0")
    const b = num2.padStart(maxLen, "0")

    let result = ""
    let carry = 0
    const steps = []

    // Binary addition
    for (let i = maxLen - 1; i >= 0; i--) {
      const bit1 = Number.parseInt(a[i])
      const bit2 = Number.parseInt(b[i])
      const sum = bit1 + bit2 + carry

      steps.push({
        position: maxLen - 1 - i,
        bit1,
        bit2,
        carry,
        sum: sum % 2,
        newCarry: Math.floor(sum / 2),
      })

      result = (sum % 2) + result
      carry = Math.floor(sum / 2)
    }

    // End-around carry for 1's complement
    if (carry === 1) {
      let finalResult = ""
      let endCarry = 1

      for (let i = result.length - 1; i >= 0; i--) {
        const sum = Number.parseInt(result[i]) + endCarry
        finalResult = (sum % 2) + finalResult
        endCarry = Math.floor(sum / 2)
      }

      return {
        operation: "addition",
        operand1: a,
        operand2: b,
        initialResult: result,
        endAroundCarry: carry,
        finalResult: finalResult,
        steps,
      }
    }

    return {
      operation: "addition",
      operand1: a,
      operand2: b,
      initialResult: result,
      endAroundCarry: 0,
      finalResult: result,
      steps,
    }
  }

  onesComplementSubtraction(num1, num2) {
    // A - B = A + 1's complement of B
    const complement = this.findOnesComplement(num2)
    return this.onesComplementAddition(num1, complement.complement)
  }

  findOnesComplement(binary) {
    const complement = binary
      .split("")
      .map((bit) => (bit === "0" ? "1" : "0"))
      .join("")

    return {
      operation: "complement",
      original: binary,
      complement: complement,
      steps: binary.split("").map((bit, index) => ({
        position: index,
        original: bit,
        flipped: bit === "0" ? "1" : "0",
      })),
    }
  }

  displayResults(result) {
    if (result.operation === "complement") {
      this.animateResult("ones-result", result.complement)
      this.animateResult("carry-result", "N/A")
      this.animateResult("final-ones-result", result.complement)
    } else {
      this.animateResult("ones-result", result.initialResult)
      this.animateResult("carry-result", result.endAroundCarry ? "Yes (1)" : "No (0)")
      this.animateResult("final-ones-result", result.finalResult)
    }

    // Update info displays
    document.getElementById("ones-result-info").textContent =
      result.operation === "complement" ? "(Bits flipped)" : "(Before end-around carry)"
    document.getElementById("carry-result-info").textContent = "(Applied to LSB)"
    document.getElementById("final-ones-result-info").textContent = "(Final answer)"
  }

  showOperationSteps(num1, num2, result) {
    const container = document.getElementById("ones-explanation")
    let steps = ""

    if (result.operation === "complement") {
      steps = `
        <h4>🔄 1's Complement Process:</h4>
        <div class="complement-display">
          <div class="original-number">
            <span class="label">Original:</span>
            <span class="binary-value">${result.original}</span>
            <span class="decimal-equiv">(${Number.parseInt(result.original, 2)})</span>
          </div>
          <div class="flip-arrow">↓ Flip all bits ↓</div>
          <div class="complement-number">
            <span class="label">1's Complement:</span>
            <span class="binary-value highlight-result">${result.complement}</span>
            <span class="decimal-equiv">(${Number.parseInt(result.complement, 2)})</span>
          </div>
        </div>
        
        <div class="bit-by-bit">
          <h5>🔍 Bit-by-bit flipping:</h5>
          <div class="flip-demonstration">
      `

      result.steps.forEach((step) => {
        steps += `
          <div class="bit-flip-step">
            <span class="original-bit">${step.original}</span>
            <span class="arrow">→</span>
            <span class="flipped-bit">${step.flipped}</span>
          </div>
        `
      })

      steps += `
          </div>
        </div>
      `
    } else {
      const operation = result.operation === "addition" ? "Addition" : "Subtraction"
      steps = `
        <h4>➕ 1's Complement ${operation}:</h4>
        <div class="arithmetic-display">
          <div class="operands">
            <div class="operand">
              <span class="label">A:</span>
              <span class="binary-value">${result.operand1}</span>
            </div>
            <div class="operand">
              <span class="label">B:</span>
              <span class="binary-value">${result.operand2}</span>
            </div>
          </div>
          
          <div class="calculation-steps">
            <div class="step">
              <span class="label">Initial Sum:</span>
              <span class="binary-value">${result.initialResult}</span>
            </div>
            <div class="step">
              <span class="label">End-Around Carry:</span>
              <span class="carry-value">${result.endAroundCarry}</span>
            </div>
            <div class="step final-step">
              <span class="label">Final Result:</span>
              <span class="binary-value highlight-result">${result.finalResult}</span>
            </div>
          </div>
        </div>
        
        <div class="ones-complement-info">
          <h5>📚 1's Complement Rules:</h5>
          <ul>
            <li><strong>Addition:</strong> Add normally, then add any carry to LSB</li>
            <li><strong>Subtraction:</strong> A - B = A + 1's complement of B</li>
            <li><strong>End-Around Carry:</strong> Essential for correct 1's complement arithmetic</li>
            <li><strong>Range:</strong> -(2^(n-1) - 1) to +(2^(n-1) - 1)</li>
          </ul>
        </div>
      `
    }

    container.innerHTML = steps
    document.getElementById("ones-steps").classList.add("active")
  }

  createBitFlipDemo(original, complement) {
    const container = document.getElementById("bit-flip-demo")
    const interactiveSection = document.getElementById("interactive-ones")

    container.innerHTML = ""
    this.currentBitStep = 0

    const demoDiv = document.createElement("div")
    demoDiv.className = "flip-demo-container"
    demoDiv.innerHTML = `
      <div class="demo-row">
        <span class="demo-label">Original:</span>
        <div class="demo-bits original-bits">
          ${original
            .split("")
            .map((bit, i) => `<span class="demo-bit" data-index="${i}">${bit}</span>`)
            .join("")}
        </div>
      </div>
      <div class="demo-row">
        <span class="demo-label">1's Complement:</span>
        <div class="demo-bits complement-bits">
          ${complement
            .split("")
            .map((bit, i) => `<span class="demo-bit" data-index="${i}" id="comp-${i}">?</span>`)
            .join("")}
        </div>
      </div>
    `

    container.appendChild(demoDiv)
    interactiveSection.style.display = "block"
  }

  animateBitFlip() {
    const original = document.getElementById("ones-num1").value
    const complement = this.findOnesComplement(original).complement

    this.currentBitStep = 0

    const flipBit = (index) => {
      if (index >= original.length) return

      const originalBit = document.querySelector(`.original-bits [data-index="${index}"]`)
      const complementBit = document.getElementById(`comp-${index}`)

      originalBit.classList.add("flipping")

      setTimeout(() => {
        complementBit.textContent = complement[index]
        complementBit.classList.add("bit-reveal")
        originalBit.classList.remove("flipping")
        originalBit.classList.add("flipped")

        setTimeout(() => flipBit(index + 1), 300)
      }, 400)
    }

    // Reset animation
    document.querySelectorAll(".demo-bit").forEach((bit) => {
      bit.classList.remove("flipping", "flipped", "bit-reveal")
    })
    document.querySelectorAll(".complement-bits .demo-bit").forEach((bit) => {
      bit.textContent = "?"
    })

    flipBit(0)
  }

  stepThroughBits() {
    const original = document.getElementById("ones-num1").value
    const complement = this.findOnesComplement(original).complement

    if (this.currentBitStep >= original.length) {
      this.currentBitStep = 0
      this.resetBitFlip()
      return
    }

    const originalBit = document.querySelector(`.original-bits [data-index="${this.currentBitStep}"]`)
    const complementBit = document.getElementById(`comp-${this.currentBitStep}`)

    originalBit.classList.add("flipping")
    complementBit.textContent = complement[this.currentBitStep]
    complementBit.classList.add("bit-reveal")

    setTimeout(() => {
      originalBit.classList.remove("flipping")
      originalBit.classList.add("flipped")
    }, 400)

    this.currentBitStep++
  }

  resetBitFlip() {
    document.querySelectorAll(".demo-bit").forEach((bit) => {
      bit.classList.remove("flipping", "flipped", "bit-reveal")
    })
    document.querySelectorAll(".complement-bits .demo-bit").forEach((bit) => {
      bit.textContent = "?"
    })
    this.currentBitStep = 0
  }

  animateResult(elementId, text) {
    const element = document.getElementById(elementId)
    element.style.opacity = "0"
    element.style.transform = "scale(0.8)"

    setTimeout(() => {
      element.textContent = text
      element.style.opacity = "1"
      element.style.transform = "scale(1)"
      element.classList.add("animate-bounce")
      setTimeout(() => element.classList.remove("animate-bounce"), 800)
    }, 200)
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  showSuccessMessage(message) {
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    document.querySelector(".module-content").appendChild(successDiv)

    setTimeout(() => successDiv.classList.add("show"), 100)
    setTimeout(() => successDiv.remove(), 3000)
  }

  reset() {
    document.getElementById("ones-num1").value = ""
    document.getElementById("ones-num2").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.getElementById("ones-explanation").innerHTML =
      "<p>Enter binary numbers to see 1's complement arithmetic!</p>"
    document.getElementById("ones-steps").classList.remove("active")
    document.getElementById("interactive-ones").style.display = "none"
  }

  loadExample() {
    const examples = [
      { num1: "1101", num2: "0011" },
      { num1: "1010", num2: "0110" },
      { num1: "11001", num2: "01010" },
    ]
    const example = examples[Math.floor(Math.random() * examples.length)]

    document.getElementById("ones-num1").value = example.num1
    if (this.currentOperation !== "complement") {
      document.getElementById("ones-num2").value = example.num2
    }

    setTimeout(() => this.performOperation(), 500)
  }
}

class DecimalConversionsModule extends LearningModule {
  constructor() {
    super("Decimal Number Conversions")
  }

  getHTML() {
    return `
      ${this.createInputSection("🔢 Decimal to Other Number Systems", [
        {
          id: "decimal-input",
          label: "Decimal Number",
          placeholder: "e.g., 123",
          hint: "Decimal digits only (0-9)",
          type: "decimal number",
        },
      ])}
      
      ${this.createResultSection("📊 Conversion Results", [
        { label: "Binary", id: "binary-result" },
        { label: "Octal", id: "octal-result" },
        { label: "Hexadecimal", id: "hex-result" },
      ])}
      
      <section class="steps-section">
        <h2>📚 Conversion Steps</h2>
        <div class="step-card" id="conversion-steps">
          <div class="step-header">
            <span class="step-number">🔍</span>
            <h3>Step-by-Step Process</h3>
            <span class="step-status">⏳</span>
          </div>
          <div class="step-content">
            <div id="step-by-step-explanation">
              <p>Enter a decimal number to see detailed conversion steps!</p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById("decimal-input")?.addEventListener("input", (e) => {
      this.validateDecimalInput(e)
    })

    document.getElementById("convert-btn")?.addEventListener("click", () => {
      this.performConversion()
    })

    document.getElementById("reset-btn")?.addEventListener("click", () => {
      this.reset()
    })

    document.getElementById("example-btn")?.addEventListener("click", () => {
      this.loadExample()
    })
  }

  validateDecimalInput(event) {
    const input = event.target
    const value = input.value
    const cleanValue = value.replace(/[^0-9]/g, "")

    if (input.value !== cleanValue) {
      input.value = cleanValue
    }

    const feedback = document.getElementById("decimal-input-feedback")
    if (cleanValue.length > 0 && /^[0-9]+$/.test(cleanValue)) {
      input.style.borderColor = "#48bb78"
      feedback.className = "input-feedback success"
      feedback.querySelector(".feedback-icon").textContent = "✅"
      feedback.querySelector(".feedback-text").textContent = `Valid decimal`
    } else if (cleanValue.length === 0) {
      input.style.borderColor = "#e2e8f0"
      feedback.className = "input-feedback"
      feedback.querySelector(".feedback-icon").textContent = "💡"
      feedback.querySelector(".feedback-text").textContent = "Enter decimal number"
    }
  }

  performConversion() {
    const decimalInput = document.getElementById("decimal-input").value.trim()

    if (!decimalInput || !/^[0-9]+$/.test(decimalInput)) {
      this.showError("Please enter a valid decimal number!")
      return
    }

    const decimal = Number.parseInt(decimalInput)
    const binary = decimal.toString(2)
    const octal = decimal.toString(8)
    const hex = decimal.toString(16).toUpperCase()

    // Update results
    document.getElementById("binary-result").textContent = binary
    document.getElementById("octal-result").textContent = octal
    document.getElementById("hex-result").textContent = hex

    // Update info displays
    document.getElementById("binary-result-info").textContent = `(Base 2)`
    document.getElementById("octal-result-info").textContent = `(Base 8)`
    document.getElementById("hex-result-info").textContent = `(Base 16)`

    // Show detailed steps
    this.showConversionSteps(decimalInput, binary, octal, hex)

    // Animate results
    document.querySelectorAll(".binary-number").forEach((el) => {
      el.classList.add("animate-bounce")
      setTimeout(() => el.classList.remove("animate-bounce"), 800)
    })
  }

  showConversionSteps(decimal, binary, octal, hex) {
    const stepsContainer = document.getElementById("step-by-step-explanation")

    const steps = `
      <h4>🔢 Decimal Conversions:</h4>
      <div class="conversion-table">
        <p><strong>Decimal:</strong> ${decimal}</p>
        <div class="conversion-methods">
          <div class="method">
            <h5>To Binary (Base 2):</h5>
            <p>Divide by 2, collect remainders: ${binary}</p>
          </div>
          <div class="method">
            <h5>To Octal (Base 8):</h5>
            <p>Divide by 8, collect remainders: ${octal}</p>
          </div>
          <div class="method">
            <h5>To Hexadecimal (Base 16):</h5>
            <p>Divide by 16, collect remainders: ${hex}</p>
          </div>
        </div>
      </div>
    `

    stepsContainer.innerHTML = steps
    document.getElementById("conversion-steps").classList.add("active")
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
    setTimeout(() => errorDiv.classList.remove("show"), 5000)
  }

  reset() {
    document.getElementById("decimal-input").value = ""
    document.querySelectorAll(".binary-number").forEach((el) => (el.textContent = "----"))
    document.querySelectorAll(".decimal-display").forEach((el) => (el.textContent = ""))
    document.getElementById("step-by-step-explanation").innerHTML =
      "<p>Enter a decimal number to see detailed conversion steps!</p>"
    document.getElementById("conversion-steps").classList.remove("active")
  }

  loadExample() {
    const examples = ["123", "456", "789", "2024"]
    const example = examples[Math.floor(Math.random() * examples.length)]
    document.getElementById("decimal-input").value = example
    document.getElementById("decimal-input").dispatchEvent(new Event("input"))
  }
}

class GrayCodeModule extends LearningModule {
  constructor() {
    super("Gray Code Conversion")
  }

  getHTML() {
    return `
      <div class="card">
        <h2>🔄 Gray Code Conversion</h2>
        <p>Learn Gray code conversion with interactive demonstrations!</p>
        
        <div class="tabs">
          <button class="tab-btn active" onclick="this.parentElement.parentElement.querySelector('.gray-code').showTab('binary-to-gray')">Binary → Gray</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.gray-code').showTab('gray-to-binary')">Gray → Binary</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.gray-code').showTab('table')">Code Table</button>
        </div>

        <div class="gray-code">
          <div class="tab-content active" id="binary-to-gray-tab">
            <h3>Binary to Gray Code</h3>
            <div class="input-group">
              <label>Binary Number:</label>
              <input type="text" id="binary-input" placeholder="1010" maxlength="8">
              <button onclick="this.closest('.gray-code').convertBinaryToGray()" class="btn">Convert</button>
            </div>
            <div id="binary-to-gray-steps" class="steps-container"></div>
          </div>

          <div class="tab-content" id="gray-to-binary-tab">
            <h3>Gray Code to Binary</h3>
            <div class="input-group">
              <label>Gray Code:</label>
              <input type="text" id="gray-input" placeholder="1111" maxlength="8">
              <button onclick="this.closest('.gray-code').convertGrayToBinary()" class="btn">Convert</button>
            </div>
            <div id="gray-to-binary-steps" class="steps-container"></div>
          </div>

          <div class="tab-content" id="table-tab">
            <h3>Binary vs Gray Code Table</h3>
            <div id="code-table" class="code-table"></div>
          </div>
        </div>
      </div>
    `
  }

  initialize() {
    this.init()
  }

  init() {
    const container = document.querySelector(".gray-code")

    container.showTab = function (tabName) {
      this.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
      this.parentElement.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))

      document.getElementById(tabName + "-tab").classList.add("active")
      event.target.classList.add("active")

      if (tabName === "table") {
        this.generateCodeTable()
      }
    }

    container.convertBinaryToGray = function () {
      const binary = document.getElementById("binary-input").value.trim()

      if (!/^[01]+$/.test(binary)) {
        alert("Please enter valid binary number (0s and 1s only)")
        return
      }

      const steps = []
      let gray = binary[0] // First bit remains same

      steps.push({
        type: "rule",
        content: '<div class="rule-explanation"><strong>Rule:</strong> G₀ = B₀, Gᵢ = Bᵢ₋₁ ⊕ Bᵢ</div>',
      })

      steps.push({
        type: "step",
        content: `<div class="step-explanation"><strong>G₀ = B₀ = ${binary[0]}</strong></div>`,
      })

      for (let i = 1; i < binary.length; i++) {
        const prevBit = binary[i - 1]
        const currBit = binary[i]
        const grayBit = prevBit === currBit ? "0" : "1"
        gray += grayBit

        steps.push({
          type: "step",
          content: `
            <div class="step-explanation">
              <strong>G${i} = B${i - 1} ⊕ B${i} = ${prevBit} ⊕ ${currBit} = ${grayBit}</strong>
            </div>
          `,
        })
      }

      steps.push({
        type: "result",
        content: `
          <div class="result-display">
            <strong>Binary: ${binary}</strong><br>
            <strong>Gray Code: ${gray}</strong>
          </div>
        `,
      })

      this.displaySteps("binary-to-gray-steps", steps)
    }

    container.convertGrayToBinary = function () {
      const gray = document.getElementById("gray-input").value.trim()

      if (!/^[01]+$/.test(gray)) {
        alert("Please enter valid Gray code (0s and 1s only)")
        return
      }

      const steps = []
      let binary = gray[0] // First bit remains same

      steps.push({
        type: "rule",
        content: '<div class="rule-explanation"><strong>Rule:</strong> B₀ = G₀, Bᵢ = Bᵢ₋₁ ⊕ Gᵢ</div>',
      })

      steps.push({
        type: "step",
        content: `<div class="step-explanation"><strong>B₀ = G₀ = ${gray[0]}</strong></div>`,
      })

      for (let i = 1; i < gray.length; i++) {
        const prevBinaryBit = binary[i - 1]
        const currGrayBit = gray[i]
        const binaryBit = prevBinaryBit === currGrayBit ? "0" : "1"
        binary += binaryBit

        steps.push({
          type: "step",
          content: `
            <div class="step-explanation">
              <strong>B${i} = B${i - 1} ⊕ G${i} = ${prevBinaryBit} ⊕ ${currGrayBit} = ${binaryBit}</strong>
            </div>
          `,
        })
      }

      steps.push({
        type: "result",
        content: `
          <div class="result-display">
            <strong>Gray Code: ${gray}</strong><br>
            <strong>Binary: ${binary}</strong>
          </div>
        `,
      })

      this.displaySteps("gray-to-binary-steps", steps)
    }

    container.generateCodeTable = function () {
      const tableContainer = document.getElementById("code-table")
      let tableHTML = `
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Decimal</th>
              <th>Binary</th>
              <th>Gray Code</th>
            </tr>
          </thead>
          <tbody>
      `

      for (let i = 0; i < 16; i++) {
        const binary = i.toString(2).padStart(4, "0")
        const gray = this.binaryToGray(binary)
        tableHTML += `
          <tr>
            <td>${i}</td>
            <td>${binary}</td>
            <td>${gray}</td>
          </tr>
        `
      }

      tableHTML += "</tbody></table>"
      tableContainer.innerHTML = tableHTML
    }

    container.binaryToGray = (binary) => {
      let gray = binary[0]
      for (let i = 1; i < binary.length; i++) {
        gray += binary[i - 1] === binary[i] ? "0" : "1"
      }
      return gray
    }

    container.displaySteps = (containerId, steps) => {
      const container = document.getElementById(containerId)
      container.innerHTML = ""

      steps.forEach((step, index) => {
        setTimeout(() => {
          const stepDiv = document.createElement("div")
          stepDiv.className = `step ${step.type}`
          stepDiv.innerHTML = step.content
          stepDiv.style.opacity = "0"
          container.appendChild(stepDiv)

          setTimeout(() => {
            stepDiv.style.opacity = "1"
            stepDiv.style.transform = "translateY(0)"
          }, 100)
        }, index * 500)
      })
    }
  }
}

class ASCIICodeModule extends LearningModule {
  constructor() {
    super("ASCII Code System")
  }

  getHTML() {
    return `
      <div class="card">
        <h2>📝 ASCII Code System</h2>
        <p>Learn ASCII character encoding with interactive tools!</p>
        
        <div class="tabs">
          <button class="tab-btn active" onclick="this.parentElement.parentElement.querySelector('.ascii-code').showTab('converter')">Character Converter</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.ascii-code').showTab('table')">ASCII Table</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.ascii-code').showTab('text')">Text Encoder</button>
        </div>

        <div class="ascii-code">
          <div class="tab-content active" id="converter-tab">
            <h3>Character to ASCII Converter</h3>
            <div class="input-group">
              <label>Enter a Character:</label>
              <input type="text" id="char-input" placeholder="A" maxlength="1">
              <button onclick="this.closest('.ascii-code').convertCharacter()" class="btn">Convert</button>
            </div>
            <div class="input-group">
              <label>Enter ASCII Code:</label>
              <input type="number" id="ascii-input" placeholder="65" min="0" max="127">
              <button onclick="this.closest('.ascii-code').convertASCII()" class="btn">Convert</button>
            </div>
            <div id="conversion-result" class="result-container"></div>
          </div>

          <div class="tab-content" id="table-tab">
            <h3>ASCII Character Table</h3>
            <div class="ascii-controls">
              <button onclick="this.parentElement.parentElement.querySelector('.ascii-code').showRange('printable')" class="btn">Printable Characters</button>
              <button onclick="this.parentElement.parentElement.querySelector('.ascii-code').showRange('control')" class="btn">Control Characters</button>
              <button onclick="this.parentElement.parentElement.querySelector('.ascii-code').showRange('all')" class="btn">All Characters</button>
            </div>
            <div id="ascii-table" class="ascii-table"></div>
          </div>

          <div class="tab-content" id="text-tab">
            <h3>Text to ASCII Encoder</h3>
            <div class="input-group">
              <label>Enter Text:</label>
              <textarea id="text-input" placeholder="Hello World!" rows="3"></textarea>
              <button onclick="this.closest('.ascii-code').encodeText()" class="btn">Encode Text</button>
            </div>
            <div id="text-encoding-result" class="result-container"></div>
          </div>
        </div>
      </div>
    `
  }

  initialize() {
    this.init()
  }

  init() {
    const container = document.querySelector(".ascii-code")

    container.showTab = function (tabName) {
      this.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
      this.parentElement.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))

      document.getElementById(tabName + "-tab").classList.add("active")
      event.target.classList.add("active")

      if (tabName === "table") {
        this.showRange("printable")
      }
    }

    container.convertCharacter = function () {
      const char = document.getElementById("char-input").value

      if (char.length !== 1) {
        alert("Please enter exactly one character")
        return
      }

      const ascii = char.charCodeAt(0)
      const binary = ascii.toString(2).padStart(8, "0")
      const hex = ascii.toString(16).toUpperCase().padStart(2, "0")

      const result = `
        <div class="conversion-display">
          <h4>Character: '${char}'</h4>
          <div class="conversion-row">
            <span class="label">ASCII Decimal:</span>
            <span class="value">${ascii}</span>
          </div>
          <div class="conversion-row">
            <span class="label">Binary:</span>
            <span class="value">${binary}</span>
          </div>
          <div class="conversion-row">
            <span class="label">Hexadecimal:</span>
            <span class="value">0x${hex}</span>
          </div>
          <div class="conversion-row">
            <span class="label">Category:</span>
            <span class="value">${this.getCharacterCategory(ascii)}</span>
          </div>
        </div>
      `

      document.getElementById("conversion-result").innerHTML = result
    }

    container.convertASCII = function () {
      const ascii = Number.parseInt(document.getElementById("ascii-input").value)

      if (isNaN(ascii) || ascii < 0 || ascii > 127) {
        alert("Please enter a valid ASCII code (0-127)")
        return
      }

      const char = String.fromCharCode(ascii)
      const binary = ascii.toString(2).padStart(8, "0")
      const hex = ascii.toString(16).toUpperCase().padStart(2, "0")

      const result = `
        <div class="conversion-display">
          <h4>ASCII Code: ${ascii}</h4>
          <div class="conversion-row">
            <span class="label">Character:</span>
            <span class="value">'${ascii < 32 ? this.getControlCharName(ascii) : char}'</span>
          </div>
          <div class="conversion-row">
            <span class="label">Binary:</span>
            <span class="value">${binary}</span>
          </div>
          <div class="conversion-row">
            <span class="label">Hexadecimal:</span>
            <span class="value">0x${hex}</span>
          </div>
          <div class="conversion-row">
            <span class="label">Category:</span>
            <span class="value">${this.getCharacterCategory(ascii)}</span>
          </div>
        </div>
      `

      document.getElementById("conversion-result").innerHTML = result
    }

    container.encodeText = () => {
      const text = document.getElementById("text-input").value

      if (!text) {
        alert("Please enter some text")
        return
      }

      let result = '<div class="text-encoding-display"><h4>Text Encoding Results:</h4>'

      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const ascii = char.charCodeAt(0)
        const binary = ascii.toString(2).padStart(8, "0")

        result += `
          <div class="char-encoding">
            <span class="char">'${char}'</span>
            <span class="ascii">${ascii}</span>
            <span class="binary">${binary}</span>
          </div>
        `
      }

      result += "</div>"
      document.getElementById("text-encoding-result").innerHTML = result
    }

    container.showRange = function (range) {
      const tableContainer = document.getElementById("ascii-table")
      let tableHTML = `
        <table class="ascii-table-display">
          <thead>
            <tr>
              <th>Dec</th>
              <th>Hex</th>
              <th>Binary</th>
              <th>Character</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
      `

      let start, end
      switch (range) {
        case "control":
          start = 0
          end = 31
          break
        case "printable":
          start = 32
          end = 126
          break
        case "all":
          start = 0
          end = 127
          break
      }

      for (let i = start; i <= end; i++) {
        const hex = i.toString(16).toUpperCase().padStart(2, "0")
        const binary = i.toString(2).padStart(8, "0")
        const char = i < 32 ? this.getControlCharName(i) : String.fromCharCode(i)
        const desc = this.getCharacterDescription(i)

        tableHTML += `
          <tr>
            <td>${i}</td>
            <td>0x${hex}</td>
            <td>${binary}</td>
            <td>${i < 32 ? "" : char}</td>
            <td>${desc}</td>
          </tr>
        `
      }

      tableHTML += "</tbody></table>"
      tableContainer.innerHTML = tableHTML
    }

    container.getCharacterCategory = (ascii) => {
      if (ascii < 32) return "Control Character"
      if (ascii === 32) return "Space"
      if (ascii >= 48 && ascii <= 57) return "Digit"
      if (ascii >= 65 && ascii <= 90) return "Uppercase Letter"
      if (ascii >= 97 && ascii <= 122) return "Lowercase Letter"
      if (ascii === 127) return "Delete Character"
      return "Printable Character"
    }

    container.getControlCharName = (ascii) => {
      const controlChars = {
        0: "NUL",
        1: "SOH",
        2: "STX",
        3: "ETX",
        4: "EOT",
        5: "ENQ",
        6: "ACK",
        7: "BEL",
        8: "BS",
        9: "TAB",
        10: "LF",
        11: "VT",
        12: "FF",
        13: "CR",
        14: "SO",
        15: "SI",
        16: "DLE",
        17: "DC1",
        18: "DC2",
        19: "DC3",
        20: "DC4",
        21: "NAK",
        22: "SYN",
        23: "ETB",
        24: "CAN",
        25: "EM",
        26: "SUB",
        27: "ESC",
        28: "FS",
        29: "GS",
        30: "RS",
        31: "US",
      }
      return controlChars[ascii] || "UNKNOWN"
    }

    container.getCharacterDescription = function (ascii) {
      if (ascii < 32) return this.getControlCharName(ascii)
      if (ascii === 32) return "Space"
      if (ascii === 127) return "Delete"
      return String.fromCharCode(ascii)
    }
  }
}

class ParityBitsModule extends LearningModule {
  constructor() {
    super("Parity Bits & Error Detection")
  }

  getHTML() {
    return `
      <div class="card">
        <h2>🔍 Parity Bits & Error Detection</h2>
        <p>Learn error detection techniques with interactive demonstrations!</p>
        
        <div class="tabs">
          <button class="tab-btn active" onclick="this.parentElement.parentElement.querySelector('.parity-bits').showTab('parity')">Parity Calculator</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.parity-bits').showTab('detection')">Error Detection</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.parity-bits').showTab('checksum')">Checksum</button>
        </div>

        <div class="parity-bits">
          <div class="tab-content active" id="parity-tab">
            <h3>Parity Bit Calculator</h3>
            <div class="input-group">
              <label>Data Bits:</label>
              <input type="text" id="data-bits" placeholder="1010110" maxlength="16">
            </div>
            <div class="parity-controls">
              <button onclick="this.closest('.parity-bits').calculateParity('even')" class="btn">Even Parity</button>
              <button onclick="this.closest('.parity-bits').calculateParity('odd')" class="btn">Odd Parity</button>
            </div>
            <div id="parity-result" class="result-container"></div>
          </div>

          <div class="tab-content" id="detection-tab">
            <h3>Error Detection Simulation</h3>
            <div class="input-group">
              <label>Original Data with Parity:</label>
              <input type="text" id="original-data" placeholder="10101101" maxlength="17">
            </div>
            <div class="input-group">
              <label>Received Data:</label>
              <input type="text" id="received-data" placeholder="10101111" maxlength="17">
            </div>
            <div class="detection-controls">
              <button onclick="this.closest('.parity-bits').detectError('even')" class="btn">Check Even Parity</button>
              <button onclick="this.closest('.parity-bits').detectError('odd')" class="btn">Check Odd Parity</button>
            </div>
            <div id="detection-result" class="result-container"></div>
          </div>

          <div class="tab-content" id="checksum-tab">
            <h3>Simple Checksum Calculator</h3>
            <div class="input-group">
              <label>Data Bytes (space separated):</label>
              <input type="text" id="checksum-data" placeholder="10101010 11110000 01010101">
            </div>
            <button onclick="this.closest('.parity-bits').calculateChecksum()" class="btn">Calculate Checksum</button>
            <div id="checksum-result" class="result-container"></div>
          </div>
        </div>
      </div>
    `
  }

  initialize() {
    this.init()
  }

  init() {
    const container = document.querySelector(".parity-bits")

    container.showTab = function (tabName) {
      this.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
      this.parentElement.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))

      document.getElementById(tabName + "-tab").classList.add("active")
      event.target.classList.add("active")
    }

    container.calculateParity = (type) => {
      const data = document.getElementById("data-bits").value.trim()

      if (!/^[01]+$/.test(data)) {
        alert("Please enter valid binary data (0s and 1s only)")
        return
      }

      const ones = data.split("").filter((bit) => bit === "1").length
      let parityBit

      if (type === "even") {
        parityBit = ones % 2 === 0 ? "0" : "1"
      } else {
        parityBit = ones % 2 === 0 ? "1" : "0"
      }

      const result = `
        <div class="parity-display">
          <h4>${type.charAt(0).toUpperCase() + type.slice(1)} Parity Calculation</h4>
          <div class="calculation-steps">
            <div class="step">Data bits: ${data}</div>
            <div class="step">Number of 1s: ${ones}</div>
            <div class="step">${type === "even" ? "Even" : "Odd"} parity bit: ${parityBit}</div>
            <div class="step">Complete data: ${data}${parityBit}</div>
          </div>
          <div class="explanation">
            <strong>Explanation:</strong> ${
              type === "even"
                ? "Even parity ensures total number of 1s is even"
                : "Odd parity ensures total number of 1s is odd"
            }
          </div>
        </div>
      `

      document.getElementById("parity-result").innerHTML = result
    }

    container.detectError = (parityType) => {
      const original = document.getElementById("original-data").value.trim()
      const received = document.getElementById("received-data").value.trim()

      if (!/^[01]+$/.test(original) || !/^[01]+$/.test(received)) {
        alert("Please enter valid binary data (0s and 1s only)")
        return
      }

      if (original.length !== received.length) {
        alert("Original and received data must have the same length")
        return
      }

      const originalOnes = original.split("").filter((bit) => bit === "1").length
      const receivedOnes = received.split("").filter((bit) => bit === "1").length

      let originalValid, receivedValid

      if (parityType === "even") {
        originalValid = originalOnes % 2 === 0
        receivedValid = receivedOnes % 2 === 0
      } else {
        originalValid = originalOnes % 2 === 1
        receivedValid = receivedOnes % 2 === 1
      }

      const errorDetected = !receivedValid
      const differences = []

      for (let i = 0; i < original.length; i++) {
        if (original[i] !== received[i]) {
          differences.push(i)
        }
      }

      const result = `
        <div class="error-detection-display">
          <h4>Error Detection Results</h4>
          <div class="detection-steps">
            <div class="step">Original: ${original} (${originalOnes} ones, ${originalValid ? "Valid" : "Invalid"} ${parityType} parity)</div>
            <div class="step">Received: ${received} (${receivedOnes} ones, ${receivedValid ? "Valid" : "Invalid"} ${parityType} parity)</div>
            <div class="step ${errorDetected ? "error" : "success"}">
              ${errorDetected ? "❌ Error Detected!" : "✅ No Error Detected"}
            </div>
            ${differences.length > 0 ? `<div class="step">Bit differences at positions: ${differences.join(", ")}</div>` : ""}
          </div>
        </div>
      `

      document.getElementById("detection-result").innerHTML = result
    }

    container.calculateChecksum = () => {
      const input = document.getElementById("checksum-data").value.trim()
      const dataBytes = input.split(" ").filter((byte) => byte.length > 0)

      if (dataBytes.length === 0) {
        alert("Please enter at least one data byte")
        return
      }

      for (const byte of dataBytes) {
        if (!/^[01]+$/.test(byte)) {
          alert("Please enter valid binary data (0s and 1s only)")
          return
        }
      }

      let sum = 0
      const calculations = []

      dataBytes.forEach((byte, index) => {
        const value = Number.parseInt(byte, 2)
        sum += value
        calculations.push(`Byte ${index + 1}: ${byte} = ${value}`)
      })

      const checksum = (~sum & 0xff).toString(2).padStart(8, "0")
      const verification = (sum + Number.parseInt(checksum, 2)) & 0xff

      const result = `
        <div class="checksum-display">
          <h4>Checksum Calculation</h4>
          <div class="calculation-steps">
            ${calculations.map((calc) => `<div class="step">${calc}</div>`).join("")}
            <div class="step">Sum: ${sum} (${sum.toString(2)})</div>
            <div class="step">Checksum: ${checksum} (${Number.parseInt(checksum, 2)})</div>
            <div class="step">Verification: ${sum} + ${Number.parseInt(checksum, 2)} = ${verification} ${verification === 0 ? "✅" : "❌"}</div>
          </div>
        </div>
      `

      document.getElementById("checksum-result").innerHTML = result
    }
  }
}

class BinaryArithmeticModule extends LearningModule {
  constructor() {
    super("Binary Arithmetic Operations")
  }

  getHTML() {
    return `
      <div class="card">
        <h2>➕ Binary Arithmetic Operations</h2>
        <p>Learn binary arithmetic with step-by-step visualization!</p>
        
        <div class="tabs">
          <button class="tab-btn active" onclick="this.parentElement.parentElement.querySelector('.binary-arithmetic').showTab('addition')">Addition</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.binary-arithmetic').showTab('subtraction')">Subtraction</button>
          <button class="tab-btn" onclick="this.parentElement.parentElement.querySelector('.binary-arithmetic').showTab('multiplication')">Multiplication</button>
        </div>

        <div class="binary-arithmetic">
          <div class="tab-content active" id="addition-tab">
            <h3>Binary Addition</h3>
            <div class="input-group">
              <label>First Number (Binary):</label>
              <input type="text" id="add-num1" placeholder="1010" maxlength="8">
            </div>
            <div class="input-group">
              <label>Second Number (Binary):</label>
              <input type="text" id="add-num2" placeholder="0110" maxlength="8">
            </div>
            <button onclick="this.closest('.binary-arithmetic').performAddition()" class="btn">Calculate Addition</button>
            <div id="addition-steps" class="steps-container"></div>
          </div>

          <div class="tab-content" id="subtraction-tab">
            <h3>Binary Subtraction</h3>
            <div class="input-group">
              <label>Minuend (Binary):</label>
              <input type="text" id="sub-num1" placeholder="1010" maxlength="8">
            </div>
            <div class="input-group">
              <label>Subtrahend (Binary):</label>
              <input type="text" id="sub-num2" placeholder="0110" maxlength="8">
            </div>
            <button onclick="this.closest('.binary-arithmetic').performSubtraction()" class="btn">Calculate Subtraction</button>
            <div id="subtraction-steps" class="steps-container"></div>
          </div>

          <div class="tab-content" id="multiplication-tab">
            <h3>Binary Multiplication</h3>
            <div class="input-group">
              <label>Multiplicand (Binary):</label>
              <input type="text" id="mul-num1" placeholder="101" maxlength="6">
            </div>
            <div class="input-group">
              <label>Multiplier (Binary):</label>
              <input type="text" id="mul-num2" placeholder="11" maxlength="6">
            </div>
            <button onclick="this.closest('.binary-arithmetic').performMultiplication()" class="btn">Calculate Multiplication</button>
            <div id="multiplication-steps" class="steps-container"></div>
          </div>
        </div>
      </div>
    `
  }

  initialize() {
    this.init()
  }

  init() {
    const container = document.querySelector(".binary-arithmetic")

    container.showTab = function (tabName) {
      this.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
      this.parentElement.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))

      document.getElementById(tabName + "-tab").classList.add("active")
      event.target.classList.add("active")
    }

    container.performAddition = function () {
      const num1 = document.getElementById("add-num1").value.trim()
      const num2 = document.getElementById("add-num2").value.trim()

      if (!this.validateBinary(num1) || !this.validateBinary(num2)) {
        alert("Please enter valid binary numbers (0s and 1s only)")
        return
      }

      const steps = this.calculateBinaryAddition(num1, num2)
      this.displaySteps("addition-steps", steps)
    }

    container.performSubtraction = function () {
      const num1 = document.getElementById("sub-num1").value.trim()
      const num2 = document.getElementById("sub-num2").value.trim()

      if (!this.validateBinary(num1) || !this.validateBinary(num2)) {
        alert("Please enter valid binary numbers (0s and 1s only)")
        return
      }

      const steps = this.calculateBinarySubtraction(num1, num2)
      this.displaySteps("subtraction-steps", steps)
    }

    container.performMultiplication = function () {
      const num1 = document.getElementById("mul-num1").value.trim()
      const num2 = document.getElementById("mul-num2").value.trim()

      if (!this.validateBinary(num1) || !this.validateBinary(num2)) {
        alert("Please enter valid binary numbers (0s and 1s only)")
        return
      }

      const steps = this.calculateBinaryMultiplication(num1, num2)
      this.displaySteps("multiplication-steps", steps)
    }

    container.validateBinary = (str) => /^[01]+$/.test(str)

    container.calculateBinaryAddition = (num1, num2) => {
      const maxLen = Math.max(num1.length, num2.length)
      const a = num1.padStart(maxLen, "0")
      const b = num2.padStart(maxLen, "0")

      let result = ""
      let carry = 0
      const steps = []

      steps.push({
        type: "setup",
        content: `
          <div class="calculation-display">
            <div class="binary-number">${a}</div>
            <div class="binary-number">+ ${b}</div>
            <div class="line">────────</div>
          </div>
        `,
      })

      for (let i = maxLen - 1; i >= 0; i--) {
        const bitA = Number.parseInt(a[i])
        const bitB = Number.parseInt(b[i])
        const sum = bitA + bitB + carry

        const resultBit = sum % 2
        const newCarry = Math.floor(sum / 2)

        result = resultBit + result

        steps.push({
          type: "step",
          content: `
            <div class="step-explanation">
              <strong>Position ${maxLen - i}:</strong> ${bitA} + ${bitB} + ${carry} (carry) = ${sum}
              <br>Result bit: ${resultBit}, New carry: ${newCarry}
            </div>
          `,
        })

        carry = newCarry
      }

      if (carry) {
        result = carry + result
        steps.push({
          type: "step",
          content: `<div class="step-explanation"><strong>Final carry:</strong> ${carry}</div>`,
        })
      }

      steps.push({
        type: "result",
        content: `
          <div class="result-display">
            <strong>Final Result: ${result}</strong>
            <br>Decimal: ${Number.parseInt(result, 2)}
          </div>
        `,
      })

      return steps
    }

    container.calculateBinarySubtraction = (num1, num2) => {
      const decimal1 = Number.parseInt(num1, 2)
      const decimal2 = Number.parseInt(num2, 2)

      if (decimal1 < decimal2) {
        return [
          {
            type: "error",
            content:
              '<div class="error-message">Cannot subtract larger number from smaller number in unsigned binary</div>',
          },
        ]
      }

      const result = (decimal1 - decimal2).toString(2)

      return [
        {
          type: "setup",
          content: `
            <div class="calculation-display">
              <div class="binary-number">${num1} (${decimal1})</div>
              <div class="binary-number">- ${num2} (${decimal2})</div>
              <div class="line">────────</div>
            </div>
          `,
        },
        {
          type: "result",
          content: `
            <div class="result-display">
              <strong>Result: ${result}</strong>
              <br>Decimal: ${Number.parseInt(result, 2)}
            </div>
          `,
        },
      ]
    }

    container.calculateBinaryMultiplication = (num1, num2) => {
      const steps = []
      const decimal1 = Number.parseInt(num1, 2)
      const decimal2 = Number.parseInt(num2, 2)

      steps.push({
        type: "setup",
        content: `
          <div class="calculation-display">
            <div class="binary-number">${num1} (${decimal1})</div>
            <div class="binary-number">× ${num2} (${decimal2})</div>
            <div class="line">────────</div>
          </div>
        `,
      })

      const partialProducts = []
      for (let i = num2.length - 1; i >= 0; i--) {
        if (num2[i] === "1") {
          const shift = num2.length - 1 - i
          const product = num1 + "0".repeat(shift)
          partialProducts.push(product)

          steps.push({
            type: "step",
            content: `
              <div class="step-explanation">
                <strong>Bit ${shift}:</strong> ${num1} × 1 = ${product}
              </div>
            `,
          })
        }
      }

      const result = (decimal1 * decimal2).toString(2)

      steps.push({
        type: "result",
        content: `
          <div class="result-display">
            <strong>Final Result: ${result}</strong>
            <br>Decimal: ${decimal1 * decimal2}
          </div>
        `,
      })

      return steps
    }

    container.displaySteps = (containerId, steps) => {
      const container = document.getElementById(containerId)
      container.innerHTML = ""

      steps.forEach((step, index) => {
        setTimeout(() => {
          const stepDiv = document.createElement("div")
          stepDiv.className = `step ${step.type}`
          stepDiv.innerHTML = step.content
          stepDiv.style.opacity = "0"
          container.appendChild(stepDiv)

          setTimeout(() => {
            stepDiv.style.opacity = "1"
            stepDiv.style.transform = "translateY(0)"
          }, 100)
        }, index * 500)
      })
    }
  }
}

// Enhanced scroll navigation functionality
function initializeScrollNavigation() {
  const nav = document.querySelector('.main-nav');
  let lastScrollY = 0;
  
  if (!nav) return;

  function updateNavigation() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class when user scrolls down
    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavigation();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  
  // Initial call
  updateNavigation();
}

// Easter egg function
function activateRainbowMode() {
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd", "#98d8c8"]
  let colorIndex = 0

  const rainbowInterval = setInterval(() => {
    document.body.style.background = `linear-gradient(45deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`
    colorIndex = (colorIndex + 1) % colors.length
  }, 500)

  setTimeout(() => {
    clearInterval(rainbowInterval)
    document.body.style.background = ""
  }, 10000)

  // Add floating emojis
  const emojis = ["🎉", "✨", "🌈", "💫", "⭐", "🎊"]
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div")
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      emoji.style.position = "fixed"
      emoji.style.left = Math.random() * window.innerWidth + "px"
      emoji.style.top = "-50px"
      emoji.style.fontSize = "2rem"
      emoji.style.zIndex = "9999"
      emoji.style.pointerEvents = "none"
      emoji.style.animation = "fall 3s linear forwards"
      document.body.appendChild(emoji)

      setTimeout(() => emoji.remove(), 3000)
    }, i * 200)
  }
}

// Quiz System Classes
class AuthSystem {
  constructor() {
    this.baseURL = 'http://localhost:5000/api'
    this.token = localStorage.getItem('authToken')
    this.currentUser = null
    this.init()
  }

  async init() {
    if (this.token) {
      try {
        await this.verifyToken()
      } catch (error) {
        this.logout()
      }
    }
  }

  async login(login, password) {
    // Demo mode login
    if (isDemoMode()) {
      console.log('🎮 Demo login - no credentials required');
      this.token = 'demo-token-12345';
      this.currentUser = DEMO_USER;
      localStorage.setItem('authToken', this.token);
      return { success: true, user: this.currentUser };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      })
      
      const data = await response.json()
      if (data.success) {
        this.token = data.token
        this.currentUser = data.user
        localStorage.setItem('authToken', this.token)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Network error. Using demo mode.' }
    }
  }

  async register(userData) {
    // Demo mode registration
    if (isDemoMode()) {
      console.log('🎮 Demo registration - creating demo user');
      this.token = 'demo-token-12345';
      this.currentUser = { ...DEMO_USER, name: userData.name, email: userData.email };
      localStorage.setItem('authToken', this.token);
      return { success: true, user: this.currentUser };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      if (data.success) {
        this.token = data.token
        this.currentUser = data.user
        localStorage.setItem('authToken', this.token)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Network error. Using demo mode.' }
    }
  }

  async verifyToken() {
    const response = await fetch(`${this.baseURL}/auth/verify-token`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
    
    const data = await response.json()
    if (data.success) {
      this.currentUser = data.user
      return true
    }
    throw new Error('Invalid token')
  }

  logout() {
    this.token = null
    this.currentUser = null
    localStorage.removeItem('authToken')
  }

  isLoggedIn() {
    return !!this.token && !!this.currentUser
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
  }
}

class QuizSystem {
  constructor() {
    this.baseURL = 'http://localhost:5000/api'
    this.currentQuiz = null
    this.currentAttempt = null
    this.timer = null
  }

  async getQuizzes(filters = {}) {
    // Demo mode - return demo quizzes
    if (isDemoMode()) {
      console.log('🎮 Loading demo quizzes');
      return { 
        quizzes: DEMO_QUIZZES, 
        pagination: { 
          currentPage: 1, 
          totalPages: 1, 
          totalQuizzes: DEMO_QUIZZES.length,
          limit: 10 
        } 
      };
    }
    
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const response = await fetch(`${this.baseURL}/quiz?${queryParams}`)
      const data = await response.json()
      return data.success ? data.data : { quizzes: [], pagination: {} }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      // Fallback to demo mode if server is down
      console.log('🎮 Falling back to demo quizzes');
      return { 
        quizzes: DEMO_QUIZZES, 
        pagination: { 
          currentPage: 1, 
          totalPages: 1, 
          totalQuizzes: DEMO_QUIZZES.length,
          limit: 10 
        } 
      };
    }
  }

  async getQuiz(quizId) {
    // Demo mode - find quiz in demo data
    if (isDemoMode()) {
      console.log('🎮 Loading demo quiz:', quizId);
      return DEMO_QUIZZES.find(quiz => quiz._id === quizId) || null;
    }
    
    try {
      const authHeaders = window.authSystem?.getAuthHeaders() || {}
      const response = await fetch(`${this.baseURL}/quiz/${quizId}`, {
        headers: authHeaders
      })
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error fetching quiz:', error)
      // Fallback to demo data
      console.log('🎮 Falling back to demo quiz');
      return DEMO_QUIZZES.find(quiz => quiz._id === quizId) || null;
    }
  }

  async startQuiz(quizId) {
    try {
      const response = await fetch(`${this.baseURL}/quiz/${quizId}/start`, {
        method: 'POST',
        headers: window.authSystem.getAuthHeaders()
      })
      const data = await response.json()
      if (data.success) {
        this.currentAttempt = data.data.attempt
        return data.data
      }
      throw new Error(data.message)
    } catch (error) {
      console.error('Error starting quiz:', error)
      throw error
    }
  }

  async submitAnswer(quizId, questionId, answer, timeSpent = 0) {
    try {
      const response = await fetch(`${this.baseURL}/quiz/${quizId}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...window.authSystem.getAuthHeaders()
        },
        body: JSON.stringify({ questionId, answer, timeSpent })
      })
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error submitting answer:', error)
      return null
    }
  }

  async submitQuiz(quizId) {
    try {
      const response = await fetch(`${this.baseURL}/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: window.authSystem.getAuthHeaders()
      })
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error submitting quiz:', error)
      return null
    }
  }

  startTimer(duration, callback) {
    this.stopTimer()
    let timeLeft = duration
    
    this.timer = setInterval(() => {
      timeLeft--
      callback(timeLeft)
      
      if (timeLeft <= 0) {
        this.stopTimer()
      }
    }, 1000)
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

class QuizCenterModule extends LearningModule {
  constructor() {
    super("Quiz Center")
  }

  getHTML() {
    return `
      <div class="quiz-center">
        <div class="quiz-header">
          <h2>🎯 Digital Electronics Quiz Center</h2>
          <p>Test your knowledge with interactive quizzes</p>
          
          <div class="auth-section" id="auth-section">
            <div class="login-form" id="login-form">
              <h3>🔐 Login to Access Quizzes</h3>
              <input type="text" id="login-username" placeholder="Username or Email">
              <input type="password" id="login-password" placeholder="Password">
              <button id="login-btn" class="primary-btn">🚀 Login</button>
              <button id="show-register" class="secondary-btn">📝 Create Account</button>
              <p class="demo-note">💡 Demo: Use <code>admin@digitalelectronics.com</code> / <code>admin123</code></p>
            </div>
            
            <div class="register-form" id="register-form" style="display: none;">
              <h3>📝 Create New Account</h3>
              <input type="text" id="register-username" placeholder="Username">
              <input type="email" id="register-email" placeholder="Email">
              <input type="password" id="register-password" placeholder="Password">
              <input type="text" id="register-firstname" placeholder="First Name">
              <input type="text" id="register-lastname" placeholder="Last Name">
              <button id="register-btn" class="primary-btn">🎉 Register</button>
              <button id="show-login" class="secondary-btn">🔐 Back to Login</button>
            </div>

            <div class="user-info" id="user-info" style="display: none;">
              <div class="user-welcome">
                <span id="user-name">Welcome!</span>
                <button id="logout-btn" class="secondary-btn">🚪 Logout</button>
              </div>
            </div>
          </div>
        </div>

        <div class="quiz-content" id="quiz-content" style="display: none;">
          <div class="quiz-filters">
            <select id="category-filter">
              <option value="">All Categories</option>
              <option value="binary-conversions">Binary Conversions</option>
              <option value="decimal-conversions">Decimal Conversions</option>
              <option value="hex-conversions">Hex Conversions</option>
              <option value="twos-complement">2's Complement</option>
              <option value="bcd-conversion">BCD Conversion</option>
              <option value="gray-code">Gray Code</option>
            </select>
            
            <select id="difficulty-filter">
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <button id="refresh-quizzes" class="secondary-btn">🔄 Refresh</button>
          </div>

          <div class="quiz-grid" id="quiz-grid">
            <div class="loading">Loading quizzes...</div>
          </div>
        </div>
      </div>
    `
  }

  initialize() {
    this.setupEventListeners()
    this.checkAuthStatus()
  }

  setupEventListeners() {
    // Auth listeners
    document.getElementById('login-btn')?.addEventListener('click', () => this.handleLogin())
    document.getElementById('register-btn')?.addEventListener('click', () => this.handleRegister())
    document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout())
    document.getElementById('show-register')?.addEventListener('click', () => this.showRegisterForm())
    document.getElementById('show-login')?.addEventListener('click', () => this.showLoginForm())
    
    // Quiz listeners
    document.getElementById('refresh-quizzes')?.addEventListener('click', () => this.loadQuizzes())
    document.getElementById('category-filter')?.addEventListener('change', () => this.loadQuizzes())
    document.getElementById('difficulty-filter')?.addEventListener('change', () => this.loadQuizzes())
  }

  checkAuthStatus() {
    // In demo mode, skip authentication
    if (isDemoMode()) {
      console.log('🎮 Demo mode: Auto-authenticating user');
      // Simulate login with demo user
      window.authSystem.currentUser = DEMO_USER;
      window.authSystem.token = 'demo-token';
      this.showQuizContent()
      this.loadQuizzes()
      return;
    }
    
    if (window.authSystem?.isLoggedIn()) {
      this.showQuizContent()
      this.loadQuizzes()
    } else {
      this.showAuthForms()
    }
  }

  showAuthForms() {
    document.getElementById('auth-section').style.display = 'block'
    document.getElementById('quiz-content').style.display = 'none'
  }

  showQuizContent() {
    document.getElementById('auth-section').style.display = 'none'
    document.getElementById('quiz-content').style.display = 'block'
    
    if (window.authSystem?.currentUser) {
      document.getElementById('user-info').style.display = 'block'
      const userName = window.authSystem.currentUser.name || window.authSystem.currentUser.username || 'Student';
      document.getElementById('user-name').textContent = `Welcome, ${userName}! 👋`
    }
  }

  showRegisterForm() {
    document.getElementById('login-form').style.display = 'none'
    document.getElementById('register-form').style.display = 'block'
  }

  showLoginForm() {
    document.getElementById('register-form').style.display = 'none'
    document.getElementById('login-form').style.display = 'block'
  }

  async handleLogin() {
    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    if (!username || !password) {
      this.showError('Please fill in all fields!')
      return
    }

    const result = await window.authSystem.login(username, password)
    if (result.success) {
      this.showQuizContent()
      this.loadQuizzes()
      this.showSuccess('Login successful! 🎉')
    } else {
      this.showError(result.message || 'Login failed!')
    }
  }

  async handleRegister() {
    const userData = {
      username: document.getElementById('register-username').value,
      email: document.getElementById('register-email').value,
      password: document.getElementById('register-password').value,
      firstName: document.getElementById('register-firstname').value,
      lastName: document.getElementById('register-lastname').value
    }

    if (!userData.username || !userData.email || !userData.password) {
      this.showError('Please fill in all required fields!')
      return
    }

    const result = await window.authSystem.register(userData)
    if (result.success) {
      this.showQuizContent()
      this.loadQuizzes()
      this.showSuccess('Account created successfully! 🎉')
    } else {
      this.showError(result.message || 'Registration failed!')
    }
  }

  handleLogout() {
    window.authSystem.logout()
    this.showAuthForms()
    document.getElementById('login-username').value = ''
    document.getElementById('login-password').value = ''
  }

  async loadQuizzes() {
    const quizGrid = document.getElementById('quiz-grid')
    quizGrid.innerHTML = '<div class="loading">Loading quizzes...</div>'

    const filters = {
      category: document.getElementById('category-filter').value,
      difficulty: document.getElementById('difficulty-filter').value
    }

    const data = await window.quizSystem.getQuizzes(filters)
    this.displayQuizzes(data.quizzes)
  }

  displayQuizzes(quizzes) {
    const quizGrid = document.getElementById('quiz-grid')
    
    if (quizzes.length === 0) {
      quizGrid.innerHTML = '<div class="no-quizzes">No quizzes found 📭</div>'
      return
    }

    quizGrid.innerHTML = quizzes.map(quiz => {
      const questionCount = quiz.questionCount || (quiz.questions ? quiz.questions.length : 0);
      const timeLimit = quiz.settings?.timeLimit || quiz.timeLimit || 0;
      const averageScore = quiz.stats?.averageScore || 0;
      
      return `
        <div class="quiz-card" data-quiz-id="${quiz._id}">
          <div class="quiz-header">
            <h3>${quiz.title}</h3>
            <span class="difficulty-badge ${quiz.difficulty}">${quiz.difficulty}</span>
          </div>
          <div class="quiz-info">
            <p>${quiz.description}</p>
            <div class="quiz-meta">
              <span>📊 ${questionCount} questions</span>
              <span>⏱️ ${Math.round(timeLimit / 60)} min</span>
              <span>🎯 ${averageScore}% avg</span>
            </div>
          </div>
          <div class="quiz-actions">
            <button class="take-quiz-btn primary-btn" data-quiz-id="${quiz._id}">
              🚀 Take Quiz
            </button>
          </div>
        </div>
      `;
    }).join('')

    // Add event listeners to quiz buttons
    document.querySelectorAll('.take-quiz-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quizId = e.target.dataset.quizId
        this.startQuiz(quizId)
      })
    })
  }

  startQuiz(quizId) {
    // Load the quiz taking module
    window.digitalHub.loadModule('quiz-take')
    // Pass the quiz ID to the quiz take module
    setTimeout(() => {
      if (window.digitalHub.currentModule && window.digitalHub.currentModule.loadQuiz) {
        window.digitalHub.currentModule.loadQuiz(quizId)
      }
    }, 100)
  }

  showError(message) {
    this.showMessage(message, 'error')
  }

  showSuccess(message) {
    this.showMessage(message, 'success')
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div')
    messageDiv.className = `message-popup ${type}`
    messageDiv.textContent = message
    document.body.appendChild(messageDiv)

    setTimeout(() => messageDiv.classList.add('show'), 100)
    setTimeout(() => {
      messageDiv.classList.remove('show')
      setTimeout(() => messageDiv.remove(), 300)
    }, 3000)
  }
}

class QuizTakeModule extends LearningModule {
  constructor() {
    super("Take Quiz")
    this.currentQuiz = null
    this.currentAttempt = null
    this.currentQuestionIndex = 0
    this.timeLeft = 0
    this.questionStartTime = 0
  }

  getHTML() {
    return `
      <div class="quiz-taking">
        <div class="quiz-loading" id="quiz-loading">
          <div class="loading-spinner">🔄</div>
          <p>Loading quiz...</p>
        </div>

        <div class="quiz-interface" id="quiz-interface" style="display: none;">
          <div class="quiz-header">
            <div class="quiz-title" id="quiz-title">Quiz Title</div>
            <div class="quiz-progress">
              <div class="progress-info">
                <span id="question-counter">1 / 10</span>
                <span id="time-remaining">30:00</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
            </div>
          </div>

          <div class="question-container">
            <div class="question-card" id="question-card">
              <!-- Question content will be loaded here -->
            </div>
          </div>

          <div class="quiz-controls">
            <button id="prev-question" class="secondary-btn" disabled>⬅️ Previous</button>
            <button id="next-question" class="primary-btn">Next ➡️</button>
            <button id="submit-quiz" class="primary-btn" style="display: none;">🎯 Submit Quiz</button>
          </div>
        </div>

        <div class="quiz-results" id="quiz-results" style="display: none;">
          <!-- Results will be shown here -->
        </div>
      </div>
    `
  }

  initialize() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById('prev-question')?.addEventListener('click', () => this.previousQuestion())
    document.getElementById('next-question')?.addEventListener('click', () => this.nextQuestion())
    document.getElementById('submit-quiz')?.addEventListener('click', () => this.submitQuiz())
  }

  async loadQuiz(quizId) {
    document.getElementById('quiz-loading').style.display = 'block'
    document.getElementById('quiz-interface').style.display = 'none'

    try {
      const quizData = await window.quizSystem.getQuiz(quizId)
      if (!quizData) {
        throw new Error('Quiz not found')
      }

      this.currentQuiz = quizData.quiz
      
      // Check if user can take quiz
      if (quizData.userStats && !quizData.userStats.canTakeQuiz) {
        this.showError('You cannot take this quiz. Maximum attempts reached or retakes not allowed.')
        return
      }

      // Start the quiz attempt
      const attemptData = await window.quizSystem.startQuiz(quizId)
      this.currentAttempt = attemptData.attempt

      this.initializeQuiz(attemptData.timeLimit)
      
    } catch (error) {
      console.error('Error loading quiz:', error)
      this.showError('Failed to load quiz. Please try again.')
    }
  }

  initializeQuiz(timeLimit) {
    document.getElementById('quiz-loading').style.display = 'none'
    document.getElementById('quiz-interface').style.display = 'block'

    // Set quiz title
    document.getElementById('quiz-title').textContent = this.currentQuiz.title

    // Initialize timer
    this.timeLeft = timeLimit
    this.startTimer()

    // Load first question
    this.currentQuestionIndex = 0
    this.questionStartTime = Date.now()
    this.loadQuestion()
    this.updateProgress()
  }

  startTimer() {
    window.quizSystem.startTimer(this.timeLeft, (timeLeft) => {
      this.timeLeft = timeLeft
      this.updateTimerDisplay()
      
      if (timeLeft <= 0) {
        this.submitQuiz()
      }
    })
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60)
    const seconds = this.timeLeft % 60
    document.getElementById('time-remaining').textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`
    
    // Change color when time is running low
    const timerElement = document.getElementById('time-remaining')
    if (this.timeLeft <= 300) { // 5 minutes
      timerElement.style.color = '#e53e3e'
      timerElement.style.fontWeight = 'bold'
    }
  }

  loadQuestion() {
    const question = this.currentQuiz.questions[this.currentQuestionIndex]
    const questionCard = document.getElementById('question-card')

    let questionHTML = `
      <div class="question-header">
        <h3>Question ${this.currentQuestionIndex + 1}</h3>
        <span class="question-type">${question.type}</span>
        <span class="question-points">${question.points || 2} points</span>
      </div>
      <div class="question-text">${question.question}</div>
      <div class="question-options" id="question-options">
    `

    if (question.type === 'multiple-choice') {
      question.options.forEach((option, index) => {
        questionHTML += `
          <label class="option-label">
            <input type="radio" name="answer" value="${option._id}">
            <span class="option-text">${option.text}</span>
          </label>
        `
      })
    } else if (question.type === 'true-false') {
      questionHTML += `
        <label class="option-label">
          <input type="radio" name="answer" value="true">
          <span class="option-text">True</span>
        </label>
        <label class="option-label">
          <input type="radio" name="answer" value="false">
          <span class="option-text">False</span>
        </label>
      `
    } else {
      questionHTML += `
        <input type="text" id="text-answer" placeholder="Enter your answer..." class="text-answer">
      `
    }

    questionHTML += `
      </div>
      <div class="question-hints" id="question-hints" style="display: none;">
        <h4>💡 Hints:</h4>
        <ul>
          ${(question.hints || []).map(hint => `<li>${hint}</li>`).join('')}
        </ul>
      </div>
      <button class="hint-btn" onclick="document.getElementById('question-hints').style.display = document.getElementById('question-hints').style.display === 'none' ? 'block' : 'none'">
        💡 Show Hints
      </button>
    `

    questionCard.innerHTML = questionHTML

    // Load previous answer if exists
    this.loadPreviousAnswer()
  }

  loadPreviousAnswer() {
    const questionId = this.currentQuiz.questions[this.currentQuestionIndex]._id
    const previousAnswer = this.currentAttempt.answers.find(a => a.question === questionId)
    
    if (previousAnswer && previousAnswer.selectedAnswer) {
      const question = this.currentQuiz.questions[this.currentQuestionIndex]
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        const radioInput = document.querySelector(`input[value="${previousAnswer.selectedAnswer}"]`)
        if (radioInput) radioInput.checked = true
      } else {
        const textInput = document.getElementById('text-answer')
        if (textInput) textInput.value = previousAnswer.selectedAnswer
      }
    }
  }

  async saveCurrentAnswer() {
    const question = this.currentQuiz.questions[this.currentQuestionIndex]
    let answer = null

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      const selectedOption = document.querySelector('input[name="answer"]:checked')
      answer = selectedOption ? selectedOption.value : null
    } else {
      const textInput = document.getElementById('text-answer')
      answer = textInput ? textInput.value.trim() : null
    }

    if (answer) {
      const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000)
      await window.quizSystem.submitAnswer(
        this.currentQuiz._id, 
        question._id, 
        answer, 
        timeSpent
      )
    }
  }

  async nextQuestion() {
    await this.saveCurrentAnswer()
    
    if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex++
      this.questionStartTime = Date.now()
      this.loadQuestion()
      this.updateProgress()
    } else {
      this.showSubmitButton()
    }
  }

  async previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      await this.saveCurrentAnswer()
      this.currentQuestionIndex--
      this.questionStartTime = Date.now()
      this.loadQuestion()
      this.updateProgress()
    }
  }

  updateProgress() {
    const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100
    document.getElementById('progress-fill').style.width = `${progress}%`
    document.getElementById('question-counter').textContent = 
      `${this.currentQuestionIndex + 1} / ${this.currentQuiz.questions.length}`

    // Update navigation buttons
    document.getElementById('prev-question').disabled = this.currentQuestionIndex === 0
    
    if (this.currentQuestionIndex === this.currentQuiz.questions.length - 1) {
      this.showSubmitButton()
    } else {
      document.getElementById('next-question').style.display = 'block'
      document.getElementById('submit-quiz').style.display = 'none'
    }
  }

  showSubmitButton() {
    document.getElementById('next-question').style.display = 'none'
    document.getElementById('submit-quiz').style.display = 'block'
  }

  async submitQuiz() {
    // Save current answer before submitting
    await this.saveCurrentAnswer()

    // Stop timer
    window.quizSystem.stopTimer()

    try {
      const result = await window.quizSystem.submitQuiz(this.currentQuiz._id)
      this.showResults(result)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      this.showError('Failed to submit quiz. Please try again.')
    }
  }

  showResults(result) {
    document.getElementById('quiz-interface').style.display = 'none'
    document.getElementById('quiz-results').style.display = 'block'

    const resultsHTML = `
      <div class="results-header">
        <h2>🎉 Quiz Completed!</h2>
        <div class="score-display">
          <div class="score-circle ${result.attempt.isPassed ? 'passed' : 'failed'}">
            <span class="score-percentage">${result.attempt.percentage}%</span>
            <span class="score-label">${result.attempt.isPassed ? 'Passed' : 'Failed'}</span>
          </div>
        </div>
      </div>

      <div class="results-stats">
        <div class="stat-item">
          <span class="stat-value">${result.scoreResult.correctAnswers}</span>
          <span class="stat-label">Correct Answers</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${result.scoreResult.totalQuestions}</span>
          <span class="stat-label">Total Questions</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${result.attempt.score}</span>
          <span class="stat-label">Points Earned</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${Math.round(result.attempt.timeSpent / 60)}</span>
          <span class="stat-label">Minutes Taken</span>
        </div>
      </div>

      ${result.newBadges && result.newBadges.length > 0 ? `
        <div class="new-badges">
          <h3>🏆 New Badges Earned!</h3>
          <div class="badge-list">
            ${result.newBadges.map(badge => `<span class="badge">${badge}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="results-actions">
        <button id="back-to-quizzes" class="secondary-btn">📚 Back to Quizzes</button>
      </div>
    `

    document.getElementById('quiz-results').innerHTML = resultsHTML

    // Add event listeners for result actions
    document.getElementById('back-to-quizzes')?.addEventListener('click', () => {
      window.digitalHub.loadModule('quiz-center')
    })
  }

  showError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-message show'
    errorDiv.textContent = message
    document.body.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.classList.remove('show')
      setTimeout(() => errorDiv.remove(), 300)
    }, 5000)
  }
}

class UserDashboardModule extends LearningModule {
  constructor() {
    super("User Dashboard")
  }

  getHTML() {
    return `
      <div class="user-dashboard">
        <div class="dashboard-header">
          <h2>📊 Your Learning Dashboard</h2>
          <p>Track your progress and achievements</p>
        </div>

        <div class="user-info" id="user-info">
          <div class="user-avatar">👤</div>
          <h3 id="user-name">Demo Student</h3>
          <p id="user-email">demo@example.com</p>
          <div class="badges-container" id="user-badges">
            <div class="badge">🔰 Beginner</div>
            <div class="badge">📊 Binary Master</div>
            <div class="badge">🧮 Calculator</div>
          </div>
        </div>

        <div class="stats-grid" id="dashboard-stats">
          <div class="stat-card">
            <span class="stat-value" id="total-quizzes">12</span>
            <span class="stat-label">Total Quizzes</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="total-score">850</span>
            <span class="stat-label">Total Score</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="average-score">78.5%</span>
            <span class="stat-label">Average Score</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="current-streak">5</span>
            <span class="stat-label">Current Streak</span>
          </div>
        </div>

        <div class="recent-activity">
          <h3>📈 Recent Activity</h3>
          <div class="activity-list" id="recent-activity">
            <div class="activity-item">
              <span class="activity-icon">🎯</span>
              <div class="activity-details">
                <strong>Binary Number System Basics</strong>
                <span>Completed with 85% score</span>
                <span class="activity-time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-icon">🏆</span>
              <div class="activity-details">
                <strong>New Badge Earned!</strong>
                <span>Binary Master - Complete 5 binary quizzes</span>
                <span class="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  init() {
    this.loadUserData()
  }

  async loadUserData() {
    if (isDemoMode()) {
      this.displayUserData(DEMO_USER)
    } else {
      try {
        // Load real user data from API
        const userData = await window.authSystem?.getCurrentUser()
        if (userData) {
          this.displayUserData(userData)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        this.displayUserData(DEMO_USER)
      }
    }
  }

  displayUserData(user) {
    document.getElementById('user-name').textContent = user.name
    document.getElementById('user-email').textContent = user.email
    
    if (user.stats) {
      document.getElementById('total-quizzes').textContent = user.stats.totalQuizzes || 0
      document.getElementById('total-score').textContent = user.stats.totalScore || 0
      document.getElementById('average-score').textContent = (user.stats.averageScore || 0) + '%'
      document.getElementById('current-streak').textContent = user.stats.streak || 0
    }

    if (user.badges) {
      const badgesContainer = document.getElementById('user-badges')
      badgesContainer.innerHTML = user.badges.map(badge => 
        `<div class="badge">${badge}</div>`
      ).join('')
    }
  }
}

class LeaderboardModule extends LearningModule {
  constructor() {
    super("Leaderboard")
  }

  getHTML() {
    return `
      <div class="quiz-leaderboard">
        <div class="leaderboard-header">
          <h2>🏆 Global Leaderboard</h2>
          <p>See how you rank against other students</p>
        </div>

        <div class="leaderboard-filters">
          <select id="leaderboard-filter">
            <option value="all">All Time</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        <div class="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Score</th>
                <th>Quizzes</th>
                <th>Avg Score</th>
                <th>Badges</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              <tr><td colspan="6" class="loading">Loading leaderboard...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  init() {
    this.loadLeaderboard()
    this.setupFilters()
  }

  async loadLeaderboard(filter = 'all') {
    try {
      let leaderboardData
      
      if (isDemoMode()) {
        leaderboardData = DEMO_LEADERBOARD
      } else {
        // Load real leaderboard data from API
        const response = await fetch(`${window.quizSystem.baseURL}/leaderboard?filter=${filter}`)
        const data = await response.json()
        leaderboardData = data.success ? data.data : DEMO_LEADERBOARD
      }

      this.displayLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      this.displayLeaderboard(DEMO_LEADERBOARD)
    }
  }

  displayLeaderboard(data) {
    const tbody = document.getElementById('leaderboard-body')
    
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data available</td></tr>'
      return
    }

    tbody.innerHTML = data.map(user => `
      <tr>
        <td class="rank ${this.getRankClass(user.rank)}">${user.rank}</td>
        <td><strong>${user.name}</strong></td>
        <td>${user.score}</td>
        <td>${user.quizzes}</td>
        <td>${user.avgScore}%</td>
        <td>${user.badges}</td>
      </tr>
    `).join('')
  }

  getRankClass(rank) {
    if (rank === 1) return 'gold'
    if (rank === 2) return 'silver'  
    if (rank === 3) return 'bronze'
    return ''
  }

  setupFilters() {
    const filterSelect = document.getElementById('leaderboard-filter')
    filterSelect?.addEventListener('change', (e) => {
      this.loadLeaderboard(e.target.value)
    })
  }
}

// Check if running in demo mode
function isDemoMode() {
    return typeof DEMO_CONFIG !== 'undefined' && DEMO_CONFIG.isDemo;
}

// Show demo mode indicator
function showDemoModeIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        animation: pulse 2s infinite;
    `;
    indicator.innerHTML = '🎮 DEMO MODE';
    indicator.title = DEMO_CONFIG.demoMessage;
    document.body.appendChild(indicator);
}

// Initialize global objects
window.authSystem = new AuthSystem()
window.quizSystem = new QuizSystem()
window.digitalHub = null

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log('🚀 Digital Electronics Learning App Starting...');
  
  // Check demo mode
  if (isDemoMode()) {
    console.log('🎮 Running in Demo Mode');
    console.log('📝 Demo features:', DEMO_CONFIG.features);
    showDemoModeIndicator();
  }
  
  window.digitalHub = new DigitalElectronicsHub();
  // Initialize scroll navigation after a brief delay
  setTimeout(initializeScrollNavigation, 100);
})
