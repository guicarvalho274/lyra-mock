import styles from './styles/main.css?inline';
//import { styles } from './styles/main.generated.ts';
let injected = false;

export function installStyles() {

  if(injected) return;
  if (typeof document === 'undefined') return;


  const existing = document.getElementById('lyra-mock-styles')
  if (existing) {
    injected = true
    return
  }

  const el = document.createElement('style')
  el.id = 'lyra-mock-styles'
  el.textContent = styles
  document.head.appendChild(el)

  injected = true
}