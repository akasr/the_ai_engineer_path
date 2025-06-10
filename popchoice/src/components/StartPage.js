import {
  sanitizeInput,
  isValidPositiveInteger,
  isValidStringInput,
} from '../utils/validation.js';
import { BasePage, ValidationError } from './BasePage.js';

class StartPage extends BasePage {
  getTemplateId() {
    return 'start';
  }

  getPageClass() {
    return 'start';
  }

  getFormId() {
    return 'meta-form';
  }

  validateFormData({ people, time }) {
    if (!people || !time) {
      throw new ValidationError('Please fill in all fields');
    }

    if (!isValidPositiveInteger(people)) {
      throw new ValidationError(
        'Please enter a valid number of people (positive integer)'
      );
    }

    if (!isValidStringInput(time)) {
      throw new ValidationError('Please enter a valid time');
    }

    return {
      people: parseInt(people, 10),
      time: sanitizeInput(time),
    };
  }

  updateGlobalState({ people, time }) {
    if (!window.state) {
      window.state = {};
    }

    window.state.totalUsers = people;
    window.state.currentUser = 1;
    window.state.time = time;
  }

  navigateNext() {
    const event = new CustomEvent('start', {
      detail: {
        totalUsers: window.state.totalUsers,
        time: window.state.time,
      },
    });
    document.body.dispatchEvent(event);
  }
}

customElements.define('start-page', StartPage);
