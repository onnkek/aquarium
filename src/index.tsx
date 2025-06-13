import React from "react"
import ReactDOM from "react-dom/client"
import "./main.sass"
import "bootstrap/dist/css/bootstrap.css"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import App from "./components/App/App"
import store from "./redux/store"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>
)