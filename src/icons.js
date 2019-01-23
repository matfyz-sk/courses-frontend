import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';

export default function loadIcons() {
  library.add(faEnvelope, faKey);
}
