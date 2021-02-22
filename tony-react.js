import { range } from "lodash";

const RENDER_TO_DOM = Symbol('render to dom')

class ElementWrapper {
  constructor(type) {
    this._root = document.createElement(type);
  }

  setAttribute(name, value) {
    if(name.match(/^on([\s\S]*)/)){
      this._root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
    }else{
      if(name === 'className') {
        this._root.setAttribute('class', value);
      }else{
        this._root.setAttribute(name, value);
      }
    }
  }

  appendChild(component) {
    let range = document.createRange();
    range.setStart(this._root, this._root.childNodes.length);
    range.setEnd(this._root, this._root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this._root);
  }
}

class TextWraper {
  constructor(content){
    this.root = document.createTextNode(content);
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

// 组件相关
export class Component {
  constructor(){
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
  }

  setAttribute(name, value){
    this.props[name] = value;
  }

  appendChild(component) {
    this.children.push(component);
  }

  [RENDER_TO_DOM](range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](this._range);
  }

  reRender() {
    this._range.deleteContents();
    this[RENDER_TO_DOM](this._range)
  }

  setState(newState){
    if(this.state === null || typeof this.state !== 'object'){
      this.state = newState;
      this.reRender();
      return;
    }
    let merge = (oldState, newState) => {
      for( let p in newState) {
        if(oldState[p] === null || typeof oldState[p] !== 'object' ){
          oldState[p] = newState[p];
        }else{
          merge(oldState[p], newState[p]);
        }
      }
    }
    merge(this.state, newState)
    this.reRender();

  }
}

// 创建元素
export function tonyCreateElement(type, attributes, ...children) {
  let e;
  if(typeof(type) === 'string') {
    e = new ElementWrapper(type);
  }else{
    e = new type;
  }
  
  for(let p in attributes){
    e.setAttribute(p, attributes[p]);
  }

  let insertChildren = (children) => {
    for(let child of children){
      if(typeof child === 'string'){
        child = new TextWraper(child);
      }
      if((typeof(child) === 'object') && (child instanceof Array)){
        insertChildren(child);
      }else{
        e.appendChild(child);
      }
    }
  }

  insertChildren(children);

  return e;
}


// 渲染
export function render(component, parentElement) {
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range)
}