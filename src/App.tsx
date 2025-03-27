import MainLayout from './MainLayout';
import {BrowserRouter as Router} from 'react-router-dom';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: [
      'Roboto:100',
      'Roboto:300',
      'Roboto:400',
      'Roboto:500',
      'Roboto:700',
      'Roboto:900',
      'Bungee',
    ],
  },
});

function App() {
  return (
    <Router basename="/transvoice">
      <MainLayout />
    </Router>
  );
}
export default App;
