import { Router } from 'express'; // импортируем роутер из express

import { getContacts, createContact, updateContactData, deleteContactById } from '../controllers/contacts';
import { contactDataValidator, contactIdValidator } from '../middlwares/validators/contactValidator';

const router = Router();

router.get('/', getContacts);

router.post('/', contactDataValidator, createContact);

router.patch('/:contactId', contactIdValidator, contactDataValidator, updateContactData);

router.delete('/:contactId', contactIdValidator, deleteContactById);

export default router;
