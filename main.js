import {tonyCreateElement, Component, render } from "./tony-react.js"

class MyComponent extends Component{
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2
    }
  }
  render(){
    return <div>
      <h1>My Component</h1>
      <span>{ this.state.a.toString() }</span>
      <span>{ this.state.b.toString() }</span>
      <button onClick={() => {
        this.state.a++;
        this.state.b++;
        this.reRender();
      }}>add</button>
      {this.children}
    </div>  
  }
}

render(
  <MyComponent id="a" class="className">
  <div>123</div>
  <div></div>
  <div></div>
</MyComponent>, window.document.body);