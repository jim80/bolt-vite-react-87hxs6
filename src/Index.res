switch ReactDOM.querySelector("#root") {
| Some(rootElement) => {
    let root = ReactDOM.Client.createRoot(rootElement)
    ReactDOM.Client.render(root, <App />)
  }
| None => Js.Console.error("Cannot find root element")
}