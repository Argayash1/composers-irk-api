import { Router } from 'express'; // импортируем роутер из express

import {
  getUnionMembers,
  getUnionMemberById,
  createUnionMember,
  updateUnionMemberData,
  deleteUnionMemberById,
} from '../controllers/members';

import {
  memberDataValidator,
  memberQueryParamsValidator,
  memberIdValidator,
} from '../middlwares/validators/memberValidator';

const router = Router();

router.get('/', memberQueryParamsValidator, getUnionMembers);

router.post('/', memberDataValidator, createUnionMember);

router.get('/:memberId', memberIdValidator, getUnionMemberById);

router.patch('/:memberId', memberIdValidator, memberDataValidator, updateUnionMemberData);

router.delete('/:memberId', memberIdValidator, deleteUnionMemberById);

export default router;
