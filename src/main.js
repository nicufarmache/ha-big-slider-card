import { LitElement, css, html } from 'lit-element';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import style from "./main.css";

class BigSliderCard extends GestureEventListeners(LitElement) {
  static get properties() {
    return { name: { type: String } };
  }

  constructor() {
    super();
    this._hass = null;
    this.config = null;
    this.name = 'World';
    this.mouseStartPos = { x:0, y:0 };
    this.mousePos = { x:0, y:0 };
    this.containerWidth = 0;
    this.oldValue = 0;
    this.currentValue = 30;
    this._updateSlider();
    Gestures.addListener(this, 'down', this._handleDown.bind(this));
    Gestures.addListener(this, 'up', this._handleUp.bind(this));
    Gestures.addListener(this, 'tap', this._handleTap.bind(this));
    Gestures.addListener(this, 'track', this._handleTrack.bind(this));
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define entity");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Example card';
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : 'unavailable';

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
    `;
  }

  _handleDown(e) {
    this._press();
  }

  _handleUp(e) {
    this._unpress();
  }

  _handleTap(e) {
    console.log('tap');
    window.navigator.vibrate(40);
  }

  _handleTrack(e) {
    this.mousePos = { x: e.detail.x, y: e.detail.y };

    switch(e.detail.state) {
      case 'start':
        this._startTrack()
        break;
      case 'track':
        this._track()
        break;
      case 'end':
        this._endTrack()
        break;
    }
  }

  _startTrack() {
    this.mouseStartPos = { x: this.mousePos.x, y: this.mousePos.y };
    this.oldValue = this.currentValue;
    this._press();
  }

  _track() {
    this._updateValue();
  }

  _endTrack() {
    this._updateValue();
    this._unpress();
  }

  _press() {
    this.setAttribute('pressed', '');
    window.navigator.vibrate(20);
  }

  _unpress() {
    this.removeAttribute('pressed');
    window.navigator.vibrate(20);
  }

  _updateValue() {
    const width = this.containerWidth;
    const x = this.mousePos.x - this.mouseStartPos.x;

    const percentage = Math.round( 100 * x / this.containerWidth );

    this.currentValue = this.oldValue + percentage;
    this._checklimits();
    this._updateSlider();
  }

  _checklimits() {
    if (this.currentValue < 0){
      this.currentValue = 0;
      this._startTrack();
    }
    if (this.currentValue > 100){
      this.currentValue = 100;
      this._startTrack();
    }
  }

  _updateSlider() {
    this.style.setProperty('--bsc-percent', ( 100 - this.currentValue ) + "%");
  }

  render() {
    return html`
    <style>
      ${style}
    </style>
    <div id="container">
      <div id="slider" ></div>
      <div id="content">
        <p>Hello, ${this.name}</p>
      </div>
    </div>
    `;
  }
  updated(changedProperties) {
    this.containerWidth = this.shadowRoot.getElementById('container').clientWidth;
  }
}

customElements.define('big-slider-card', BigSliderCard);