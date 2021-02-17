import {tonyCreateElement, Component, render } from "./tony-react.js"

class MyComponent extends Component{
  render(){
    return <div>
      <h1>My Component</h1>
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