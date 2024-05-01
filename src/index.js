// import React from 'react'
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import 'antd/dist/reset.css'

// const container = document.getElementById('root');
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/reset.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
