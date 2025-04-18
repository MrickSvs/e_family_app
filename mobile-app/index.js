import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import App from './App';

// Register the app component
registerRootComponent(App);

// Also register with AppRegistry for compatibility
AppRegistry.registerComponent('main', () => App);
