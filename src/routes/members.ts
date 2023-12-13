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

import {
  memberDataValidator,
  memberQueryParamsValidator,
  memberProfileDataValidator,
  memberAboutDataValidator,
  memberImageUrlValidator,
  memberIdValidator,
} from '../middlwares/validators/memberValidator';

const router = Router();

router.get('/', memberQueryParamsValidator, getUnionMembers);

router.post('/', memberDataValidator, createUnionMember);

router.get('/memberId', memberIdValidator, getUnionMemberById);

router.patch('/:memberId', memberIdValidator, memberProfileDataValidator, updateUnionMemberProfile);

router.patch('/:memberId/about', memberIdValidator, memberAboutDataValidator, updateUnionMemberAbout);

router.patch('/:memberId/image', memberIdValidator, memberImageUrlValidator, updateUnionMemberImage);

router.delete('/:memberId', memberIdValidator, deleteUnionMemberById);

export default router;
