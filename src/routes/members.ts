import { Router } from 'express'; // импортируем роутер из express

import {
  getUnionMembers,
  getUnionMemberById,
  createUnionMember,
  updateUnionMemberProfile,
  updateUnionMemberAbout,
  updateUnionMemberImage,
  deleteUnionMemberById,
} from '../controllers/members';

const router = Router();

router.get('/', getUnionMembers);

router.post('/', createUnionMember);

router.get('/memberId', getUnionMemberById);

router.patch('/:memberId', updateUnionMemberProfile);

router.patch('/:memberId/about', updateUnionMemberAbout);

router.patch('/:memberId/image', updateUnionMemberImage);

router.delete('/:memberId', deleteUnionMemberById);

export default router;
