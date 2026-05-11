import { resetItemEmailsStore } from './itemEmailsStore';
import { resetItemRelatedItemsStore } from './itemRelatedItemsStore';
import { resetItemDocumentsStore } from './itemDocumentsStore';

export function resetItemExtensionResourceStores(): void {
  resetItemEmailsStore();
  resetItemRelatedItemsStore();
  resetItemDocumentsStore();
}
