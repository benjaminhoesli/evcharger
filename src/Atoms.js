import {
    atom
  } from 'recoil';

export const infoState = atom(
    {
    key: 'firstName',
    default: '', 
  },
  {
    key: 'lastName',
    default: '', 
  },
  {
    key: 'state',
    default: '', 
  },
  {
    key: 'city',
    default: '', 
  },
  {
    key: 'street',
    default: '', 
  },
  {
    key: 'apt',
    default: '', 
  }

  );