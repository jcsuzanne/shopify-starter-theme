import { piecesManager } from "../piecesManager";

export class Piece extends HTMLElement {
  constructor() {
    super();

    this.name = "Piece";
    this.template = document.createElement("template");

    if (this.innerHTML != " ") {
      this.baseHTML = this.innerHTML;
    }
  }

  //
  // Basic Custom Elements functions
  //
  connectedCallback(firstHit = true) {
    if (firstHit) {
      // Add the piece to the PiecesManager
      if (typeof this.cid == "string") {
        this.cid = this.cid;
      } else {
        this.cid = `c${piecesManager.piecesCount++}`;
      }

      piecesManager.addPiece({
        name: this.name,
        id: this.cid,
        piece: this,
      });
    } else {
      this.removeEvents();
    }

    this.privatePremount();

    if(this.baseHTML != " ") {
      this.template.innerHTML = this.render();
      this.appendChild(this.template.cloneNode(true).content);
    }

    this.privateMount();
  }

  render() {
    if (this.baseHTML != undefined) {
      return this.baseHTML;
    }
  }

  disconnectedCallback() {
    this.privateUnmount();
  }

  adoptedCallback() {
    this.adopted();
  }

  // Lifecycle - step : 0
  privatePremount() {
    this.innerHTML = "";

    if (this.log) {
      console.log("🚧 premount", this.name);
    }

    this.loadStyles();
    this.premount();
  }

  premount(){}

  // Lifecycle - step : 1
  privateMount() {
    if (this.log) {
      console.log("🔨 mount", this.name);
    }

    this.mount();
  }

  mount() {}

  // Lifecycle - step : 2
  privateUpdate() {
    if (this.log) {
      console.log("🔃 update", this.name);
    }

    this.connectedCallback(false);
  }
  update() {}

  // Lifecycle - step : 3
  privateUnmount() {
    piecesManager.removePiece({
      name: this.name,
      id: this.cid,
    });

    if (this.log) {
      console.log("👋 unmount", this.name);
    }
    this.unmount();
  }

  unmount() {}

  // Check for update
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;

    this.privateUpdate();
  }

  // Simple query to return an HTMLElement
  $(query) {
    return this.querySelectorAll(query);
  }

  //
  // Event Managment
  //
  addEvent(type, el, func) {
    if(el != null) {
      if(el.length > 1) {
        el.forEach(item => {
          item.addEventListener(type, func.bind(this));
        });
      } else if (el.length == 1) {
        el.addEventListener(type, func.bind(this));
      }
      
    }
  }

  removeEvent(type, el, func) {
    if(el != null) {
      if(el.length > 0) {
        el.forEach(item => {
          item.removeEventListener(type, func.bind(this));
        });
      } else {
        el.removeEventListener(type, func.bind(this));
      }
    }
  }

  initEvents() {}

  removeEvents() {}

  // Call function anywhere
  call(func, args, pieceName, pieceId) {
    Object.keys(piecesManager.currentPieces).forEach((name) => {
      if (name == pieceName) {
        Object.keys(piecesManager.currentPieces[name]).forEach((id) => {
          if (pieceId != undefined) {
            if (id == pieceId) {
              let piece = piecesManager.currentPieces[name][id].piece;
              piece[func](args);
            }
          } else {
            let piece = piecesManager.currentPieces[name][id].piece;
            piece[func](args);
          }
        });
      }
    });
  }

  // Dynamically load styles in the page
  async loadStyles() {
    if (this.styles != undefined) {
      const importedStyle = await import(/* @vite-ignore */ this.styles);
    }
  }

  get log() {
    return typeof this.getAttribute("log") == "string";
  }

  get cid() {
    return this.getAttribute("cid");
  }

  set cid(cid) {
    return this.setAttribute("cid", cid);
  }

  get properties() {
    return Object.values(this.attributes)
      .map((a) => `${a.name}="${a.value}"`)
      .join(" ");
  }
}
