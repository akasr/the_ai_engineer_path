// Base class for form-based pages
class BasePage extends HTMLElement {
  constructor() {
    super();
    this.form = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const templateId = this.getTemplateId();
    const template = document.getElementById(templateId);
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.classList.add(this.getPageClass());
    this.form = this.querySelector(`#${this.getFormId()}`);
  }

  setupEventListeners() {
    if (!this.form) {
      console.error('Form not found');
      return;
    }

    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');

    try {
      const formData = this.getFormData();
      const validatedData = this.validateFormData(formData);
      this.updateGlobalState(validatedData);
      this.navigateNext();
    } catch (error) {
      this.handleError(error);
    }
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData.entries());
  }

  handleError(error) {
    console.error(`${this.constructor.name} error: `, error);

    const message =
      error instanceof ValidationError
        ? error.message
        : 'An unexpected error occurred. Please try again.';

    alert(message);
    this.focusFirstInvalidField();
  }

  focusFirstInvalidField() {
    const firstInput = this.form.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }
  }

  disconnectedCallback() {
    if (this.form) {
      this.form.removeEventListener('submit', this.handleFormSubmit);
    }
  }

  // Abstract methods to be implemented by subclasses
  getTemplateId() {
    throw new Error('getTemplateId must be implemented by subclass');
  }

  getPageClass() {
    throw new Error('getPageClass must be implemented by subclass');
  }

  getFormId() {
    throw new Error('getFormId must be implemented by subclass');
  }

  validateFormData(formData) {
    throw new Error('validateFormData must be implemented by subclass');
  }

  updateGlobalState(data) {
    throw new Error('updateGlobalState must be implemented by subclass');
  }

  navigateNext() {
    throw new Error('navigateNext must be implemented by subclass');
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export { BasePage, ValidationError };
